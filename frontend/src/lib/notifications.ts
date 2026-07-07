import fs from 'fs';
import path from 'path';
import prisma from '@/src/lib/prisma';

interface NotificationLog {
  id: string;
  type: 'email' | 'sms';
  recipient: string;
  subject?: string;
  content: string;
  orderId: string;
  timestamp: string;
}

// Helper to write notification logs locally to public/notification_logs.json
function logNotificationLocally(log: NotificationLog) {
  try {
    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    const logFilePath = path.join(publicDir, 'notification_logs.json');
    let logs: NotificationLog[] = [];
    if (fs.existsSync(logFilePath)) {
      try {
        const fileContent = fs.readFileSync(logFilePath, 'utf-8');
        logs = JSON.parse(fileContent);
      } catch (e) {
        console.error('Failed to parse existing notification logs:', e);
      }
    }
    // Prepend new log
    logs.unshift(log);
    // Keep last 100 logs
    if (logs.length > 100) {
      logs = logs.slice(0, 100);
    }
    fs.writeFileSync(logFilePath, JSON.stringify(logs, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing notification log locally:', err);
  }
}

// Generate HTML email templates
function getEmailHtmlTemplate(order: any, type: 'order_created' | 'payment_paid' | 'order_shipped', items: any[]) {
  const itemsHtml = items.map((item: any) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #E2E8F0;">
        <strong style="color: #1A1A1A;">${item.name}</strong><br/>
        <span style="font-size: 11px; color: #718096;">Trọng lượng: ${item.selectedWeight}</span>
      </td>
      <td style="padding: 12px; text-align: center; border-bottom: 1px solid #E2E8F0; color: #4A5568;">x${item.quantity}</td>
      <td style="padding: 12px; text-align: right; border-bottom: 1px solid #E2E8F0; font-family: monospace; color: #1A1A1A;">${(item.price * item.quantity).toLocaleString('vi-VN')}đ</td>
    </tr>
  `).join('');

  let title = '';
  let heroText = '';
  let statusBanner = '';

  if (type === 'order_created') {
    title = 'Đặt Hàng Thành Công';
    heroText = `Cảm ơn bạn đã tin chọn các sản phẩm sấy lạnh từ ngô bản địa của <strong>Sợi Mộc</strong>. Đơn hàng của bạn đã được tiếp nhận và đang chờ xác nhận.`;
    statusBanner = '#C8953A'; // Gold
  } else if (type === 'payment_paid') {
    title = 'Thanh Toán Thành Công';
    heroText = `Sợi Mộc xác nhận đã nhận được khoản thanh toán của bạn cho đơn hàng <strong>${order.id}</strong>. Chúng tôi đang nhanh chóng đóng gói sản phẩm để gửi đi.`;
    statusBanner = '#2D5A27'; // Green
  } else if (type === 'order_shipped') {
    title = 'Đơn Hàng Đang Được Vận Chuyển';
    heroText = `Đơn hàng <strong>${order.id}</strong> của bạn đã được bàn giao cho đơn vị vận chuyển. Vui lòng chú ý điện thoại để nhận hàng trong 1-3 ngày tới nhé!`;
    statusBanner = '#3182CE'; // Blue
  }

  return `
    <div style="background-color: #FAF6EE; padding: 40px 10px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #2D3748; line-height: 1.6;">
      <div style="max-w: 600px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #E2DCD0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
        
        <!-- Status color bar -->
        <div style="height: 6px; background-color: ${statusBanner};"></div>
        
        <!-- Header logo -->
        <div style="padding: 30px; text-align: center; border-bottom: 1px solid #FAF6EE;">
          <h2 style="color: #2D5A27; margin: 0; font-family: Georgia, serif; letter-spacing: 2px; font-size: 24px; text-transform: uppercase;">SỢI MỘC</h2>
          <span style="font-size: 9px; letter-spacing: 3px; color: #C8953A; font-weight: bold; text-transform: uppercase; font-family: monospace;">Đặc sản khô sấy lạnh Cao Bằng</span>
        </div>
        
        <!-- Hero section -->
        <div style="padding: 30px 40px;">
          <h1 style="color: #1A1A1A; font-size: 20px; font-family: Georgia, serif; margin-top: 0; margin-bottom: 15px; font-weight: bold; text-transform: uppercase;">${title}</h1>
          <p style="font-size: 14px; margin-bottom: 30px; color: #4A5568;">Chào ${order.customerName},</p>
          <p style="font-size: 14px; margin-bottom: 30px; color: #4A5568;">${heroText}</p>
          
          <!-- Order info box -->
          <div style="background-color: #FAF6EE; border: 1px solid #E2DCD0; padding: 20px; margin-bottom: 30px; font-size: 13px;">
            <div style="margin-bottom: 8px;"><strong>Mã đơn hàng:</strong> <span style="font-family: monospace; font-weight: bold; color: #2D5A27;">${order.id}</span></div>
            <div style="margin-bottom: 8px;"><strong>Ngày đặt:</strong> ${new Date(order.createdAt).toLocaleString('vi-VN')}</div>
            <div style="margin-bottom: 8px;"><strong>Phương thức TT:</strong> ${order.paymentMethod === 'BANK_TRANSFER' ? 'Chuyển khoản QR' : 'Thanh toán COD'}</div>
            <div style="margin-bottom: 8px;"><strong>Trạng thái TT:</strong> ${order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán'}</div>
            <div style="margin-bottom: 8px;"><strong>Địa chỉ giao hàng:</strong> ${order.customerAddress}</div>
            ${order.customerNote ? `<div style="margin-bottom: 8px;"><strong>Ghi chú:</strong> ${order.customerNote}</div>` : ''}
          </div>

          <!-- Items Table -->
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 30px;">
            <thead>
              <tr style="background-color: #FAF6EE; color: #718096; text-transform: uppercase; font-size: 10px; letter-spacing: 1px;">
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #E2DCD0;">Sản phẩm</th>
                <th style="padding: 10px; text-align: center; border-bottom: 2px solid #E2DCD0;">SL</th>
                <th style="padding: 10px; text-align: right; border-bottom: 2px solid #E2DCD0;">Tổng cộng</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding: 15px 12px 6px; text-align: right; font-weight: bold; color: #718096;">Tạm tính:</td>
                <td style="padding: 15px 12px 6px; text-align: right; font-family: monospace; font-weight: bold; color: #1A1A1A;">${order.totalAmount.toLocaleString('vi-VN')}đ</td>
              </tr>
              <tr>
                <td colspan="2" style="padding: 6px 12px; text-align: right; font-weight: bold; color: #718096;">Phí giao hàng:</td>
                <td style="padding: 6px 12px; text-align: right; font-family: monospace; font-weight: bold; color: #1A1A1A;">Miễn phí</td>
              </tr>
              <tr>
                <td colspan="2" style="padding: 12px; text-align: right; font-size: 15px; font-weight: bold; color: #2D5A27; border-top: 1.5px solid #2D5A27;">Thành tiền:</td>
                <td style="padding: 12px; text-align: right; font-size: 16px; font-family: monospace; font-weight: bold; color: #2D5A27; border-top: 1.5px solid #2D5A27;">${order.totalAmount.toLocaleString('vi-VN')}đ</td>
              </tr>
            </tfoot>
          </table>

          <!-- Footer contact -->
          <div style="border-top: 1px solid #FAF6EE; padding-top: 25px; text-align: center; font-size: 11px; color: #A0AEC0;">
            <p style="margin: 0 0 5px 0;">Nếu bạn có bất cứ thắc mắc nào, hãy liên hệ hotline Zalo: <strong>0377 159 498</strong></p>
            <p style="margin: 0;">Sợi Mộc - Ăn sạch sống khỏe từ nông sản Cao Bằng</p>
          </div>

        </div>
      </div>
    </div>
  `;
}

export async function sendOrderNotification(
  orderId: string,
  type: 'order_created' | 'payment_paid' | 'order_shipped'
) {
  try {
    // 1. Fetch complete order details
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      console.warn(`Order ${orderId} not found, skipping notification.`);
      return;
    }

    let items: any[] = [];
    try {
      items = JSON.parse(order.itemsJson);
    } catch (e) {
      console.error('Error parsing itemsJson for notification:', e);
    }

    let recipientEmail = '';
    
    // 2. If order has userId, lookup profile to get email
    if (order.userId) {
      const profile = await prisma.profile.findUnique({
        where: { id: order.userId }
      });
      if (profile && profile.email) {
        recipientEmail = profile.email;
      }
    }

    const emailHtml = getEmailHtmlTemplate(order, type, items);
    const subjectMap = {
      order_created: `[Sợi Mộc] Đặt hàng thành công - Đơn hàng #${order.id}`,
      payment_paid: `[Sợi Mộc] Xác nhận đã thanh toán - Đơn hàng #${order.id}`,
      order_shipped: `[Sợi Mộc] Đơn hàng đang được vận chuyển - Đơn hàng #${order.id}`
    };
    const subject = subjectMap[type];

    // 3. Write locally to public/notification_logs.json
    logNotificationLocally({
      id: `NOTIF-${Math.floor(100000 + Math.random() * 900000)}`,
      type: recipientEmail ? 'email' : 'sms',
      recipient: recipientEmail || order.customerPhone,
      subject: recipientEmail ? subject : undefined,
      content: recipientEmail 
        ? `Gửi Email HTML đến ${recipientEmail}` 
        : `Gửi SMS/Zalo đến số điện thoại ${order.customerPhone} với nội dung: "[Sợi Mộc] Trạng thái đơn hàng ${order.id} đã chuyển sang ${type === 'order_created' ? 'Xác nhận' : type === 'payment_paid' ? 'Đã thanh toán' : 'Đang vận chuyển'}."`,
      orderId: order.id,
      timestamp: new Date().toISOString()
    });

    // 4. Send real email via Resend if API key is configured
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey && recipientEmail) {
      console.log(`Sending real email via Resend to ${recipientEmail} for order ${order.id}...`);
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          from: 'Sợi Mộc <onboarding@resend.dev>',
          to: [recipientEmail],
          subject: subject,
          html: emailHtml
        })
      });
      
      const resData = await res.json();
      if (!res.ok) {
        console.error('Failed to send email via Resend API:', resData);
      } else {
        console.log('Email sent successfully via Resend API. Email ID:', resData.id);
      }
    } else {
      console.log(`No Resend API Key or recipient email found. Order logged in public/notification_logs.json.`);
    }

  } catch (err) {
    console.error('Error in sendOrderNotification:', err);
  }
}
