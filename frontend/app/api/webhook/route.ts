import { NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';
import crypto from 'crypto';

// SePay HMAC-SHA256 Secret Key (matches your SePay Security configuration)
const SEPAY_WEBHOOK_SECRET = process.env.SEPAY_WEBHOOK_SECRET || 'whsec_6WeAGUI2PCZYjBARIJdGYGhXeaNMJcQ1';

export async function POST(request: Request) {
  try {
    // 1. Signature & Timestamp Headers Check
    const signatureHeader = request.headers.get('x-sepay-signature');
    const timestampHeader = request.headers.get('x-sepay-timestamp');
    
    if (!signatureHeader || !timestampHeader) {
      console.error('[SePay Webhook] Missing signature or timestamp header');
      return NextResponse.json({ success: false, error: 'Unauthorized: Missing required headers' }, { status: 401 });
    }

    // 2. Read raw text body for signature computation
    const rawBody = await request.text();

    // 3. Construct signing string: {timestamp}.{raw_body}
    const dataToVerify = `${timestampHeader}.${rawBody}`;

    // 4. Compute HMAC-SHA256 Hash
    const computedHash = crypto
      .createHmac('sha256', SEPAY_WEBHOOK_SECRET)
      .update(dataToVerify)
      .digest('hex');

    // 5. SePay signature format is "sha256={hash}"
    const expectedSignature = `sha256=${computedHash}`;

    // 6. Secure comparison of signatures
    if (signatureHeader.length !== expectedSignature.length) {
      console.error('[SePay Webhook] Signature length mismatch');
      return NextResponse.json({ success: false, error: 'Unauthorized: Invalid signature' }, { status: 403 });
    }

    const signatureBuffer = Buffer.from(signatureHeader);
    const expectedBuffer = Buffer.from(expectedSignature);
    const isValid = crypto.timingSafeEqual(signatureBuffer, expectedBuffer);

    if (!isValid) {
      console.error('[SePay Webhook] Signature verification failed');
      return NextResponse.json({ success: false, error: 'Unauthorized: Signature mismatch' }, { status: 403 });
    }

    // 5. Parse JSON payload from verified raw body
    const payload = JSON.parse(rawBody);
    if (!payload) {
      return NextResponse.json({ success: false, error: 'Invalid JSON payload' }, { status: 400 });
    }

    // Read payment details
    const gateway = payload.gateway;                    // e.g. "TPBank"
    const transactionDate = payload.transactionDate;    // e.g. "2026-06-22 16:55:20"
    const accountNumber = payload.accountNumber;        // Merchant bank account
    const amount = Number(payload.amount || payload.transferAmount || 0);
    const transferContent = payload.transferContent || payload.transactionContent || '';
    const referenceNumber = payload.referenceNumber;    // Unique bank transaction ID

    console.log(`[SePay Webhook] Verified bank transaction: Ref=${referenceNumber}, Amount=${amount}, Msg="${transferContent}"`);

    // 6. Extract Order ID from transaction content (Support formats: "SOIMOC_SM-123456", "SM-123456", "SOIMOC_123456", etc.)
    const match = transferContent.match(/SM[-]?(\d{6})/i) || transferContent.match(/SOIMOC[\s_-]?(\d{6})/i);
    if (!match) {
      console.log(`[SePay Webhook] Ignored transaction: No valid order ID match in content "${transferContent}"`);
      return NextResponse.json({ success: false, error: 'Order ID prefix SM-xxxxxx or SOIMOC_xxxxxx not found' }, { status: 200 });
    }

    // Reconstruct exact order ID format stored in Database (e.g. SM-123456)
    const orderId = `SM-${match[1]}`;
    console.log(`[SePay Webhook] Matching database order: ${orderId}`);

    // 7. Retrieve order from database
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      console.log(`[SePay Webhook] Error: Order ID ${orderId} not found in database`);
      return NextResponse.json({ success: false, error: `Order ${orderId} not found` }, { status: 200 });
    }

    // Prevent duplicate updates if already paid
    if (order.paymentStatus === 'paid') {
      console.log(`[SePay Webhook] Order ${orderId} is already marked paid.`);
      return NextResponse.json({ success: true, message: 'Order already paid' }, { status: 200 });
    }

    // 8. Compare amount transferred with order total amount
    if (amount >= order.totalAmount) {
      // Mark as Paid and confirm the order status
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: 'paid',
          orderStatus: 'confirmed'
        }
      });

      console.log(`[SePay Webhook] Order ${orderId} marked PAID successfully! Amount=${amount}đ`);
      return NextResponse.json({ success: true, message: 'Order updated successfully' }, { status: 200 });
    } else {
      // Handle under-payment
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: 'partial_payment'
        }
      });
      console.log(`[SePay Webhook] Order ${orderId} partial payment received. Target=${order.totalAmount}đ, Received=${amount}đ`);
      return NextResponse.json({ success: false, error: 'Insufficient payment amount' }, { status: 200 });
    }

  } catch (error: any) {
    console.error('[SePay Webhook] Error processing payment webhook:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
