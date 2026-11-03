/* ================= SQL LAB ================= */
const SHOP_DB = `
CREATE TABLE customers(id INTEGER PRIMARY KEY, name TEXT, city TEXT, joined_at TEXT);
CREATE TABLE products(id INTEGER PRIMARY KEY, name TEXT, category TEXT, price REAL);
CREATE TABLE orders(id INTEGER PRIMARY KEY, customer_id INTEGER, order_date TEXT, status TEXT);
CREATE TABLE order_items(order_id INTEGER, product_id INTEGER, qty INTEGER, unit_price REAL);
CREATE TABLE employees(id INTEGER PRIMARY KEY, name TEXT, manager_id INTEGER, dept TEXT, salary REAL);
INSERT INTO customers VALUES
 (1,'Anan','Bangkok','2025-06-10'),(2,'Bee','Chiang Mai','2025-08-01'),(3,'Chai','Bangkok','2025-09-15'),
 (4,'Dao','Phuket','2025-11-20'),(5,'Ek','Khon Kaen','2026-01-05'),(6,'Fon','Bangkok','2026-02-14'),(7,'Gun','Chiang Mai','2026-03-01');
INSERT INTO products VALUES
 (1,'Jasmine Rice 5kg','FOOD',250),(2,'Fish Sauce','FOOD',45),(3,'Shampoo','HOME',120),(4,'Dish Soap','HOME',60),
 (5,'Phone Charger','ELEC',350),(6,'USB Cable','ELEC',90),(7,'Notebook','STATIONERY',35),(8,'Pen Set','STATIONERY',80);
INSERT INTO orders VALUES
 (101,1,'2026-01-03','PAID'),(102,2,'2026-01-15','PAID'),(103,1,'2026-01-28','CANCELLED'),(104,3,'2026-02-02','PAID'),
 (105,4,'2026-02-10','PAID'),(106,1,'2026-02-20','PAID'),(107,5,'2026-03-05','PENDING'),(108,3,'2026-03-12','PAID'),
 (109,2,'2026-03-31 18:30','PAID'),(110,6,'2026-04-01','PAID'),(111,4,'2025-12-30','PAID'),(112,3,'2026-03-20','PAID');
INSERT INTO order_items VALUES
 (101,1,2,250),(101,2,3,45),(102,5,1,350),(102,6,2,90),(103,3,1,120),(104,1,1,250),(104,3,2,120),(104,4,1,60),
 (105,5,2,330),(105,7,5,35),(106,6,3,90),(106,8,1,80),(107,1,4,250),(108,2,10,45),(108,4,3,60),(109,1,2,240),
 (109,5,1,350),(110,7,10,35),(111,3,2,120),(112,8,2,80),(112,6,1,90);
INSERT INTO employees VALUES
 (1,'Somchai',NULL,'MGMT',150000),(2,'Suda',1,'IT',90000),(3,'Pong',1,'SALES',85000),(4,'Ploy',2,'IT',60000),
 (5,'Ton',2,'IT',60000),(6,'Mint',2,'IT',52000),(7,'Arm',3,'SALES',45000),(8,'Beam',3,'SALES',48000),(9,'Nok',4,'IT',35000);`;

const SQL_EX = [
{t:'ยอดขายตามหมวด (PAID เท่านั้น)',lv:'B',d:'แสดง category, revenue (= SUM(qty × unit_price)) เฉพาะ order ที่ status = \'PAID\' เรียง revenue มากไปน้อย',
 ref:"SELECT p.category, SUM(i.qty * i.unit_price) AS revenue\nFROM order_items i\nJOIN orders o ON o.id = i.order_id\nJOIN products p ON p.id = i.product_id\nWHERE o.status = 'PAID'\nGROUP BY p.category\nORDER BY revenue DESC;"},
{t:'ลูกค้าที่ไม่เคยมี order เลย',lv:'B',d:'แสดง name ของลูกค้าที่ไม่มี order (สถานะใดก็ได้) เรียงตาม name',
 ref:"SELECT c.name\nFROM customers c\nLEFT JOIN orders o ON o.customer_id = c.id\nWHERE o.id IS NULL\nORDER BY c.name;"},
{t:'หมวดที่ขายดี: COUNT DISTINCT + HAVING',lv:'I',d:'สำหรับ order ที่ PAID แสดง category, order_count (จำนวน order ไม่ซ้ำที่มีสินค้าหมวดนั้น), revenue เฉพาะหมวดที่ revenue ≥ 1000 เรียง revenue มากไปน้อย ถ้าเท่ากันเรียง category',
 ref:"SELECT p.category, COUNT(DISTINCT o.id) AS order_count, SUM(i.qty * i.unit_price) AS revenue\nFROM order_items i\nJOIN orders o ON o.id = i.order_id\nJOIN products p ON p.id = i.product_id\nWHERE o.status = 'PAID'\nGROUP BY p.category\nHAVING SUM(i.qty * i.unit_price) >= 1000\nORDER BY revenue DESC, p.category;"},
{t:'ยอด PAID ไตรมาส 1/2026 (ระวังขอบเวลา)',lv:'I',d:'แสดง order_id, order_date, total (ผลรวมของ order) ของ order ที่ PAID และ order_date อยู่ระหว่าง 1 ม.ค. – 31 มี.ค. 2026 (บาง order มีเวลาติดมาด้วย) เรียงตาม order_date',
 ref:"SELECT o.id AS order_id, o.order_date, SUM(i.qty * i.unit_price) AS total\nFROM orders o\nJOIN order_items i ON i.order_id = o.id\nWHERE o.status = 'PAID'\n  AND o.order_date >= '2026-01-01' AND o.order_date < '2026-04-01'\nGROUP BY o.id, o.order_date\nORDER BY o.order_date;"},
{t:'ลูกค้าที่ใช้จ่ายมากกว่าค่าเฉลี่ย (CTE)',lv:'I',d:'คำนวณยอดใช้จ่าย PAID รวมต่อลูกค้า แล้วแสดง name, spent เฉพาะลูกค้าที่ spent มากกว่าค่าเฉลี่ยของ spent (เฉลี่ยเฉพาะลูกค้าที่มียอด) เรียง spent มากไปน้อย',
 ref:"WITH spend AS (\n  SELECT c.name, SUM(i.qty * i.unit_price) AS spent\n  FROM customers c\n  JOIN orders o ON o.customer_id = c.id AND o.status = 'PAID'\n  JOIN order_items i ON i.order_id = o.id\n  GROUP BY c.id, c.name)\nSELECT name, spent FROM spend\nWHERE spent > (SELECT AVG(spent) FROM spend)\nORDER BY spent DESC;"},
{t:'สินค้าขายดีอันดับ 1 ของแต่ละหมวด (top-N per group)',lv:'I',d:'จาก order ที่ PAID แสดง category, name, revenue ของสินค้าที่ revenue สูงสุดในแต่ละหมวด (ถ้าเท่ากันเลือก name ที่มาก่อนตามตัวอักษร) เรียงตาม category',
 ref:"WITH s AS (\n  SELECT p.category, p.name, SUM(i.qty * i.unit_price) AS revenue,\n         ROW_NUMBER() OVER (PARTITION BY p.category ORDER BY SUM(i.qty * i.unit_price) DESC, p.name) AS rn\n  FROM order_items i\n  JOIN orders o ON o.id = i.order_id AND o.status = 'PAID'\n  JOIN products p ON p.id = i.product_id\n  GROUP BY p.category, p.name)\nSELECT category, name, revenue FROM s WHERE rn = 1 ORDER BY category;"},
{t:'ยอดรายเดือน + ยอดสะสม + เทียบเดือนก่อน',lv:'I',d:'จาก order ที่ PAID แสดง month (\'YYYY-MM\' ใช้ substr(order_date,1,7)), revenue, running_total, diff_prev (revenue − เดือนก่อน, เดือนแรกเป็น NULL) เรียงตาม month',
 ref:"WITH m AS (\n  SELECT substr(o.order_date, 1, 7) AS month, SUM(i.qty * i.unit_price) AS revenue\n  FROM orders o JOIN order_items i ON i.order_id = o.id\n  WHERE o.status = 'PAID'\n  GROUP BY substr(o.order_date, 1, 7))\nSELECT month, revenue,\n       SUM(revenue) OVER (ORDER BY month) AS running_total,\n       revenue - LAG(revenue) OVER (ORDER BY month) AS diff_prev\nFROM m ORDER BY month;"},
{t:'เงินเดือนสูงสุดอันดับ 2 ของแต่ละแผนก (DENSE_RANK)',lv:'I',d:'แสดง dept, name, salary ของพนักงานที่เงินเดือนอยู่อันดับ 2 (แบบ DENSE_RANK) ในแผนกของตัวเอง เรียง dept แล้ว name (แผนกที่มีเงินเดือนแบบเดียวจะไม่มีแถว)',
 ref:"WITH r AS (\n  SELECT dept, name, salary, DENSE_RANK() OVER (PARTITION BY dept ORDER BY salary DESC) AS rk\n  FROM employees)\nSELECT dept, name, salary FROM r WHERE rk = 2 ORDER BY dept, name;"},
{t:'สายบังคับบัญชา (Recursive CTE)',lv:'A',d:'แสดง name, lvl (CEO = 0 คือคนที่ manager_id เป็น NULL), manager_name (CEO เป็น NULL) ของพนักงานทุกคน เรียง lvl แล้ว name',
 ref:"WITH RECURSIVE tree AS (\n  SELECT id, name, 0 AS lvl, NULL AS manager_name FROM employees WHERE manager_id IS NULL\n  UNION ALL\n  SELECT e.id, e.name, t.lvl + 1, t.name FROM employees e JOIN tree t ON e.manager_id = t.id)\nSELECT name, lvl, manager_name FROM tree ORDER BY lvl, name;"},
{t:'อัตราซื้อซ้ำต่อเมือง',lv:'A',d:'ต่อเมือง (city) แสดง city, customers (จำนวนลูกค้าทั้งหมดในเมือง), repeat_buyers (ลูกค้าที่มี order PAID ≥ 2 ครั้ง) เรียง repeat_buyers มากไปน้อย แล้ว city — เมืองที่ไม่มีคนซื้อซ้ำต้องแสดง 0',
 ref:"WITH paid AS (\n  SELECT customer_id, COUNT(*) AS n FROM orders WHERE status = 'PAID' GROUP BY customer_id)\nSELECT c.city, COUNT(*) AS customers,\n       SUM(CASE WHEN COALESCE(p.n, 0) >= 2 THEN 1 ELSE 0 END) AS repeat_buyers\nFROM customers c LEFT JOIN paid p ON p.customer_id = c.id\nGROUP BY c.city\nORDER BY repeat_buyers DESC, c.city;"}
];

/* ================= PROMPT LAB ================= */
const PROMPT_TASKS = [
{id:'pt1',title:'แปลงข้อความระยะเวลาเป็นนาที',fn:'parseDuration',params:'text',
 spec:'ฟังก์ชัน parseDuration(text) คืนจำนวนนาทีรวม (จำนวนเต็ม) หรือ -1 ถ้ารูปแบบไม่ถูกต้อง\n1) ข้อความประกอบด้วยส่วน "ชั่วโมง" และ/หรือ "นาที" อย่างละไม่เกินหนึ่งครั้ง ถ้ามีทั้งคู่ ชั่วโมงต้องมาก่อน\n2) แต่ละส่วนคือตัวเลขตามด้วยหน่วย ระหว่างตัวเลขกับหน่วยมีช่องว่างได้ และระหว่างสองส่วนมีช่องว่างได้\n3) หน่วยชั่วโมง: h, hr, hrs, ชม., ชั่วโมง · หน่วยนาที: m, min, mins, นาที (หน่วยอังกฤษไม่สนตัวพิมพ์ใหญ่เล็ก)\n4) ชั่วโมงเป็นทศนิยมได้ (1.5h = 90) แต่ผลรวมต้องเป็นจำนวนนาทีเต็ม ไม่งั้นคืน -1 (1.01h → -1) · นาทีต้องเป็นจำนวนเต็ม\n5) ช่องว่างหน้า/หลังข้อความไม่มีผล · ข้อความว่างหรือมีส่วนอื่นปน คืน -1',
 tests:[
  {n:'ชั่วโมงและนาที',args:['1h 30m'],expected:90},{n:'นาทีอย่างเดียว',args:['45min'],expected:45},{n:'ทศนิยมชั่วโมง',args:['1.5h'],expected:90},{n:'ภาษาไทย',args:['2 ชั่วโมง 15 นาที'],expected:135},
  {n:'ไม่มีช่องว่าง',args:['2h15m'],expected:135},{n:'ตัวพิมพ์ใหญ่',args:['3 HRS'],expected:180},{n:'ชม. แบบย่อ',args:['1ชม. 5นาที'],expected:65},{n:'ช่องว่างหน้าหลัง',args:['  20 mins '],expected:20},
  {n:'ทศนิยมได้นาทีไม่เต็ม',args:['1.01h'],expected:-1},{n:'นาทีเป็นทศนิยม',args:['1.5m'],expected:-1},{n:'สลับลำดับ',args:['30m 1h'],expected:-1},{n:'หน่วยซ้ำ',args:['1h 2h'],expected:-1},
  {n:'ข้อความว่าง',args:[''],expected:-1},{n:'มีคำอื่นปน',args:['about 1h'],expected:-1},{n:'ไม่มีหน่วย',args:['90'],expected:-1},{n:'ศูนย์นาที',args:['0m'],expected:0}],
 sol:"function parseDuration(text) {\n  const t = text.trim();\n  const re = /^(?:(\\d+(?:\\.\\d+)?)\\s*(hrs|hr|h|ชม\\.|ชั่วโมง))?\\s*(?:(\\d+)\\s*(mins|min|m|นาที))?$/i;\n  const m = t.match(re);\n  if (!t || !m || (m[1] === undefined && m[3] === undefined)) return -1;\n  const total = (m[1] ? Number(m[1]) * 60 : 0) + (m[3] ? Number(m[3]) : 0);\n  const rounded = Math.round(total);\n  return Math.abs(total - rounded) < 1e-9 ? rounded : -1;\n}",
 sample:'เขียนฟังก์ชัน parseDuration(text) แปลงข้อความระยะเวลาเป็นจำนวนนาทีรวม (จำนวนเต็ม) ถ้ารูปแบบผิดให้คืน -1\nกติกา:\n1. ตัดช่องว่างหน้าและหลังข้อความก่อน ถ้าเหลือข้อความว่างคืน -1\n2. ข้อความต้องประกอบด้วยส่วนชั่วโมงและ/หรือส่วนนาทีเท่านั้น อย่างละไม่เกินหนึ่งครั้ง ถ้ามีทั้งสองส่วน ส่วนชั่วโมงต้องอยู่ก่อนส่วนนาที ห้ามมีคำอื่นปน\n3. แต่ละส่วน = ตัวเลขแล้วตามด้วยหน่วย ระหว่างตัวเลขกับหน่วยจะมีช่องว่างหรือไม่มีก็ได้ ระหว่างสองส่วนก็มีช่องว่างหรือไม่มีก็ได้\n4. หน่วยชั่วโมงที่รับ: h, hr, hrs, ชม. (มีจุด), ชั่วโมง หน่วยนาทีที่รับ: m, min, mins, นาที หน่วยภาษาอังกฤษไม่สนตัวพิมพ์ใหญ่เล็ก\n5. ตัวเลขชั่วโมงเป็นทศนิยมได้ ตัวเลขนาทีต้องเป็นจำนวนเต็มเท่านั้น\n6. ผลรวม = ชั่วโมง × 60 + นาที ถ้าผลรวมไม่ใช่จำนวนเต็มให้คืน -1\nตัวอย่าง: "1h 30m" → 90, "2h15m" → 135, "1ชม. 5นาที" → 65, "3 HRS" → 180, "1.5h" → 90, "0m" → 0\nตัวอย่างที่ต้องคืน -1: "1.01h", "1.5m", "30m 1h", "1h 2h", "about 1h", "90", ""'},
{id:'pt2',title:'ตรวจเลขบัตรประชาชนไทย',fn:'isValidThaiId',params:'id',
 spec:'ฟังก์ชัน isValidThaiId(id) คืน true/false\n1) รับได้ 2 รูปแบบ: ตัวเลข 13 หลักติดกัน หรือรูปแบบมีขีด 1-2345-67890-12-3 (กลุ่ม 1-4-5-2-1 หลัก) เท่านั้น ห้ามมีช่องว่างหรืออักขระอื่น\n2) checksum: ให้ d1..d13 คือเลขแต่ละหลัก คำนวณ sum = d1×13 + d2×12 + … + d12×2 แล้ว check = (11 − (sum mod 11)) mod 10 ถูกต้องเมื่อ check = d13\n3) หลักแรกต้องไม่ใช่ 0\nตัวอย่างเลขที่ถูก: 1101700203450, 3700100123455',
 tests:[
  {n:'เลขถูก (11 − เศษ = 10 → 0)',args:['1101700203450'],expected:true},{n:'เลขถูกแบบมีขีด',args:['1-1017-00203-45-0'],expected:true},{n:'checksum ผิด',args:['1101700203451'],expected:false},
  {n:'เลขถูกอีกชุด',args:['3700100123455'],expected:true},{n:'ขีดผิดตำแหน่ง',args:['11-017-00203-45-0'],expected:false},{n:'12 หลัก',args:['110170020345'],expected:false},
  {n:'14 หลัก',args:['11017002034500'],expected:false},{n:'มีช่องว่าง',args:['1 1017 00203 45 0'],expected:false},{n:'ขึ้นต้นด้วย 0',args:['0000000000001'],expected:false},
  {n:'มีตัวอักษร',args:['110170020345A'],expected:false},{n:'ข้อความว่าง',args:[''],expected:false},{n:'เลขถูก (11 − เศษ = 11 → 1)',args:['3100000071271'],expected:true}],
 sol:"function isValidThaiId(id) {\n  if (!/^(\\d{13}|\\d-\\d{4}-\\d{5}-\\d{2}-\\d)$/.test(id)) return false;\n  const d = id.replace(/-/g, '').split('').map(Number);\n  if (d[0] === 0) return false;\n  let sum = 0;\n  for (let i = 0; i < 12; i++) sum += d[i] * (13 - i);\n  return (11 - (sum % 11)) % 10 === d[12];\n}",
 sample:'เขียนฟังก์ชัน isValidThaiId(id) รับข้อความ คืน true ถ้าเป็นเลขบัตรประชาชนไทยที่ถูกต้อง ไม่งั้นคืน false\nกติกา:\n1. รูปแบบที่รับมีสองแบบเท่านั้น: ตัวเลข 13 หลักติดกัน หรือแบบมีขีดที่แบ่งกลุ่มเป็น 1, 4, 5, 2, 1 หลักตามลำดับ (เช่น 1-1017-00203-45-0) รูปแบบอื่น เช่น ขีดผิดตำแหน่ง มีช่องว่าง มีตัวอักษร หลักขาดหรือเกิน ให้คืน false\n2. นำตัวเลข 13 หลักมาตรวจ หลักแรกต้องไม่ใช่ 0\n3. คูณหลักที่ 1 ถึง 12 ด้วย 13, 12, 11, ... ลงไปจนถึง 2 ตามลำดับ แล้วรวมกัน\n4. นำผลรวมหารด้วย 11 เอาเศษ แล้วเอา 11 ลบเศษนั้น จากนั้นหารด้วย 10 เอาเศษ (เช่น ถ้าได้ 10 จะเหลือ 0 ถ้าได้ 11 จะเหลือ 1)\n5. ค่าที่ได้ต้องเท่ากับหลักที่ 13 จึงถือว่าถูกต้อง\nตัวอย่าง: "1101700203450" → true, "1-1017-00203-45-0" → true, "3700100123455" → true, "1101700203451" → false, "11-017-00203-45-0" → false, "1 1017 00203 45 0" → false, "0000000000001" → false'}
];
