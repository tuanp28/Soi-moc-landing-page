const { Client } = require('pg');

const connectionString = "postgresql://postgres.wanuvqejxogotqrxmdck:Database12901728@aws-1-ap-south-1.pooler.supabase.com:5432/postgres?pgbouncer=true&connection_limit=10&statement_cache_size=0";

const maleNames = ['Nguyễn Văn Nam', 'Trần Hữu Thắng', 'Phạm Minh Đức', 'Lê Hoàng Anh', 'Hoàng Gia Bảo', 'Vũ Hải Long', 'Phan Văn Đạt', 'Ngô Quốc Khánh', 'Đỗ Duy Mạnh', 'Bùi Anh Tuấn', 'Trịnh Quốc Bảo', 'Đặng Hồng Sơn', 'Nguyễn Tấn Tài', 'Võ Hoài Nam', 'Nguyễn Công Phượng'];
const femaleNames = ['Trần Thị Mai', 'Nguyễn Thu Trang', 'Phạm Thị Lan', 'Lê Khánh Huyền', 'Hoàng Mỹ Linh', 'Vũ Phương Anh', 'Phan Tuyết Vy', 'Ngô Hồng Hạnh', 'Đỗ Cẩm Vân', 'Bùi Minh Hằng', 'Trần Thu Thảo', 'Nguyễn Mai Anh', 'Phan Ngọc Trinh', 'Lê Thị Thuỷ', 'Nguyễn Thanh Hà'];
const allNames = [...maleNames, ...femaleNames];

const addresses = [
  { province: 'Hà Nội', addr: 'Số 15 Ngõ 12 Chùa Bộc, Đống Đa' },
  { province: 'Hà Nội', addr: 'Chung cư Golden Land, 275 Nguyễn Trãi, Thanh Xuân' },
  { province: 'Hà Nội', addr: 'Biệt thự BT4, KĐT Mỹ Đình 2, Nam Từ Liêm' },
  { province: 'TP Hồ Chí Minh', addr: '128/4 Nguyễn Trãi, Quận 5' },
  { province: 'TP Hồ Chí Minh', addr: 'Chung cư Vinhomes Central Park, Bình Thạnh' },
  { province: 'Đà Nẵng', addr: '82 Trần Phú, Hải Châu' },
  { province: 'Hà Nội', addr: 'Số 5 Ngõ 95 Chùa Bộc, Đống Đa' },
  { province: 'Các tỉnh khác', addr: '12 Lương Ngọc Quyến, TP Thái Nguyên, Thái Nguyên' },
  { province: 'Các tỉnh khác', addr: '45 Trần Hưng Đạo, TP Hạ Long, Quảng Ninh' },
  { province: 'Các tỉnh khác', addr: '22 Hùng Vương, TP Việt Trì, Phú Thọ' },
  { province: 'Hà Nội', addr: 'Số 8 Ngõ 10 Láng Hạ, Ba Đình' },
  { province: 'TP Hồ Chí Minh', addr: '246 Điện Biên Phủ, Quận 3' },
  { province: 'Đà Nẵng', addr: '154 Lê Duẩn, Thanh Khê' },
  { province: 'Các tỉnh khác', addr: '56 Trần Hưng Đạo, TP Quy Nhơn, Bình Định' },
  { province: 'Các tỉnh khác', addr: '102 Nguyễn Huệ, TP Huế, Thừa Thiên Huế' }
];

const products = [
  { id: 'bun-cam-cao-tuyen', name: 'BÚN CẨM CAO TUYỀN', price: 35000, weight: 0.5, weightStr: '500g' },
  { id: 'bun-den-cao-tuyen', name: 'BÚN ĐEN CAO TUYỀN', price: 40000, weight: 0.5, weightStr: '500g' },
  { id: 'bun-ngu-sac-cao-tuyen', name: 'BÚN NGŨ SẮC CAO TUYỀN', price: 40000, weight: 0.5, weightStr: '500g' },
  { id: 'pho-ngo-premium', name: 'PHỞ NGÔ KHÔ PREMIUM', price: 35000, weight: 0.5, weightStr: '500g' },
  { id: 'bun-ngo-premium', name: 'BÚN NGÔ KHÔ PREMIUM', price: 32000, weight: 0.5, weightStr: '500g' },
  { id: 'pho-ngu-sac', name: 'PHỞ NGŨ SẮC CAO BẰNG', price: 80000, weight: 1.0, weightStr: '1kg' }
];

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

function getRandomTimeBetween(baseDateStr, startHour, startMin, endHour, endMin) {
  const date = new Date(baseDateStr + 'T00:00:00');
  const hour = Math.floor(Math.random() * (endHour - startHour + 1)) + startHour;
  let min;
  if (hour === startHour) {
    min = Math.floor(Math.random() * (60 - startMin)) + startMin;
  } else if (hour === endHour) {
    min = Math.floor(Math.random() * endMin);
  } else {
    min = Math.floor(Math.random() * 60);
  }
  const sec = Math.floor(Math.random() * 60);
  date.setHours(hour, min, sec, 0);
  return date;
}

function getShippingFee(province, subtotal, totalWeight) {
  const isFreeShipping = subtotal >= 500000 || totalWeight >= 5.0;
  if (isFreeShipping) return 0;
  
  if (province === 'Hà Nội') return 25000;
  if (province === 'TP Hồ Chí Minh' || province === 'Đà Nẵng') return 35000;
  if (province === 'Thạch Thất' || province === 'Quốc Oai') return 0;
  return 38000;
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

  // 1. Prepare Screenshot Orders
  const screenshotOrders = [
    {
      customerName: 'Nguyễn Thị Tuyết',
      customerPhone: getRandomPhone(),
      customerAddress: 'Số 45 Ngõ 198 Xã Đàn, Đống Đa, Hà Nội',
      paymentMethod: 'BANK_TRANSFER',
      paymentStatus: 'paid',
      orderStatus: 'completed',
      totalAmount: 110000,
      createdAt: new Date('2026-07-16T20:25:00'),
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
      createdAt: new Date('2026-07-16T19:25:00'),
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
      createdAt: new Date('2026-07-16T17:27:00'),
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
      createdAt: new Date('2026-07-18T11:05:00'),
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
      createdAt: new Date('2026-07-18T19:05:00'),
      items: [
        { productId: 'pho-ngo-premium', name: 'PHỞ NGÔ KHÔ PREMIUM', selectedWeight: '500g', quantity: 1, price: 35000 }
      ]
    }
  ];

  // 2. Generate Random Orders
  const dates = [
    '2026-07-11',
    '2026-07-12',
    '2026-07-13',
    '2026-07-14',
    '2026-07-15',
    '2026-07-16',
    '2026-07-17'
  ];

  const generatedOrders = [];

  for (const dateStr of dates) {
    // Generate 3 to 5 random orders per day
    const numOrders = Math.floor(Math.random() * 3) + 3; // 3, 4, 5
    for (let i = 0; i < numOrders; i++) {
      const createdAt = getRandomTimeBetween(dateStr, 7, 40, 22, 30);
      const customerName = getRandomElement(allNames);
      const customerPhone = getRandomPhone();
      const addrObj = getRandomElement(addresses);
      const customerAddress = addrObj.province ? `${addrObj.addr}, ${addrObj.province}` : addrObj.addr;
      
      // Determine items
      const numItems = Math.floor(Math.random() * 3) + 1; // 1, 2, 3 distinct products
      const selectedProducts = [];
      const shuffledProducts = [...products].sort(() => 0.5 - Math.random());
      
      let computedTotal = 0;
      let totalQuantity = 0;
      let totalWeight = 0;
      const orderItems = [];

      for (let j = 0; j < numItems; j++) {
        const prod = shuffledProducts[j];
        const quantity = Math.floor(Math.random() * 3) + 1; // 1, 2, 3 of this product
        computedTotal += prod.price * quantity;
        totalQuantity += quantity;
        totalWeight += prod.weight * quantity;

        orderItems.push({
          productId: prod.id,
          name: prod.name,
          selectedWeight: prod.weightStr,
          quantity: quantity,
          price: prod.price
        });
      }

      // 5% discount if quantity >= 3
      let comboDiscount = 0;
      if (totalQuantity >= 3) {
        comboDiscount = Math.round(computedTotal * 0.05);
      }

      const shippingFee = getShippingFee(addrObj.province, computedTotal, totalWeight);
      const finalAmount = computedTotal - comboDiscount + shippingFee;

      const paymentMethod = Math.random() < 0.25 ? 'BANK_TRANSFER' : 'COD';

      generatedOrders.push({
        customerName,
        customerPhone,
        customerAddress,
        paymentMethod,
        paymentStatus: 'paid',
        orderStatus: 'completed',
        totalAmount: finalAmount,
        createdAt,
        items: orderItems
      });
    }
  }

  // Combine all orders to insert
  const allOrdersToInsert = [...screenshotOrders, ...generatedOrders];
  console.log(`Inserting a total of ${allOrdersToInsert.length} orders...`);

  await client.query('BEGIN');
  try {
    let orderCount = 0;
    let historyCount = 0;

    for (const ord of allOrdersToInsert) {
      const orderId = generateOrderId();

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

      // 2. paid
      // BANK_TRANSFER orders are paid instantly. COD is paid when completed.
      const payTime = new Date(t0.getTime() + (ord.paymentMethod === 'BANK_TRANSFER' 
        ? (2 * 60 * 1000 + Math.random() * 5 * 60 * 1000) // 2-7 mins later
        : (20 * 60 * 60 * 1000 + Math.random() * 6 * 60 * 60 * 1000) // 20-26 hours later
      ));
      const h2Id = generateCuid();
      await client.query(`
        INSERT INTO order_status_history (id, order_id, status, changed_by, changed_at, note)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [h2Id, orderId, 'paid', 'Admin (Admin)', payTime, 'Trạng thái thanh toán chuyển sang: paid']);
      historyCount++;

      // 3. confirmed
      const confirmTime = new Date(t0.getTime() + (10 * 60 * 1000 + Math.random() * 20 * 60 * 1000)); // 10-30 mins later
      const h3Id = generateCuid();
      await client.query(`
        INSERT INTO order_status_history (id, order_id, status, changed_by, changed_at, note)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [h3Id, orderId, 'confirmed', 'Admin (Admin)', confirmTime, 'Trạng thái đơn hàng chuyển sang: confirmed']);
      historyCount++;

      // 4. shipping
      const shippingTime = new Date(t0.getTime() + (2 * 60 * 60 * 1000 + Math.random() * 3 * 60 * 60 * 1000)); // 2-5 hours later
      const h4Id = generateCuid();
      await client.query(`
        INSERT INTO order_status_history (id, order_id, status, changed_by, changed_at, note)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [h4Id, orderId, 'shipping', 'Admin (Admin)', shippingTime, 'Trạng thái đơn hàng chuyển sang: shipping']);
      historyCount++;

      // 5. completed
      const completedTime = new Date(t0.getTime() + (18 * 60 * 60 * 1000 + Math.random() * 10 * 60 * 60 * 1000)); // 18-28 hours later
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
