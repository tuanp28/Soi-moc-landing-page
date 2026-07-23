const { Client } = require('pg');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL;

const maleNames = ['Nguyễn Văn Nam', 'Trần Hữu Thắng', 'Phạm Minh Đức', 'Lê Hoàng Anh', 'Hoàng Gia Bảo', 'Vũ Hải Long', 'Phan Văn Đạt', 'Ngô Quốc Khánh', 'Đỗ Duy Mạnh', 'Bùi Anh Tuấn', 'Trịnh Quốc Bảo', 'Đặng Hồng Sơn', 'Nguyễn Tấn Tài', 'Võ Hoài Nam', 'Nguyễn Công Phượng'];
const femaleNames = ['Trần Thị Mai', 'Nguyễn Thu Trang', 'Phạm Thị Lan', 'Lê Khánh Huyền', 'Hoàng Mỹ Linh', 'Vũ Phương Anh', 'Phan Tuyết Vy', 'Ngô Hồng Hạnh', 'Đỗ Cẩm Vân', 'Bùi Minh Hằng', 'Trần Thu Thảo', 'Nguyễn Mai Anh', 'Phan Ngọc Trinh', 'Lê Thị Thuỷ', 'Nguyễn Thanh Hà'];
const allNames = [...maleNames, ...femaleNames];

function generateCuid() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'c';
  for (let i = 0; i < 24; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomPhone() {
  const prefixes = ['090', '091', '093', '097', '098', '034', '035', '038', '086', '077', '079'];
  const prefix = getRandomElement(prefixes);
  let suffix = '';
  for (let i = 0; i < 7; i++) {
    suffix += Math.floor(Math.random() * 10);
  }
  return prefix + suffix;
}

// Generates local time in GMT+7 format and converts to Date object
function getRandomTimeWithinConstraint(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  
  // Hours: 7 to 16
  const hour = Math.floor(Math.random() * (16 - 7 + 1)) + 7;
  let min;
  if (hour === 7) {
    // 7:30 to 7:59
    min = Math.floor(Math.random() * 30) + 30;
  } else if (hour === 16) {
    // 16:00 to 16:30
    min = Math.floor(Math.random() * 31);
  } else {
    // 0 to 59
    min = Math.floor(Math.random() * 60);
  }
  
  const sec = Math.floor(Math.random() * 60);
  date.setHours(hour, min, sec, 0);
  
  // Since setHours uses local timezone of the running Node process, we should ensure it corresponds to the correct local time
  return date;
}

async function run() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });
  await client.connect();
  console.log("Connected to database!");

  // Create list of existing generated IDs to avoid duplication
  const existingOrderIdsRes = await client.query("SELECT id FROM orders");
  const existingIds = new Set(existingOrderIdsRes.rows.map(r => r.id));

  function generateOrderId() {
    let orderId;
    do {
      const randomCode = Math.floor(100000 + Math.random() * 900000);
      orderId = `SM-${randomCode}`;
    } while (existingIds.has(orderId));
    existingIds.add(orderId);
    return orderId;
  }

  const targetDates = [
    '2026-07-11',
    '2026-07-12',
    '2026-07-13',
    '2026-07-14',
    '2026-07-15',
    '2026-07-16'
  ];

  // Prepare 5 screenshot orders with randomized timestamps from targetDates between 7:30 and 16:30
  const ordersToInsert = [
    {
      customerName: 'Nguyễn Thị Tuyết',
      customerPhone: getRandomPhone(),
      customerAddress: 'Số 45 Ngõ 198 Xã Đàn, Đống Đa, Hà Nội',
      paymentMethod: 'BANK_TRANSFER',
      paymentStatus: 'paid',
      orderStatus: 'completed',
      totalAmount: 110000,
      createdAt: getRandomTimeWithinConstraint(getRandomElement(targetDates)),
      items: [
        { productId: 'bun-cam-cao-tuyen', name: 'BÚN CẨM CAO TUYỀN', selectedWeight: '500g', quantity: 2, price: 35000 },
        { productId: 'bun-den-cao-tuyen', name: 'BÚN ĐEN CAO TUYỀN', selectedWeight: '500g', quantity: 1, price: 40000 }
      ]
    },
    {
      customerName: 'Nguyễn Thị Hải Yến',
      customerPhone: getRandomPhone(),
      customerAddress: 'Căn 12A Tòa C1, Vinhomes D\'Capitale, Cầu Giấy, Hà Nội',
      paymentMethod: 'BANK_TRANSFER',
      paymentStatus: 'paid',
      orderStatus: 'completed',
      totalAmount: 200000,
      createdAt: getRandomTimeWithinConstraint(getRandomElement(targetDates)),
      items: [
        { productId: 'bun-den-cao-tuyen', name: 'BÚN ĐEN CAO TUYỀN', selectedWeight: '500g', quantity: 5, price: 40000 }
      ]
    },
    {
      customerName: 'Lê Thị Ánh',
      customerPhone: getRandomPhone(),
      customerAddress: 'Số 8 Ngõ 10 Láng Hạ, Ba Đình, Hà Nội',
      paymentMethod: 'BANK_TRANSFER',
      paymentStatus: 'paid',
      orderStatus: 'completed',
      totalAmount: 40000,
      createdAt: getRandomTimeWithinConstraint(getRandomElement(targetDates)),
      items: [
        { productId: 'bun-den-cao-tuyen', name: 'BÚN ĐEN CAO TUYỀN', selectedWeight: '500g', quantity: 1, price: 40000 }
      ]
    },
    {
      customerName: 'Phạm Thị Đang',
      customerPhone: getRandomPhone(),
      customerAddress: '45 Lê Lợi, Hải Châu, Đà Nẵng',
      paymentMethod: 'BANK_TRANSFER',
      paymentStatus: 'paid',
      orderStatus: 'completed',
      totalAmount: 105000,
      createdAt: getRandomTimeWithinConstraint(getRandomElement(targetDates)),
      items: [
        { productId: 'bun-cam-cao-tuyen', name: 'BÚN CẨM CAO TUYỀN', selectedWeight: '500g', quantity: 3, price: 35000 }
      ]
    },
    {
      customerName: 'Nguyễn Khánh Duy',
      customerPhone: getRandomPhone(),
      customerAddress: '120 Trần Hưng Đạo, Quận 1, TP Hồ Chí Minh',
      paymentMethod: 'BANK_TRANSFER',
      paymentStatus: 'paid',
      orderStatus: 'completed',
      totalAmount: 35000,
      createdAt: getRandomTimeWithinConstraint(getRandomElement(targetDates)),
      items: [
        { productId: 'pho-ngo-premium', name: 'PHỞ NGÔ KHÔ PREMIUM', selectedWeight: '500g', quantity: 1, price: 35000 }
      ]
    }
  ];

  console.log(`Inserting exactly 5 orders with date and time constraints...`);

  await client.query('BEGIN');
  try {
    let orderCount = 0;
    let historyCount = 0;

    for (const ord of ordersToInsert) {
      const orderId = generateOrderId();
      console.log(`Inserting order ${orderId} for ${ord.customerName} on ${ord.createdAt.toISOString()}`);

      // Insert Order
      await client.query(`
        INSERT INTO orders (id, customer_name, customer_phone, customer_address, customer_note, payment_method, payment_status, order_status, total_amount, items_json, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `, [
        orderId,
        ord.customerName,
        ord.customerPhone,
        ord.customerAddress,
        null,
        ord.paymentMethod,
        ord.paymentStatus,
        ord.orderStatus,
        ord.totalAmount,
        JSON.stringify(ord.items),
        ord.createdAt
      ]);
      orderCount++;

      // Create history status updates
      const t0 = ord.createdAt;
      
      // 1. waiting_confirm
      const h1Id = generateCuid();
      await client.query(`
        INSERT INTO order_status_history (id, order_id, status, changed_by, changed_at, note)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [h1Id, orderId, 'waiting_confirm', 'Khách hàng', t0, 'Đơn hàng mới đã được khởi tạo thành công.']);
      historyCount++;

      // 2. paid (BANK_TRANSFER paid instantly 2-7 mins later)
      const payTime = new Date(t0.getTime() + (2 * 60 * 1000 + Math.random() * 5 * 60 * 1000));
      const h2Id = generateCuid();
      await client.query(`
        INSERT INTO order_status_history (id, order_id, status, changed_by, changed_at, note)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [h2Id, orderId, 'paid', 'Admin (Admin)', payTime, 'Trạng thái thanh toán chuyển sang: paid']);
      historyCount++;

      // 3. confirmed (10-30 mins later)
      const confirmTime = new Date(t0.getTime() + (10 * 60 * 1000 + Math.random() * 20 * 60 * 1000));
      const h3Id = generateCuid();
      await client.query(`
        INSERT INTO order_status_history (id, order_id, status, changed_by, changed_at, note)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [h3Id, orderId, 'confirmed', 'Admin (Admin)', confirmTime, 'Trạng thái đơn hàng chuyển sang: confirmed']);
      historyCount++;

      // 4. shipping (2-5 hours later)
      const shippingTime = new Date(t0.getTime() + (2 * 60 * 60 * 1000 + Math.random() * 3 * 60 * 60 * 1000));
      const h4Id = generateCuid();
      await client.query(`
        INSERT INTO order_status_history (id, order_id, status, changed_by, changed_at, note)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [h4Id, orderId, 'shipping', 'Admin (Admin)', shippingTime, 'Trạng thái đơn hàng chuyển sang: shipping']);
      historyCount++;

      // 5. completed (18-28 hours later)
      const completedTime = new Date(t0.getTime() + (18 * 60 * 60 * 1000 + Math.random() * 10 * 60 * 60 * 1000));
      const h5Id = generateCuid();
      await client.query(`
        INSERT INTO order_status_history (id, order_id, status, changed_by, changed_at, note)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [h5Id, orderId, 'completed', 'Admin (Admin)', completedTime, 'Trạng thái đơn hàng chuyển sang: completed']);
      historyCount++;
    }

    await client.query('COMMIT');
    console.log(`Successfully committed changes!`);
    console.log(`Inserted ${orderCount} orders.`);
    console.log(`Inserted ${historyCount} order status history records.`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Transaction rolled back due to error:', err);
  } finally {
    await client.end();
  }
}

run().catch(console.error);
