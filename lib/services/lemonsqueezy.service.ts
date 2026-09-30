import crypto from "crypto";
import { recordCompletedPurchase } from "@/lib/services/purchase.service";

const LEMON_API_BASE = "https://api.lemonsqueezy.com/v1";

/**
 * Returns Lemon Squeezy API authorization headers
 */
function getLemonHeaders() {
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  if (!apiKey) {
    throw new Error("LEMONSQUEEZY_API_KEY is not configured in environment variables.");
  }
  return {
    Authorization: `Bearer ${apiKey}`,
    Accept: "application/vnd.api+json",
    "Content-Type": "application/vnd.api+json",
  };
}

/**
 * Resolves the Lemon Squeezy Store ID
 */
export async function getLemonStoreId(): Promise<string> {
  const envStoreId = process.env.LEMONSQUEEZY_STORE_ID;
  if (envStoreId && envStoreId.trim() !== "") {
    return envStoreId.trim();
  }

  const res = await fetch(`${LEMON_API_BASE}/stores`, {
    headers: getLemonHeaders(),
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch Lemon Squeezy stores: ${res.status} ${errorText}`);
  }

  const json = await res.json();
  const firstStore = json.data?.[0];
  if (!firstStore) {
    throw new Error("No store found in your Lemon Squeezy account.");
  }

  return firstStore.id.toString();
}

// In-memory cache for the master variant ID to eliminate unnecessary discovery calls
let cachedMasterVariantId: string | null = null;
let cachedStoreMeta: { currency: string; minPrice: number } | null = null;

/**
 * Automatically discovers an available master variant from the Lemon Squeezy store
 * so users never have to manually add products or configure variants per skin.
 */
export async function getOrDiscoverLemonVariantId(storeId: string): Promise<string> {
  // 1. Check in-memory cache
  if (cachedMasterVariantId) {
    return cachedMasterVariantId;
  }

  // 2. Check environment variable
  const envVariantId = process.env.LEMONSQUEEZY_VARIANT_ID?.trim();
  if (envVariantId) {
    cachedMasterVariantId = envVariantId;
    return envVariantId;
  }

  try {
    // 3. Auto-discover from Lemon Squeezy store products
    const pRes = await fetch(`${LEMON_API_BASE}/products?filter[store_id]=${storeId}`, {
      headers: getLemonHeaders(),
      next: { revalidate: 300 },
    });

    if (pRes.ok) {
      const pJson = await pRes.json();
      const products = pJson.data || [];
      if (products.length > 0) {
        const firstProductId = products[0].id;
        const vRes = await fetch(`${LEMON_API_BASE}/variants?filter[product_id]=${firstProductId}`, {
          headers: getLemonHeaders(),
          next: { revalidate: 300 },
        });

        if (vRes.ok) {
          const vJson = await vRes.json();
          const variants = vJson.data || [];
          if (variants.length > 0) {
            const foundId = variants[0].id.toString();
            cachedMasterVariantId = foundId;
            return foundId;
          }
        }
      }
    }
  } catch (discoveryErr) {
    console.warn("[LemonSqueezy] Variant auto-discovery encountered an error:", discoveryErr);
  }

  // Fallback to configured variant or known store default
  return "2182991";
}

/**
 * Resolves the store currency and variant minimum price constraint
 */
export async function getStorePricingMeta(storeId: string, variantId: string): Promise<{ currency: string; minPrice: number }> {
  let currency = "USD";
  let minPrice = 0;

  try {
    const [storeRes, variantRes] = await Promise.all([
      fetch(`${LEMON_API_BASE}/stores/${storeId}`, {
        headers: getLemonHeaders(),
        cache: "no-store",
      }),
      fetch(`${LEMON_API_BASE}/variants/${variantId}`, {
        headers: getLemonHeaders(),
        cache: "no-store",
      }),
    ]);

    if (storeRes.ok) {
      const storeJson = await storeRes.json();
      currency = storeJson.data?.attributes?.currency || "USD";
    }

    if (variantRes.ok) {
      const variantJson = await variantRes.json();
      const isPayWhatYouWant = variantJson.data?.attributes?.pay_what_you_want === true;
      minPrice = isPayWhatYouWant ? (variantJson.data?.attributes?.min_price || 0) : 0;
    }
  } catch (err) {
    console.warn("[LemonSqueezy] Failed to fetch store pricing metadata:", err);
  }

  return { currency, minPrice };
}

export interface CreateCheckoutParams {
  userId: string;
  userEmail: string;
  userName: string;
  productId: string;
  productSlug: string;
  productTitle: string;
  productPrice: number;
  productImage?: string;
  selectedDevice?: string;
  variantId?: string;
  returnUrl?: string;
}

/**
 * Creates a dynamic Lemon Squeezy one-time checkout session for any skin in the catalog.
 * No manual product addition in Lemon Squeezy dashboard is required for individual skins.
 * All product details (title, price, device, image, custom data) are injected dynamically.
 */
export async function createLemonCheckout(params: CreateCheckoutParams): Promise<{
  url: string;
  checkoutId?: string;
  isTestMode?: boolean;
}> {
  const storeId = await getLemonStoreId();

  // 1. Resolve Variant ID: skin-specific override -> env -> auto-discovered master variant
  const variantId =
    params.variantId?.trim() ||
    (await getOrDiscoverLemonVariantId(storeId));

  const baseUrl =
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000";

  const txnId = `LSQ-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 9000 + 1000)}`;

  let redirectUrl: string;
  if (params.returnUrl) {
    redirectUrl = params.returnUrl.includes("?")
      ? `${params.returnUrl}&txn_id=${txnId}`
      : `${params.returnUrl}?purchased=true&txn_id=${txnId}`;
  } else {
    redirectUrl = `${baseUrl}/products/${params.productSlug}?purchased=true&txn_id=${txnId}`;
  }

  const customData: Record<string, string> = {
    user_id: String(params.userId),
    user_email: String(params.userEmail || ""),
    user_name: String(params.userName || "Collector"),
    product_id: String(params.productId),
    product_slug: String(params.productSlug),
    product_title: String(params.productTitle),
    price: String(params.productPrice),
    transaction_id: txnId,
    payment_type: "one_time",
  };

  if (params.productImage) {
    customData.product_image = params.productImage;
  }
  if (params.selectedDevice) {
    customData.selected_device = params.selectedDevice;
  }

  // 2. Resolve currency & minimum price constraints
  const { currency: storeCurrency, minPrice: variantMinPrice } =
    await getStorePricingMeta(storeId, variantId);

  // 3. Dynamic price calculation based on store currency
  // Lemon Squeezy requires custom_price to be in the smallest unit of the store's currency (cents or poisha)
  let calculatedSubunit: number;
  if (storeCurrency === "BDT") {
    // Current approximate rate: ~122 BDT per 1 USD
    calculatedSubunit = Math.round(params.productPrice * 122 * 100);
  } else if (storeCurrency === "EUR") {
    calculatedSubunit = Math.round(params.productPrice * 0.92 * 100);
  } else if (storeCurrency === "GBP") {
    calculatedSubunit = Math.round(params.productPrice * 0.79 * 100);
  } else {
    // Default USD or standard 100-cents currency
    calculatedSubunit = Math.round(params.productPrice * 100);
  }

  // Ensure price meets any minimum threshold set by the variant
  const customPriceAmount = Math.max(calculatedSubunit, variantMinPrice);

  const deviceLabel = params.selectedDevice ? ` for ${params.selectedDevice}` : "";
  const dynamicDescription = `Precision 300 DPI master vector cut file (0.05mm CAD contours)${deviceLabel}. One-time purchase with lifetime personal and commercial vinyl cutting license.`;

  const checkoutPayload = {
    data: {
      type: "checkouts",
      attributes: {
        custom_price: customPriceAmount,
        checkout_data: {
          email: params.userEmail,
          name: params.userName,
          custom: customData,
        },
        product_options: {
          name: `${params.productTitle} — Precision Skin Cut`,
          description: dynamicDescription,
          redirect_url: redirectUrl,
          receipt_button_text: "Download Cut Files in Stickify",
          receipt_link_url: redirectUrl,
          receipt_thank_you_note: "Thank you for purchasing! Your 300 DPI vector cut files are now unlocked in your Stickify account.",
        },
        checkout_options: {
          dark: true,
          button_color: "#eb7f31", // Stickify brand orange
        },
      },
      relationships: {
        store: {
          data: {
            type: "stores",
            id: String(storeId),
          },
        },
        variant: {
          data: {
            type: "variants",
            id: String(variantId),
          },
        },
      },
    },
  };

  const res = await fetch(`${LEMON_API_BASE}/checkouts`, {
    method: "POST",
    headers: getLemonHeaders(),
    body: JSON.stringify(checkoutPayload),
  });

  const responseJson = await res.json();

  if (!res.ok) {
    const errorDetail =
      responseJson.errors?.[0]?.detail ||
      responseJson.message ||
      JSON.stringify(responseJson);
    console.error("Lemon Squeezy dynamic checkout error:", responseJson);
    throw new Error(`Lemon Squeezy checkout failed: ${errorDetail}`);
  }

  const checkoutUrl = responseJson.data?.attributes?.url;
  if (!checkoutUrl) {
    throw new Error("Lemon Squeezy did not return a checkout URL.");
  }

  return {
    url: checkoutUrl,
    checkoutId: responseJson.data?.id,
  };
}

/**
 * Validates the HMAC-SHA256 signature from Lemon Squeezy webhooks
 */
export function verifyLemonWebhookSignature(
  rawBody: string,
  signatureHeader: string | null
): boolean {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret) {
    console.warn("LEMONSQUEEZY_WEBHOOK_SECRET is not configured.");
    return false;
  }

  if (!signatureHeader) {
    return false;
  }

  const hmac = crypto.createHmac("sha256", secret);
  const digest = Buffer.from(hmac.update(rawBody).digest("hex"), "utf8");
  const signature = Buffer.from(signatureHeader, "utf8");

  if (digest.length !== signature.length) {
    return false;
  }

  return crypto.timingSafeEqual(digest, signature);
}

/**
 * Processes incoming Lemon Squeezy webhook payload (order_created, order_paid)
 */
export async function processLemonWebhook(payload: Record<string, any>) {
  const meta = payload.meta as Record<string, any> | undefined;
  const eventName = meta?.event_name;
  console.log(`[LemonSqueezy Webhook] Received event: ${eventName}`);

  if (eventName === "order_created" || eventName === "order_paid") {
    const orderData = payload.data;
    const orderAttributes = orderData?.attributes || {};
    const customData = payload.meta?.custom_data || {};

    const userId = customData.user_id;
    const productId = customData.product_id;
    const productSlug = customData.product_slug;
    const userEmail = orderAttributes.user_email || customData.user_email;
    const userName = orderAttributes.user_name || customData.user_name || "Collector";
    const productTitle = customData.product_title || orderAttributes.first_order_item?.product_name || "Precision Skin Cut";
    const productImage = customData.product_image || "";
    const price = customData.price
      ? Number(customData.price)
      : typeof orderAttributes.total === "number"
      ? orderAttributes.total / 100
      : 0;
    const currency = "USD";
    const orderId = orderData.id?.toString() || `LSQ-${Date.now()}`;

    if (!userId || (!productId && !productSlug)) {
      console.warn("[LemonSqueezy Webhook] Missing userId or product identifier in custom_data:", customData);
      return { success: false, reason: "Missing user or product identifier in metadata" };
    }

    const transaction = await recordCompletedPurchase({
      userId,
      userEmail,
      userName,
      productId,
      productSlug,
      productTitle,
      productImage,
      price,
      currency,
      transactionId: `LSQ-${orderId}`,
    });

    console.log(`[LemonSqueezy Webhook] Successfully recorded purchase transaction: ${transaction.transactionId} for user ${userId}`);
    return { success: true, transactionId: transaction.transactionId };
  }

  return { success: true, message: `Event ${eventName} acknowledged without action.` };
}
