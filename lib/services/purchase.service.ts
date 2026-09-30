import { connectToDatabase } from "@/lib/db/mongoose";
import TransactionModel, { ITransaction } from "@/lib/models/transaction.model";
import ProductModel from "@/lib/models/product.model";
import mongoose from "mongoose";

export interface RecordPurchaseParams {
  userId: string;
  userEmail: string;
  userName: string;
  productId: string;
  productSlug?: string;
  productTitle?: string;
  productImage?: string;
  price: number;
  currency?: string;
  transactionId: string;
  licenseType?: string;
  formats?: string[];
}

/**
 * Checks whether a specific user owns (has purchased) a specific skin product.
 * Accepts either a MongoDB ObjectId string or a product slug, and matches on userId or userEmail.
 */
export async function checkUserSkinOwnership(
  userId: string,
  productIdentifier: string,
  userEmail?: string
): Promise<boolean> {
  if ((!userId && !userEmail) || !productIdentifier) return false;

  await connectToDatabase();

  const userConditions: Record<string, unknown>[] = [];
  if (userId) userConditions.push({ userId });
  if (userEmail) userConditions.push({ userEmail });

  const productConditions: Record<string, unknown>[] = [
    { productSlug: productIdentifier },
  ];
  if (mongoose.Types.ObjectId.isValid(productIdentifier)) {
    productConditions.push({
      productId: new mongoose.Types.ObjectId(productIdentifier),
    });
  }

  const query: Record<string, unknown> = {
    status: "completed",
    $and: [
      { $or: userConditions },
      { $or: productConditions },
    ],
  };

  const txn = await TransactionModel.findOne(query).select("_id").lean();
  return Boolean(txn);
}

/**
 * Returns a list of all product slugs and IDs purchased by a user.
 */
export async function getUserPurchasedProductIdentifiers(
  userId: string,
  userEmail?: string
): Promise<{ slugs: string[]; productIds: string[] }> {
  if (!userId && !userEmail) return { slugs: [], productIds: [] };

  await connectToDatabase();

  const userConditions: Record<string, unknown>[] = [];
  if (userId) userConditions.push({ userId });
  if (userEmail) userConditions.push({ userEmail });

  const transactions = await TransactionModel.find({
    $or: userConditions,
    status: "completed",
  })
    .select("productSlug productId")
    .lean();

  const slugs: string[] = [];
  const productIds: string[] = [];

  for (const t of transactions) {
    if (t.productSlug && !slugs.includes(t.productSlug)) slugs.push(t.productSlug);
    if (t.productId && !productIds.includes(t.productId.toString())) {
      productIds.push(t.productId.toString());
    }
  }

  return { slugs, productIds };
}

/**
 * Records a verified completed purchase transaction into MongoDB.
 * Implements strict idempotency via transactionId and user/product uniqueness.
 */
export async function recordCompletedPurchase(
  params: RecordPurchaseParams
): Promise<ITransaction> {
  await connectToDatabase();

  // 1. Check for existing transaction by transactionId
  const existingByTxn = await TransactionModel.findOne({
    transactionId: params.transactionId,
  }).lean();

  if (existingByTxn) {
    if (existingByTxn.status !== "completed") {
      await TransactionModel.updateOne(
        { _id: existingByTxn._id },
        { $set: { status: "completed" } }
      );
    }
    return {
      _id: existingByTxn._id.toString(),
      userId: existingByTxn.userId,
      userEmail: existingByTxn.userEmail,
      userName: existingByTxn.userName,
      productId: existingByTxn.productId.toString(),
      productTitle: existingByTxn.productTitle,
      productSlug: existingByTxn.productSlug,
      productImage: existingByTxn.productImage,
      price: existingByTxn.price,
      currency: existingByTxn.currency,
      status: "completed",
      transactionId: existingByTxn.transactionId,
      licenseType: existingByTxn.licenseType,
      formats: existingByTxn.formats,
      createdAt: existingByTxn.createdAt ? new Date(existingByTxn.createdAt).toISOString() : undefined,
      updatedAt: existingByTxn.updatedAt ? new Date(existingByTxn.updatedAt).toISOString() : undefined,
    };
  }

  // 2. Fetch product details if needed
  let productDoc: any = null;
  if (mongoose.Types.ObjectId.isValid(params.productId)) {
    productDoc = await ProductModel.findById(params.productId).lean();
  }
  if (!productDoc && params.productSlug) {
    productDoc = await ProductModel.findOne({ slug: params.productSlug }).lean();
  }

  const finalTitle = params.productTitle || productDoc?.title || "Stickify Precision Skin";
  const finalSlug = params.productSlug || productDoc?.slug || params.productId;
  const finalImage = params.productImage || productDoc?.image || "/hero.png";
  const finalPrice = params.price ?? productDoc?.price ?? 0;
  const finalProductId = productDoc?._id || (mongoose.Types.ObjectId.isValid(params.productId) ? new mongoose.Types.ObjectId(params.productId) : new mongoose.Types.ObjectId());
  const finalFormats = params.formats || productDoc?.formats || ["PNG", "SVG"];
  const finalLicense =
    params.licenseType || "Precision Cut & Vinyl Commercial License (300 DPI)";

  // 3. Check if user already owns this product (idempotency by user & product)
  const userConditions: Record<string, unknown>[] = [{ userId: params.userId }];
  if (params.userEmail) userConditions.push({ userEmail: params.userEmail });

  const existingForUser = await TransactionModel.findOne({
    $or: userConditions,
    $and: [
      {
        $or: [
          { productId: finalProductId },
          { productSlug: finalSlug },
        ],
      },
    ],
    status: "completed",
  }).lean();

  if (existingForUser) {
    return {
      _id: existingForUser._id.toString(),
      userId: existingForUser.userId,
      userEmail: existingForUser.userEmail,
      userName: existingForUser.userName,
      productId: existingForUser.productId.toString(),
      productTitle: existingForUser.productTitle,
      productSlug: existingForUser.productSlug,
      productImage: existingForUser.productImage,
      price: existingForUser.price,
      currency: existingForUser.currency,
      status: "completed",
      transactionId: existingForUser.transactionId,
      licenseType: existingForUser.licenseType,
      formats: existingForUser.formats,
      createdAt: existingForUser.createdAt ? new Date(existingForUser.createdAt).toISOString() : undefined,
      updatedAt: existingForUser.updatedAt ? new Date(existingForUser.updatedAt).toISOString() : undefined,
    };
  }

  const newTxn = await TransactionModel.create({
    userId: params.userId,
    userEmail: params.userEmail,
    userName: params.userName,
    productId: finalProductId,
    productTitle: finalTitle,
    productSlug: finalSlug,
    productImage: finalImage,
    price: finalPrice,
    currency: params.currency || "USD",
    status: "completed",
    transactionId: params.transactionId,
    licenseType: finalLicense,
    formats: finalFormats,
  });

  return {
    _id: newTxn._id.toString(),
    userId: newTxn.userId,
    userEmail: newTxn.userEmail,
    userName: newTxn.userName,
    productId: newTxn.productId.toString(),
    productTitle: newTxn.productTitle,
    productSlug: newTxn.productSlug,
    productImage: newTxn.productImage,
    price: newTxn.price,
    currency: newTxn.currency,
    status: newTxn.status,
    transactionId: newTxn.transactionId,
    licenseType: newTxn.licenseType,
    formats: newTxn.formats,
    createdAt: newTxn.createdAt ? new Date(newTxn.createdAt).toISOString() : undefined,
    updatedAt: newTxn.updatedAt ? new Date(newTxn.updatedAt).toISOString() : undefined,
  };
}

/**
 * Ensures a user's purchase of a skin is permanently confirmed in the database.
 */
export async function confirmUserPurchase(params: {
  userId: string;
  userEmail: string;
  userName: string;
  productSlug: string;
  transactionId?: string;
}): Promise<ITransaction | null> {
  await connectToDatabase();

  const product = await ProductModel.findOne({ slug: params.productSlug }).lean();
  if (!product) return null;

  const txnId =
    params.transactionId ||
    `CONF-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 9000 + 1000)}`;

  return await recordCompletedPurchase({
    userId: params.userId,
    userEmail: params.userEmail,
    userName: params.userName,
    productId: product._id.toString(),
    productSlug: product.slug,
    productTitle: product.title,
    productImage: product.image,
    price: product.price,
    currency: "USD",
    transactionId: txnId,
    licenseType: "Commercial & Personal Vinyl Cut License (300 DPI)",
    formats: product.formats || ["PNG", "SVG"],
  });
}
