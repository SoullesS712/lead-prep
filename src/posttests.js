/* ================= POST-TEST (ข้อใหม่ต่อบท ใช้ร่วมกับข้อ pre-test ตอนทำ post-test) ================= */
const POST = {
sysd:[
 {q:'ระบบอ่านหนักมาก (อ่าน:เขียน = 100:1) DB CPU 90% สิ่งแรกที่คุ้มที่สุดคือ',o:['shard ฐานข้อมูลตาม customer_id ทันทีเพื่อกระจายโหลดอ่าน','เพิ่ม cache-aside และ/หรือ read replica','ย้ายทั้งระบบไป NoSQL เพื่อ scale อ่าน','เพิ่ม timeout ให้ client รอได้นานขึ้น'],a:1,e:'ลองทางที่ถูกและง่ายก่อน: cache/replica ลดโหลดอ่าน sharding เป็นทางท้ายสุด'},
 {q:'cache key ยอดนิยมหมดอายุพร้อมกัน ทำให้ request หลายพันตัวยิงเข้า DB พร้อมกัน เรียกว่าอะไร และแก้อย่างไร',o:['Deadlock — เพิ่ม lock timeout และ retry ใน DB','Cache stampede — single-flight / TTL สุ่ม','Hot partition — เพิ่ม index ใน DB','Split brain — เพิ่ม cache node'],a:1,e:'ให้มีคนเดียวไปโหลดใหม่ คนอื่นรอหรือใช้ค่าเก่าไปก่อน และกระจายเวลาหมดอายุ'},
 {q:'งานส่งอีเมลยืนยันคำสั่งซื้อใช้เวลา 3 วินาที ไม่ควรให้ผู้ใช้รอ ควรออกแบบอย่างไร',o:['เพิ่มจำนวน thread ใน web server','ส่งเข้า queue ให้ worker ทำ แล้วตอบทันที','ส่งอีเมลใน finally block ของ request','ใช้ sticky session ให้ผู้ใช้รอเครื่องเดิม'],a:1,e:'async ผ่าน queue + worker พร้อม retry/DLQ และ idempotency'},
 {q:'ระบบชำระเงินเกิด network partition ระหว่าง data center ควรเลือกอะไรตาม CAP',o:['Availability — ตอบไปก่อนแล้วค่อยกระทบยอด','Consistency — ปฏิเสธ/รอ ดีกว่ายอดผิด','ได้ทั้ง C และ A ถ้ามี 3 data center','ตัด Partition tolerance ออกได้'],a:1,e:'ข้อมูลการเงินต้องถูกต้อง ส่วนที่ยอม eventual ได้คือ like/view count'},
 {q:'Retry ที่ดีเมื่อเรียก service ที่ล้มชั่วคราว ควรเป็นแบบใด',o:['retry ทันทีไม่จำกัดจนกว่าจะสำเร็จ','exponential backoff + jitter + จำกัดจำนวน','retry ทุก 1 วินาทีเท่ากันทุก client','ไม่ retry เลยแล้วคืน error ทันที'],a:1,e:'retry พร้อมกันไม่จำกัดจะซ้ำเติมระบบที่ป่วย (retry storm)'}
],
db:[
 {q:'ตาราง orders เก็บ customer_name ซ้ำทุกแถว (order_id → customer_id → customer_name) ผิด normal form ใด',o:['1NF','2NF','3NF','BCNF เท่านั้น'],a:2,e:'transitive dependency → แยกตาราง customers'},
 {q:'INDEX(a, b, c) ช่วย query ใด "ไม่ได้" ตามหลัก leftmost prefix',o:['WHERE a = 1','WHERE a = 1 AND b = 2','WHERE b = 2 AND c = 3','WHERE a = 1 AND b = 2 AND c = 3'],a:2,e:'ต้องเริ่มจากคอลัมน์ซ้ายสุด'},
 {q:'execution plan มี Key Lookup จำนวนมากหลัง Index Seek ควรแก้อย่างไร',o:['ลบ index ทิ้งให้ใช้ table scan แทน','covering index (INCLUDE คอลัมน์ที่ SELECT)','เพิ่ม RAM ให้ buffer pool ใหญ่ขึ้น','เปลี่ยน INNER JOIN เป็น LEFT JOIN'],a:1,e:'ให้ index มีคอลัมน์ครบ ไม่ต้องย้อนไปอ่านตารางหลัก'},
 {q:'ผู้ใช้สองคนแก้ราคาสินค้าเดียวกันพร้อมกัน คนหลังทับของคนแรกโดยไม่รู้ตัว แก้แบบไม่ lock นานด้วย',o:['ใส่ NOLOCK hint ตอนอ่าน','optimistic concurrency (rowversion) + 409','ตั้ง isolation เป็น READ UNCOMMITTED','เพิ่ม unique index ที่คอลัมน์ price'],a:1,e:'ตรวจเวอร์ชันแถวตอน UPDATE ถ้าไม่ตรง = มีคนแก้ก่อน'},
 {q:'ตาราง log โตวันละหลายล้านแถว ต้องลบข้อมูลเก่ากว่า 90 วันทุกวันโดยไม่หนักระบบ ควรใช้',o:['DELETE WHERE date < … ทั้งก้อนวันละครั้งตอนเที่ยงคืน','partition ตามวันที่ แล้ว drop partition เก่า','เพิ่ม index ที่ทุกคอลัมน์ของตาราง log','TRUNCATE ทั้งตารางแล้วโหลด 90 วันกลับ'],a:1,e:'drop partition เป็น metadata operation เร็วมาก ไม่ล็อกตารางนาน'}
],
micro:[
 {q:'Mobile app และ Web ต้องการข้อมูลรูปแบบต่างกันจากหลาย service ควรใช้ pattern ใด',o:['Shared database','Backend for Frontend (BFF)','Distributed monolith','Two-phase commit ข้าม service'],a:1,e:'BFF รวม/ปรับข้อมูลให้แต่ละ client'},
 {q:'ทุก request จาก client ต้องผ่านการยืนยันตัวตน, rate limit และ routing ก่อนถึง service ควรวางที่',o:['ทำซ้ำในทุก service','API Gateway','database trigger','ฝั่ง frontend'],a:1,e:'cross-cutting concerns ที่ขอบระบบ'},
 {q:'Consumer ได้รับ message เดิมซ้ำ (at-least-once) จะกันการประมวลผลซ้ำอย่างไร',o:['ปิด retry ของ broker เพื่อไม่ให้ส่งซ้ำ','consumer idempotent เช่นเก็บ message id','เปลี่ยนเป็น exactly-once ด้วย UDP','เพิ่ม partition ให้กระจาย message'],a:1,e:'ส่วนใหญ่ broker รับประกัน at-least-once ฝั่งรับต้อง idempotent'},
 {q:'service หนึ่งต้องอ่าน DB ของอีก service โดยตรงเพื่อทำรายงาน ปัญหาหลักคืออะไร',o:['query ช้าลงเพราะข้าม network','coupling ผ่าน schema — แก้ทีพังหลาย service','ต้องใช้ distributed transaction ทุกครั้ง','ใช้ connection pool มากเกินไป'],a:1,e:'database per service ปกป้องความเป็นอิสระในการ deploy'},
 {q:'CQRS เหมาะกับสถานการณ์ใดมากที่สุด',o:['CRUD เล็ก ๆ ที่มีตารางไม่กี่ตาราง','อ่านหนักและรูปแบบอ่าน/เขียนต่างกันมาก','ต้องการลดจำนวน service ในระบบ','ต้องการ strong consistency ทุกจุดของระบบตลอดเวลา'],a:1,e:'แลกกับความซับซ้อนและ eventual consistency ของ read model'}
],
git:[
 {q:'เผลอ commit ไฟล์ที่มี API key และ push ขึ้น remote แล้ว ขั้นตอนแรกที่สำคัญที่สุดคือ',o:['ลบไฟล์แล้ว commit ใหม่ทับ','revoke/rotate key ทันที แล้วล้างประวัติ','force push ทับ commit นั้นทันที','ทำ repo เป็น private ก่อน'],a:1,e:'ถือว่า key รั่วแล้ว ประวัติอาจถูก clone ไปแล้ว'},
 {q:'git fetch ต่างจาก git pull อย่างไร',o:['เหมือนกัน แค่ pull แสดงผลละเอียดกว่า','fetch ดึงมาไม่ merge, pull = fetch + merge','fetch ดึงทุก branch ส่วน pull ดึงแค่ branch main','pull ดึงมาไม่ merge, fetch = pull + merge'],a:1,e:'fetch ปลอดภัย ดูก่อนค่อยรวม'},
 {q:'ควรใช้ rebase กับ branch ใด "ไม่ควร"',o:['feature branch ส่วนตัวที่ยังไม่ push','branch ที่แชร์และ push แล้ว เช่น main','branch ทดลองที่อยู่ในเครื่องเราเท่านั้น','ก่อนเปิด PR เพื่อจัด commit ให้สะอาดอ่านง่าย'],a:1,e:'rebase เขียนประวัติใหม่ ทำให้คนอื่นมีประวัติไม่ตรงกัน'},
 {q:'Trunk-based development เด่นที่สุดเรื่องใด',o:['branch ยาวหลายเดือนแล้ว merge รวมครั้งเดียว','merge เข้า main บ่อย ซ่อนงานด้วย feature flag','ทุกคนทำงานบน release branch ของตัวเอง','merge ได้เฉพาะหลังผ่าน QA รอบใหญ่'],a:1,e:'ลด merge conflict ใหญ่ เหมาะกับ CI/CD'},
 {q:'ต้องการยกเลิกผลของ commit ที่ push ขึ้น main แล้วอย่างปลอดภัย',o:['git reset --hard แล้ว force push','git revert <commit> แล้ว push','git checkout <commit> แล้ว push','git commit --amend แล้ว force push'],a:1,e:'revert สร้าง commit ใหม่ที่กลับค่า ไม่เขียนประวัติที่แชร์แล้ว'}
],
oop:[
 {q:'class OrderService ทำทั้งคำนวณราคา, บันทึก DB, ส่งอีเมล และสร้าง PDF ละเมิดหลักใด',o:['Single Responsibility','Liskov Substitution','Interface Segregation','Dependency Inversion'],a:0,e:'มีหลายเหตุผลให้ต้องแก้ class เดียว'},
 {q:'Square สืบทอดจาก Rectangle แล้ว set Width ทำให้ Height เปลี่ยนด้วย โค้ดที่ใช้ Rectangle พัง ละเมิดหลักใด',o:['OCP','LSP','DIP','SRP'],a:1,e:'subtype ต้องแทน base type ได้โดยไม่ทำให้พฤติกรรมผิด'},
 {q:'Controller สร้าง new SqlOrderRepository() เองข้างใน ทำให้ test ยาก ควรแก้ตามหลักใด',o:['DIP — พึ่ง IOrderRepository แล้ว inject','เปลี่ยนเป็น static method เรียกตรง','ให้ controller สืบทอดจาก repository','ทำ repository เป็น Singleton แบบ static'],a:0,e:'พึ่ง abstraction และใช้ DI container'},
 {q:'ต้องสร้าง object ต่างชนิดตามประเภทเอกสาร (PDF/Excel/Word) โดยผู้เรียกไม่ต้องรู้ class จริง ใช้ pattern ใด',o:['Observer','Factory','Decorator','Adapter'],a:1,e:'Factory ซ่อนการเลือก class ที่จะสร้าง'},
 {q:'ต้องใช้ library ภายนอกที่ interface ไม่ตรงกับ interface ในระบบเรา ใช้ pattern ใด',o:['Adapter','Strategy','Singleton','Template Method'],a:0,e:'Adapter แปลง interface หนึ่งให้เป็นอีกแบบ'}
],
test:[
 {q:'โครงสร้าง unit test ที่อ่านง่ายและเป็นมาตรฐานคือ',o:['Arrange – Act – Assert','Act – Assert – Arrange','Assert – Arrange – Act','Setup – Act – Teardown'],a:0,e:'เตรียม → เรียก → ตรวจ'},
 {q:'Test pyramid ที่ดีควรมีสัดส่วนอย่างไร',o:['E2E มากที่สุด เพราะใกล้ผู้ใช้จริง','unit มากสุด รองลงมา integration, E2E น้อยสุด','เท่ากันทุกชั้นเพื่อความสมดุล','integration มากสุด เพราะครอบคลุมกว่า ไม่ต้องมี unit ก็ได้'],a:1,e:'unit เร็ว/ถูก E2E ช้า/เปราะ'},
 {q:'test ที่บางครั้งผ่านบางครั้งไม่ผ่านทั้งที่โค้ดไม่เปลี่ยน (flaky) มักเกิดจาก',o:['ใช้รูปแบบ Arrange-Act-Assert','พึ่งเวลาจริง ลำดับรัน หรือ state ร่วม','ใช้ mock แทน dependency จริงมากไป','ตั้งชื่อ test ยาวเกินไป'],a:1,e:'ทำให้ deterministic: inject clock, แยก state, mock ภายนอก'},
 {q:'Microservice A เรียก API ของทีม B ต้องการรู้ก่อน deploy ว่า B เปลี่ยน API แล้วจะทำ A พังหรือไม่ ใช้',o:['Load test','Contract testing (เช่น Pact)','UI snapshot test','Smoke test บน production หลัง deploy'],a:1,e:'consumer-driven contract ตรวจใน pipeline ของ provider'},
 {q:'ใน xUnit ต้องการรัน test เดียวกันกับข้อมูลหลายชุด ใช้',o:['[Fact] ซ้ำหลายอัน','[Theory] + [InlineData]','[Fact] + [Trait("data")]','[Theory] + [Skip]'],a:1,e:'Theory = parameterized test'}
],
mon:[
 {q:'ต้องการค้นหา log ของ request เดียวกันข้ามหลาย service ควรใส่อะไรใน log',o:['เวลาของเครื่องให้ละเอียดถึง ms','Trace ID ส่งต่อทุก hop + structured log','ชื่อเครื่องและ IP ของแต่ละ service','เลข thread ที่ประมวลผล request'],a:1,e:'structured log (JSON) + trace id ค้นและเชื่อมโยงได้'},
 {q:'log level ใดเหมาะกับ "ชำระเงินล้มเหลวเพราะ payment gateway ตอบ 500"',o:['Trace','Debug','Error','Information'],a:2,e:'เป็นความผิดพลาดที่ต้องตรวจสอบ (Warning ถ้า retry แล้วผ่าน)'},
 {q:'Golden signals 4 อย่างของ service คือ',o:['CPU, RAM, Disk, Network','Latency, Traffic, Errors, Saturation','Logs, Metrics, Traces, Events','Uptime, Throughput, Users, Revenue'],a:1,e:'จาก Google SRE'},
 {q:'ควร alert แบบปลุกคนตอนตีสามเมื่อใด',o:['CPU เกิน 70% ชั่วขณะ','อาการที่กระทบผู้ใช้/ผลาญ error budget เร็ว','ทุก warning ที่ขึ้นใน log ของระบบ production','disk ใช้เกิน 40%'],a:1,e:'alert ที่ทำอะไรไม่ได้ทำให้ทีมล้า (alert fatigue)'},
 {q:'Liveness probe ต่างจาก Readiness probe อย่างไร',o:['ทั้งสองแบบ fail แล้ว restart container','Liveness fail → restart, Readiness fail → ตัด traffic','Readiness fail → ลบ pod แล้วสร้างใหม่ทันที','Liveness ตรวจ DB, Readiness ตรวจ CPU'],a:1,e:'ไม่ควรเช็ค dependency ภายนอกใน liveness'}
],
fe:[
 {q:'Largest Contentful Paint (LCP) ช้าเพราะรูป hero ใหญ่ ควรแก้อย่างไร',o:['lazy-load รูป hero ให้โหลดทีหลัง','ลดขนาด/ใช้ WebP-AVIF และ preload รูป hero','ย้ายรูป hero ไปเป็น CSS background','โหลดรูป hero ด้วย JS หลัง DOMContentLoaded'],a:1,e:'รูปแรกบนจอต้องโหลดเร็วที่สุด'},
 {q:'INP (Interaction to Next Paint) สูง เพราะคลิกแล้วมี JS ทำงานหนัก 400ms แก้อย่างไร',o:['เพิ่ม CSS transition ให้ดูลื่นขึ้น','แบ่งงานยาว ย้ายงานหนักไป Web Worker','เพิ่ม debounce 400ms ให้ทุกปุ่ม','preload font และรูปทั้งหมดก่อน'],a:1,e:'อย่าให้ main thread ถูกบล็อกนาน'},
 {q:'ทำไมควรใส่ hash ในชื่อไฟล์ static (app.3f9a2.js) แล้วตั้ง cache นานมาก',o:['เพื่อให้ search engine รู้ว่าไฟล์อัปเดตแล้ว','ไฟล์ใหม่ได้ชื่อใหม่ จึง cache ได้ยาว','เพื่อซ่อนโค้ดจากผู้ใช้','ให้ CDN บีบอัดไฟล์ได้ดีขึ้น'],a:1,e:'immutable caching + เปลี่ยนชื่อเมื่อเนื้อหาเปลี่ยน'},
 {q:'รายการ 10,000 แถวทำให้หน้าเว็บกระตุก วิธีที่เหมาะสมคือ',o:['render ทั้งหมดแต่ใช้ CSS ซ่อน','virtualization — render เฉพาะแถวที่เห็น','แบ่งหน้าละ 10 แถวแล้ว render ทุกหน้า','เปลี่ยน div เป็น table'],a:1,e:'ลดจำนวน DOM node'},
 {q:'การเก็บ access token ใน localStorage มีความเสี่ยงหลักอะไร',o:['ไม่มีความเสี่ยงถ้าใช้ HTTPS','ถ้าเกิด XSS สคริปต์อ่าน token ได้','token หมดอายุเร็วขึ้นใน localStorage','CSRF ส่ง token ไปเว็บอื่นได้อัตโนมัติ'],a:1,e:'HttpOnly cookie + SameSite + CSRF protection หรือ BFF'}
],
api:[
 {q:'สร้าง resource ใหม่สำเร็จด้วย POST ควรตอบ',o:['200 OK พร้อม body ว่าง','201 Created + header Location','204 No Content','202 Accepted + header Location'],a:1,e:'201 + Location'},
 {q:'feed ข้อมูลใหม่ถูกเพิ่มตลอดเวลา ใช้ OFFSET แล้วเจอรายการซ้ำ/หายระหว่างหน้า ควรใช้',o:['เพิ่ม OFFSET ให้ใหญ่ขึ้นเรื่อย ๆ','cursor/keyset pagination','ส่งข้อมูลทั้งหมดครั้งเดียว','สุ่มลำดับแล้วตัดหน้าละ 20'],a:1,e:'cursor เสถียรและเร็วกว่า OFFSET ลึก ๆ'},
 {q:'เว็บที่ https://app.example.com เรียก API ที่ https://api.example.com แล้วโดนเบราว์เซอร์บล็อก แก้อย่างไร',o:['ปิด HTTPS ฝั่ง API ชั่วคราว','API ตั้ง CORS อนุญาต origin ของเว็บ','ใช้ JSONP แทน fetch','ตั้ง Access-Control-Allow-Origin: * พร้อม credentials'],a:1,e:'CORS ตั้งที่ server'},
 {q:'ผู้ใช้ส่งคำขอเกินโควตา ควรตอบ',o:['400 Bad Request','403 Forbidden','429 + Retry-After','503 Service Unavailable'],a:2,e:'429 พร้อมบอกเวลาให้ลองใหม่'},
 {q:'PUT ต่างจาก PATCH อย่างไร',o:['เหมือนกัน ต่างแค่ชื่อ','PUT แทนทั้งก้อน (idempotent), PATCH แก้บางฟิลด์','PATCH แทนทั้งก้อน (idempotent), PUT แก้เฉพาะบางฟิลด์','PUT สร้างใหม่เท่านั้น, PATCH แก้ไข'],a:1,e:'PUT ส่งซ้ำได้ผลเหมือนเดิม'}
],
sec:[
 {q:'API GET /orders/1234 ให้ผู้ใช้คนอื่นเปลี่ยนเลขแล้วเห็นคำสั่งซื้อของคนอื่น ช่องโหว่นี้คือ',o:['XSS','BOLA/IDOR','CSRF','Clickjacking'],a:1,e:'ต้องตรวจว่า resource เป็นของผู้ใช้คนนั้นทุกครั้ง'},
 {q:'วิธีเก็บรหัสผ่านที่ถูกต้อง',o:['MD5 + salt ต่อผู้ใช้','SHA-256 ไม่มี salt','bcrypt/Argon2 (มี salt, ช้าโดยตั้งใจ)','AES-256 แล้วเก็บ key ใน appsettings'],a:2,e:'hash ที่ช้า + salt ต่อผู้ใช้'},
 {q:'ป้องกัน SQL Injection ที่ถูกต้องที่สุดคือ',o:['escape เครื่องหมาย \' ด้วยตัวเองทุกจุด','parameterized query / ORM bind parameter','ซ่อน error message จากผู้ใช้','ตรวจ input ด้วย regex blacklist คำว่า SELECT/DROP'],a:1,e:'ข้อมูลไม่ถูกตีความเป็นคำสั่ง SQL'},
 {q:'API รับ JSON แล้ว map ลง entity ตรง ๆ ผู้ใช้ส่ง "isAdmin": true มาด้วยแล้วกลายเป็น admin เรียกว่า',o:['Mass assignment','SSRF','Path traversal','JWT alg=none attack'],a:0,e:'ใช้ DTO ที่มีเฉพาะฟิลด์ที่อนุญาต'},
 {q:'Cookie ของ session ควรตั้ง flag ใดบ้าง',o:['ไม่ต้องตั้ง ใช้ค่าเริ่มต้น','HttpOnly, Secure, SameSite','Public, Max-Age=10 ปี','Domain=* ใช้ได้ทุกเว็บ'],a:1,e:'กัน JS อ่าน, ส่งเฉพาะ HTTPS, ลด CSRF'}
],
cont:[
 {q:'image กับ container ต่างกันอย่างไร',o:['image ใหญ่กว่า container เสมอ','image = template อ่านอย่างเดียว, container = ตัวที่รัน','container = template อ่านอย่างเดียว, image = ตัวที่รัน','เหมือนกัน แค่เรียกต่างกัน'],a:1,e:'image หนึ่งรันได้หลาย container'},
 {q:'ไฟล์ที่ผู้ใช้อัปโหลดหายทุกครั้งที่ container ถูกสร้างใหม่ ควรแก้อย่างไร',o:['เพิ่ม RAM ให้ container','เก็บใน volume หรือ object storage','commit container เป็น image ทุกคืน','ตั้ง restart policy เป็น never'],a:1,e:'filesystem ของ container ชั่วคราว'},
 {q:'ทำไมควรเรียง COPY *.csproj + dotnet restore ก่อน COPY โค้ดทั้งหมด ใน Dockerfile',o:['ไม่มีผล เป็นแค่สไตล์','ใช้ layer cache — แก้โค้ดไม่ต้อง restore ใหม่','ทำให้ image ปลอดภัยขึ้นเพราะไม่มี source','Docker บังคับให้เรียงแบบนี้'],a:1,e:'layer ที่เปลี่ยนน้อยไว้ข้างบน'},
 {q:'ควรรัน process ใน container ด้วย user ใด',o:['root เพื่อให้ติดตั้งได้ทุกอย่าง','non-root user','user เดียวกับ developer','user ที่ชื่อตรงกับ service'],a:1,e:'ลดความเสียหายถ้าถูกเจาะ'},
 {q:'Kubernetes ทำอะไรที่ docker run บนเครื่องเดียวทำไม่ได้',o:['build image จาก Dockerfile','กระจาย container หลายเครื่อง, scale, rolling update','ลดขนาด image อัตโนมัติ','สแกนช่องโหว่ใน image และ block การ deploy ที่ไม่ผ่าน'],a:1,e:'container orchestrator'}
],
cicd:[
 {q:'CI (Continuous Integration) หมายถึงอะไรเป็นหลัก',o:['deploy production ทุก commit อัตโนมัติ','merge บ่อย + build/test อัตโนมัติทุกครั้ง','ทดสอบด้วยมือก่อน release ทุกครั้ง','แยก branch ยาวต่อ feature แล้วรวมก่อน release ใหญ่'],a:1,e:'Continuous Delivery/Deployment คือส่วนต่อจากนั้น'},
 {q:'Blue-green deployment คืออะไร',o:['deploy ทีละเครื่องจนครบ','สองชุดเหมือนกัน สลับ traffic ได้ทันที','เปิดให้ผู้ใช้ 1% ก่อนแล้วค่อยขยาย','ลบของเก่าก่อนแล้วลงของใหม่'],a:1,e:'canary = ทยอยเปิดเป็น %'},
 {q:'secret (เช่น connection string) ใน pipeline ควรเก็บที่ใด',o:['ในไฟล์ YAML ใน repo','secret variable / variable group ลิงก์ Key Vault','ใน README ของ repo','environment variable ใน Dockerfile ที่ commit ไว้ใน repo'],a:1,e:'ไม่ commit secret และ mask ใน log'},
 {q:'"Build once, deploy many" หมายความว่า',o:['build ใหม่ทุก environment ด้วย config ของแต่ละที่','build artifact ครั้งเดียว ใช้ซ้ำทุก environment','deploy ครั้งเดียวต่อ sprint','ใช้ build agent เครื่องเดียว'],a:1,e:'มั่นใจว่าสิ่งที่ทดสอบคือสิ่งเดียวกับที่ขึ้น prod'},
 {q:'ต้องการให้ PR เข้า main ได้เฉพาะเมื่อ build และ test ผ่าน ใช้',o:['Branch policy / required status check','ให้ทุกคน push ตรง main','cron job ตรวจ main ทุกชั่วโมงแล้ว revert commit ที่ทำให้ build พัง','tag ทุก release'],a:0,e:'บังคับคุณภาพก่อน merge'}
],
cloud:[
 {q:'Shared responsibility model: เมื่อใช้ IaaS (VM) ใครรับผิดชอบ patch OS',o:['ผู้ให้บริการคลาวด์','ลูกค้า','แบ่งกันคนละครึ่ง','ผู้ผลิต OS'],a:1,e:'PaaS/SaaS ผู้ให้บริการรับไปมากขึ้น'},
 {q:'งานที่ทำงานเมื่อมีไฟล์อัปโหลดเข้า storage นาน ๆ ครั้ง ใช้เวลาไม่กี่วินาที ควรใช้',o:['VM เปิด 24 ชั่วโมง','serverless function แบบ event trigger','Kubernetes cluster ขนาดใหญ่ autoscale','batch job ทุกเที่ยงคืน'],a:1,e:'จ่ายตามการใช้งานจริง'},
 {q:'ข้อเสียที่ต้องระวังของ serverless',o:['scale ไม่ได้เมื่อโหลดสูง','cold start, จำกัดเวลารัน, debug ยาก','แพงกว่า VM เสมอไม่ว่าจะใช้งานมากหรือน้อย','ใช้กับ HTTP ไม่ได้'],a:1,e:'งานรันยาวต่อเนื่องอาจเหมาะกับ container/VM มากกว่า'},
 {q:'ต้องการรู้ว่าทีมใช้เงินคลาวด์ไปกับโปรเจกต์ใด ควรทำอย่างไร',o:['ใช้ account เดียวไม่แยก','tag (project/env/owner) + budget alert','ปิด resource ทุกคืนด้วย script','ดูใบแจ้งหนี้รวมสิ้นปี'],a:1,e:'FinOps เบื้องต้น'},
 {q:'Object storage (Blob/S3) เหมาะกับข้อมูลแบบใด',o:['transaction ที่ต้อง JOIN','ไฟล์ใหญ่ รูป วิดีโอ backup log','cache ที่ต้องอ่านทุก ms ด้วย latency ต่ำ','session ของผู้ใช้'],a:1,e:'ถูก ทนทาน เข้าถึงผ่าน HTTP'}
],
ai:[
 {q:'RAG (Retrieval-Augmented Generation) ทำงานอย่างไร',o:['ฝึกโมเดลใหม่ทุกครั้งที่มีเอกสาร','ค้นเอกสารที่เกี่ยวข้อง แล้วใส่ใน prompt','เพิ่ม temperature ให้ตอบหลากหลาย','ใส่เอกสารทั้งหมดของบริษัทลงใน system prompt ทุกครั้ง'],a:1,e:'ลด hallucination ใช้ข้อมูลล่าสุดได้โดยไม่ต้อง fine-tune'},
 {q:'Embedding คืออะไร',o:['รูปภาพที่ฝังในเอกสาร','เวกเตอร์แทนความหมาย ใช้หาความคล้าย','จำนวน token สูงสุดที่โมเดลรับได้','ไฟล์น้ำหนักของโมเดล'],a:1,e:'ใช้ cosine similarity ค้นหาความหมายใกล้เคียง'},
 {q:'ข้อมูลใดไม่ควรส่งเข้า LLM ภายนอกโดยไม่มีการควบคุม',o:['คำถามทั่วไปเรื่องภาษา','ข้อมูลส่วนบุคคล/ความลับที่ยังไม่ mask','ตัวอย่างโค้ด open source แบบ GPL','ข้อความทักทายลูกค้า'],a:1,e:'PDPA/นโยบายองค์กร'},
 {q:'Classification ต่างจาก Regression อย่างไร',o:['ต่างกันแค่ชื่อเรียก','Classification ทำนายหมวด, Regression ทำนายตัวเลข','Regression ทำนายหมวด, Classification ทำนายตัวเลข','Classification ไม่ต้องมี label'],a:1,e:'metric ต่างกัน: accuracy/F1 vs MAE/RMSE'},
 {q:'Prompt injection คืออะไร',o:['การเขียน prompt ยาวเกินขีดจำกัดของ context','ข้อความภายนอกสั่งให้โมเดลเพิกเฉยคำสั่งเดิม','การ fine-tune ด้วยข้อมูลที่ติด label ผิดจำนวนมาก','การตั้ง temperature = 0'],a:1,e:'แยก instruction กับ data, จำกัดสิทธิ์ tool, ตรวจ output'}
],
sqlt:[
 {q:'ต้องการกรองกลุ่มที่ SUM(amount) > 1000 หลัง GROUP BY ใช้',o:['WHERE SUM(amount) > 1000','HAVING SUM(amount) > 1000','WHERE amount > 1000','ORDER BY SUM(amount) DESC'],a:1,e:'WHERE กรองก่อนจัดกลุ่ม HAVING กรองหลัง'},
 {q:'ต้องการลูกค้าทุกคน รวมคนที่ไม่เคยสั่งซื้อ พร้อมจำนวนคำสั่งซื้อ (0 ถ้าไม่เคย) ใช้',o:['INNER JOIN + COUNT(*)','LEFT JOIN + COUNT(o.id)','LEFT JOIN + COUNT(*)','RIGHT JOIN + COUNT(c.id)'],a:1,e:'COUNT(*) จะนับแถว NULL เป็น 1 — ต้องนับคอลัมน์ฝั่งขวา'},
 {q:'ต้องการคำสั่งซื้อในเดือนมีนาคม 2026 โดยใช้ index ได้ เงื่อนไขที่ถูกต้องคือ',o:['WHERE MONTH(order_date) = 3','order_date >= \'2026-03-01\' AND < \'2026-04-01\'','order_date BETWEEN \'2026-03-01\' AND \'2026-03-31\'','order_date LIKE \'2026-03%\''],a:1,e:'ช่วงปิด-เปิด ครอบคลุมเวลาทั้งวันสุดท้ายและ sargable'},
 {q:'ต้องการยอดขายสะสม (running total) ตามวันที่ ใช้',o:['SUM(amount) GROUP BY date','SUM(amount) OVER (ORDER BY date)','SUM(amount) OVER ()','COUNT(*) OVER (PARTITION BY date)'],a:1,e:'window function ไม่ยุบแถว'},
 {q:'สินค้าราคาสูงสุดอันดับ 1 ของแต่ละหมวด (กรณีเสมอให้เอาทุกตัว) ควรใช้',o:['ROW_NUMBER() … = 1','RANK() … = 1','NTILE(1) … = 1','GROUP BY category + MAX(price)'],a:1,e:'RANK ให้ลำดับ 1 กับทุกตัวที่เสมอ ROW_NUMBER เลือกแค่ตัวเดียว'}
],
pc:[
 {q:'prompt ใดดีที่สุดสำหรับให้ AI เขียนฟังก์ชันตรวจรูปแบบรหัสสินค้า',o:['"เขียนฟังก์ชันตรวจรหัสสินค้าให้หน่อย"','ชื่อฟังก์ชัน, I/O, กฎทีละข้อ, ตัวอย่างถูก/ผิด, edge case','แนบ regex ที่ต้องการ แล้วให้ AI แปลงเป็นโค้ด พร้อมอธิบายทุกบรรทัดอย่างละเอียด','"ทำให้ดีที่สุด ครอบคลุมทุกกรณี"'],a:1,e:'spec ชัด + ตัวอย่าง + edge case'},
 {q:'AI สร้างโค้ดที่ผ่านตัวอย่างแต่ตก hidden test ควรทำอย่างไร (ในเงื่อนไขห้ามแก้โค้ดเอง)',o:['แก้โค้ดเองเงียบ ๆ ให้ผ่าน','หากรณีที่ spec ยังไม่บอก แล้วเพิ่มลง prompt','ส่ง prompt เดิมซ้ำจนกว่า AI จะสุ่มได้ถูก','ขอให้ AI เขียนโค้ดยาวขึ้น'],a:1,e:'ปรับที่ต้นเหตุ — spec ที่ยังไม่ครบ'},
 {q:'ทำไมการให้ตัวอย่าง input → output ที่ "ผิด/ต้องปฏิเสธ" จึงสำคัญ',o:['ทำให้ prompt สั้นลง','กำหนดขอบเขตชัดว่าอะไรต้องไม่ผ่าน','ทำให้ AI ตอบเร็วขึ้นเพราะมีตัวอย่างให้คัดลอก','ช่วยให้ AI เลือกภาษาได้ถูก'],a:1,e:'ตัวอย่างลบ (negative examples) ปิดช่องว่างของกฎ'},
 {q:'ในโจทย์แปลงข้อความหลายกฎ เช่น mask ข้อมูล ควรระบุเรื่องใดเพิ่มเพื่อกันผลลัพธ์ทับกัน',o:['สีและฟอนต์ของข้อความ','ลำดับการประมวลผลกฎ และรูปแบบ output ที่แน่นอน','ภาษาที่ใช้เขียนคอมเมนต์และชื่อตัวแปร','จำนวนบรรทัดของโค้ด'],a:1,e:'กฎหนึ่งอาจไปจับผลของอีกกฎ'},
 {q:'การบอก AI ว่า "คืนค่า false สำหรับ input ที่ไม่ใช่ string" มีผลอย่างไร',o:['ไม่มีผล เพราะ JavaScript แปลง type ให้เองอัตโนมัติอยู่แล้ว','จัดการ type ผิดได้ไม่ throw ผ่าน test กรณีขอบ','ทำให้โค้ดช้าลงมาก','ทำให้ AI ปฏิเสธที่จะตอบ'],a:1,e:'hidden test มักมี null/undefined/number'}
],
algo:[
 {q:'หาว่าใน array มีสองตัวรวมกันได้ target หรือไม่ ใน O(n) ใช้',o:['loop ซ้อนสองชั้นตรวจทุกคู่','hash set เก็บค่าที่เห็น ตรวจ target − x','เรียงก่อนแล้ว binary search หาคู่ของทุกตัว (ได้ O(n) เหมือนกัน)','recursion ลองทุก subset'],a:1,e:'แลกหน่วยความจำ O(n) กับเวลา'},
 {q:'หาค่าน้อยที่สุดที่ "ทำได้" เช่นความจุเรือขั้นต่ำให้ขนครบใน D วัน (ถ้าความจุ x ทำได้ ค่าที่มากกว่าก็ทำได้) ใช้เทคนิค',o:['greedy เลือกของหนักก่อน','binary search on answer + ตรวจ feasible','DFS ลองทุกความจุ แล้วเลือกค่าน้อยสุดที่ผ่าน','sort แล้วจับคู่หัวท้าย'],a:1,e:'คำตอบมีคุณสมบัติ monotonic'},
 {q:'หาจำนวนกลุ่มที่เชื่อมต่อกันจากรายการคู่เพื่อน (เพิ่มขอบทีละเส้น) ใช้โครงสร้างใด',o:['Stack','Union-Find (Disjoint Set)','Priority queue (min-heap)','Adjacency matrix + DFS ทุกครั้ง'],a:1,e:'เกือบ O(1) ต่อการ union/find'},
 {q:'จัดลำดับงานที่มีเงื่อนไข "งาน A ต้องเสร็จก่อน B" และตรวจว่ามีวงจรหรือไม่ ใช้',o:['Dijkstra','Topological sort (Kahn)','Binary search on answer','Union-Find ตรวจวงจร'],a:1,e:'ถ้าจัดได้ไม่ครบทุกโหนด = มี cycle'},
 {q:'เส้นทางสั้นที่สุดบน grid ที่ทุกก้าวมีค่า 1 เท่ากัน ใช้อัลกอริทึมใดเหมาะที่สุด',o:['Dijkstra พร้อม heap','BFS','DFS','Bellman-Ford'],a:1,e:'น้ำหนักเท่ากันทุกเส้น BFS ให้ระยะสั้นสุดใน O(V+E)'}
]
};
