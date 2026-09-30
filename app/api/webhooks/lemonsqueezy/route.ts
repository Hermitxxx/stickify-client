import { NextRequest, NextResponse } from "next/server";
import {
  verifyLemonWebhookSignature,
  processLemonWebhook,
} from "@/lib/services/lemonsqueezy.service";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-signature");

    // 1. Verify Webhook Signature (Security)
    const isValid = verifyLemonWebhookSignature(rawBody, signature);

    if (!isValid) {
      console.warn("[LemonSqueezy Webhook] Invalid webhook signature detected.");
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    // 2. Parse Payload
    const payload = JSON.parse(rawBody);

    // 3. Process Event and Record Purchase in MongoDB
    const result = await processLemonWebhook(payload);

    return NextResponse.json({
      received: true,
      result,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("[LemonSqueezy Webhook] Error processing webhook:", err);
    return NextResponse.json(
      { error: "Webhook processing error", message: err.message },
      { status: 500 }
    );
  }
}
