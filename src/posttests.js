/* ================= POST-TEST (ข้อใหม่ต่อบท ใช้ร่วมกับข้อ pre-test ตอนทำ post-test) ================= */
const POST = {
sysd:[
 {q:'ระบบอ่านหนักมาก (อ่าน:เขียน = 100:1) DB CPU 90% สิ่งแรกที่คุ้มที่สุดคือ',o:['Shard ฐานข้อมูลทันที','เพิ่ม cache-aside และ/หรือ read replica','เปลี่ยนเป็น NoSQL','เพิ่ม timeout ให้ client'],a:1,e:'ลองทางที่ถูกและง่ายก่อน: cache/replica ลดโหลดอ่าน sharding เป็นทางท้ายสุด'},
 {q:'cache key ยอดนิยมหมดอายุพร้อมกัน ทำให้ request หลายพันตัวยิงเข้า DB พร้อมกัน เรียกว่าอะไร และแก้อย่างไร',o:['Deadlock — เพิ่ม lock timeout','Cache stampede — single-flight lock / stale-while-revalidate / TTL แบบสุ่ม','Hot partition — เพิ่ม index','Split brain — เพิ่ม node'],a:1,e:'ให้มีคนเดียวไปโหลดใหม่ คนอื่นรอหรือใช้ค่าเก่าไปก่อน และกระจายเวลาหมดอายุ'},
 {q:'งานส่งอีเมลยืนยันคำสั่งซื้อใช้เวลา 3 วินาที ไม่ควรให้ผู้ใช้รอ ควรออกแบบอย่างไร',o:['เพิ่มจำนวน thread ใน web server','ส่ง message เข้า queue ให้ worker ทำ แล้วตอบผู้ใช้ทันที','ส่งอีเมลใน finally block','ใช้ sticky session'],a:1,e:'async ผ่าน queue + worker พร้อม retry/DLQ และ idempotency'},
 {q:'ระบบชำระเงินเกิด network partition ระหว่าง data center ควรเลือกอะไรตาม CAP',o:['Availability — ตอบไปก่อนแม้ยอดเงินอาจผิด','Consistency — ปฏิเสธ/รอ ดีกว่าให้ยอดเงินผิด','ไม่ต้องเลือก ได้ทั้งสามอย่าง','Partition tolerance ทิ้งได้'],a:1,e:'ข้อมูลการเงินต้องถูกต้อง ส่วนที่ยอม eventual ได้คือ like/view count'},
 {q:'Retry ที่ดีเมื่อเรียก service ที่ล้มชั่วคราว ควรเป็นแบบใด',o:['retry ทันทีไม่จำกัด','exponential backoff + jitter + จำกัดจำนวนครั้ง (และ operation ต้อง idempotent)','retry ทุก 1 วินาทีเท่ากันทุก client','ไม่ retry เลยทุกกรณี'],a:1,e:'retry พร้อมกันไม่จำกัดจะซ้ำเติมระบบที่ป่วย (retry storm)'}
],
db:[
 {q:'ตาราง orders เก็บ customer_name ซ้ำทุกแถว (order_id → customer_id → customer_name) ผิด normal form ใด',o:['1NF','2NF','3NF','ไม่ผิด'],a:2,e:'transitive dependency → แยกตาราง customers'},
 {q:'INDEX(a, b, c) ช่วย query ใด "ไม่ได้" ตามหลัก leftmost prefix',o:['WHERE a = 1','WHERE a = 1 AND b = 2','WHERE b = 2 AND c = 3','WHERE a = 1 AND b = 2 AND c = 3'],a:2,e:'ต้องเริ่มจากคอลัมน์ซ้ายสุด'},
 {q:'execution plan มี Key Lookup จำนวนมากหลัง Index Seek ควรแก้อย่างไร',o:['ลบ index ทิ้ง','ทำ covering index (INCLUDE คอลัมน์ที่ SELECT)','เพิ่ม RAM อย่างเดียว','เปลี่ยนเป็น LEFT JOIN'],a:1,e:'ให้ index มีคอลัมน์ครบ ไม่ต้องย้อนไปอ่านตารางหลัก'},
 {q:'ผู้ใช้สองคนแก้ราคาสินค้าเดียวกันพร้อมกัน คนหลังทับของคนแรกโดยไม่รู้ตัว แก้แบบไม่ lock นานด้วย',o:['NOLOCK hint','Optimistic concurrency (rowversion) แล้วตอบ 409 เมื่อชน','ลบ transaction ออก','เพิ่ม index ที่คอลัมน์ price'],a:1,e:'ตรวจเวอร์ชันแถวตอน UPDATE ถ้าไม่ตรง = มีคนแก้ก่อน'},
 {q:'ตาราง log โตวันละหลายล้านแถว ต้องลบข้อมูลเก่ากว่า 90 วันทุกวันโดยไม่หนักระบบ ควรใช้',o:['DELETE WHERE date < … ครั้งเดียวทั้งก้อน','Partition ตามวันที่ แล้ว drop/switch partition เก่า','เพิ่ม index ทุกคอลัมน์','ย้ายไป Excel'],a:1,e:'drop partition เป็น metadata operation เร็วมาก ไม่ล็อกตารางนาน'}
],
micro:[
 {q:'Mobile app และ Web ต้องการข้อมูลรูปแบบต่างกันจากหลาย service ควรใช้ pattern ใด',o:['Shared database','Backend for Frontend (BFF)','Distributed monolith','Two-phase commit'],a:1,e:'BFF รวม/ปรับข้อมูลให้แต่ละ client'},
 {q:'ทุก request จาก client ต้องผ่านการยืนยันตัวตน, rate limit และ routing ก่อนถึง service ควรวางที่',o:['ในทุก service ซ้ำกัน','API Gateway','ใน database trigger','ใน frontend'],a:1,e:'cross-cutting concerns ที่ขอบระบบ'},
 {q:'Consumer ได้รับ message เดิมซ้ำ (at-least-once) จะกันการประมวลผลซ้ำอย่างไร',o:['ปิด retry ของ broker','ทำ consumer ให้ idempotent เช่นเก็บ message id ที่ประมวลผลแล้ว','ใช้ UDP แทน','เพิ่ม partition'],a:1,e:'ส่วนใหญ่ broker รับประกัน at-least-once ฝั่งรับต้อง idempotent'},
 {q:'service หนึ่งต้องอ่าน DB ของอีก service โดยตรงเพื่อทำรายงาน ปัญหาหลักคืออะไร',o:['ไม่มีปัญหา','coupling ผ่าน schema — เปลี่ยน schema ทีหนึ่งพังหลาย service (ควรใช้ API หรือ event/read model)','ทำให้ query เร็วเกินไป','ใช้ network น้อยลง'],a:1,e:'database per service ปกป้องความเป็นอิสระในการ deploy'},
 {q:'CQRS เหมาะกับสถานการณ์ใดมากที่สุด',o:['CRUD เล็ก ๆ ทั่วไป','รูปแบบการอ่านกับการเขียนต่างกันมาก และอ่านหนัก ต้องการ read model แยกที่ query เร็ว','ต้องการลดจำนวน service','ต้องการ strong consistency ทุกจุด'],a:1,e:'แลกกับความซับซ้อนและ eventual consistency ของ read model'}
],
git:[
 {q:'เผลอ commit ไฟล์ที่มี API key และ push ขึ้น remote แล้ว ขั้นตอนแรกที่สำคัญที่สุดคือ',o:['ลบไฟล์แล้ว commit ใหม่','Revoke/rotate key ทันที แล้วค่อยล้างประวัติ (เช่น git filter-repo) และเพิ่ม secret scanning','force push ทับ','เปลี่ยนชื่อ repo'],a:1,e:'ถือว่า key รั่วแล้ว ประวัติอาจถูก clone ไปแล้ว'},
 {q:'git fetch ต่างจาก git pull อย่างไร',o:['เหมือนกัน','fetch ดึงข้อมูลจาก remote มาโดยไม่ merge, pull = fetch + merge (หรือ rebase)','fetch ลบ branch','pull ไม่ดึงข้อมูล'],a:1,e:'fetch ปลอดภัย ดูก่อนค่อยรวม'},
 {q:'ควรใช้ rebase กับ branch ใด "ไม่ควร"',o:['feature branch ส่วนตัวที่ยังไม่ push','branch ที่แชร์กับคนอื่นและ push แล้ว (เช่น main)','branch ทดลองในเครื่อง','ก่อนเปิด PR เพื่อจัด commit'],a:1,e:'rebase เขียนประวัติใหม่ ทำให้คนอื่นมีประวัติไม่ตรงกัน'},
 {q:'Trunk-based development เด่นที่สุดเรื่องใด',o:['branch อายุยาวหลายเดือน','merge เข้า main บ่อย (วันละหลายครั้ง) ใช้ feature flag ซ่อนงานที่ยังไม่เสร็จ','ห้ามใช้ CI','ใช้ release branch ทุก commit'],a:1,e:'ลด merge conflict ใหญ่ เหมาะกับ CI/CD'},
 {q:'ต้องการยกเลิกผลของ commit ที่ push ขึ้น main แล้วอย่างปลอดภัย',o:['git reset --hard แล้ว force push','git revert <commit> แล้ว push','ลบ .git','git checkout -- .'],a:1,e:'revert สร้าง commit ใหม่ที่กลับค่า ไม่เขียนประวัติที่แชร์แล้ว'}
],
oop:[
 {q:'class OrderService ทำทั้งคำนวณราคา, บันทึก DB, ส่งอีเมล และสร้าง PDF ละเมิดหลักใด',o:['Single Responsibility Principle','Liskov Substitution','Interface Segregation','DRY'],a:0,e:'มีหลายเหตุผลให้ต้องแก้ class เดียว'},
 {q:'Square สืบทอดจาก Rectangle แล้ว set Width ทำให้ Height เปลี่ยนด้วย โค้ดที่ใช้ Rectangle พัง ละเมิดหลักใด',o:['OCP','LSP','DIP','SRP'],a:1,e:'subtype ต้องแทน base type ได้โดยไม่ทำให้พฤติกรรมผิด'},
 {q:'Controller สร้าง new SqlOrderRepository() เองข้างใน ทำให้ test ยาก ควรแก้ตามหลักใด',o:['Dependency Inversion — พึ่ง IOrderRepository แล้ว inject เข้ามา','เพิ่ม static method','ใช้ inheritance แทน','ทำ Singleton'],a:0,e:'พึ่ง abstraction และใช้ DI container'},
 {q:'ต้องสร้าง object ต่างชนิดตามประเภทเอกสาร (PDF/Excel/Word) โดยผู้เรียกไม่ต้องรู้ class จริง ใช้ pattern ใด',o:['Observer','Factory','Decorator','Adapter'],a:1,e:'Factory ซ่อนการเลือก class ที่จะสร้าง'},
 {q:'ต้องใช้ library ภายนอกที่ interface ไม่ตรงกับ interface ในระบบเรา ใช้ pattern ใด',o:['Adapter','Strategy','Singleton','Template Method'],a:0,e:'Adapter แปลง interface หนึ่งให้เป็นอีกแบบ'}
],
test:[
 {q:'โครงสร้าง unit test ที่อ่านง่ายและเป็นมาตรฐานคือ',o:['Arrange – Act – Assert','Act – Assert – Arrange','Setup – Teardown เท่านั้น','Given อย่างเดียว'],a:0,e:'เตรียม → เรียก → ตรวจ'},
 {q:'Test pyramid ที่ดีควรมีสัดส่วนอย่างไร',o:['E2E มากที่สุด','Unit มากที่สุด, integration รองลงมา, E2E น้อยที่สุด','เท่ากันทุกชั้น','ไม่ต้องมี unit test'],a:1,e:'unit เร็ว/ถูก E2E ช้า/เปราะ'},
 {q:'test ที่บางครั้งผ่านบางครั้งไม่ผ่านทั้งที่โค้ดไม่เปลี่ยน (flaky) มักเกิดจาก',o:['ใช้ AAA','พึ่งเวลาจริง/ลำดับการรัน/สถานะร่วมกัน/network','ใช้ mock','ตั้งชื่อ test ยาว'],a:1,e:'ทำให้ deterministic: inject clock, แยก state, mock ภายนอก'},
 {q:'Microservice A เรียก API ของทีม B ต้องการรู้ก่อน deploy ว่า B เปลี่ยน API แล้วจะทำ A พังหรือไม่ ใช้',o:['Load test','Contract testing (เช่น Pact)','Snapshot ของ UI','Manual test'],a:1,e:'consumer-driven contract ตรวจใน pipeline ของ provider'},
 {q:'ใน xUnit ต้องการรัน test เดียวกันกับข้อมูลหลายชุด ใช้',o:['[Fact] ซ้ำหลายอัน','[Theory] + [InlineData(...)]','[Skip]','[Trait]'],a:1,e:'Theory = parameterized test'}
],
mon:[
 {q:'ต้องการค้นหา log ของ request เดียวกันข้ามหลาย service ควรใส่อะไรใน log',o:['เวลาเครื่องอย่างเดียว','Correlation/Trace ID ที่ส่งต่อกันทุก hop + structured logging','ชื่อ developer','password ของผู้ใช้'],a:1,e:'structured log (JSON) + trace id ค้นและเชื่อมโยงได้'},
 {q:'log level ใดเหมาะกับ "ชำระเงินล้มเหลวเพราะ payment gateway ตอบ 500"',o:['Trace','Debug','Error','Information'],a:2,e:'เป็นความผิดพลาดที่ต้องตรวจสอบ (Warning ถ้า retry แล้วผ่าน)'},
 {q:'Golden signals 4 อย่างของ service คือ',o:['CPU, RAM, Disk, Network','Latency, Traffic, Errors, Saturation','Logs, Metrics, Traces, Events','Uptime, Cost, Users, Revenue'],a:1,e:'จาก Google SRE'},
 {q:'ควร alert แบบปลุกคนตอนตีสามเมื่อใด',o:['CPU เกิน 70% ชั่วขณะ','อาการที่กระทบผู้ใช้จริง/ผลาญ error budget เร็ว (symptom-based)','ทุก warning ใน log','disk ใช้ 40%'],a:1,e:'alert ที่ทำอะไรไม่ได้ทำให้ทีมล้า (alert fatigue)'},
 {q:'Liveness probe ต่างจาก Readiness probe อย่างไร',o:['เหมือนกัน','Liveness fail → restart container; Readiness fail → หยุดส่ง traffic แต่ไม่ restart','Readiness fail → ลบ pod ถาวร','Liveness ใช้ตรวจ DB'],a:1,e:'ไม่ควรเช็ค dependency ภายนอกใน liveness'}
],
fe:[
 {q:'Largest Contentful Paint (LCP) ช้าเพราะรูป hero ใหญ่ ควรแก้อย่างไร',o:['lazy-load รูป hero','ใช้ขนาดเหมาะสม/รูปแบบ WebP-AVIF, preload และไม่ lazy-load รูปที่อยู่บนจอแรก','เพิ่ม JavaScript','ใช้ setTimeout'],a:1,e:'รูปแรกบนจอต้องโหลดเร็วที่สุด'},
 {q:'INP (Interaction to Next Paint) สูง เพราะคลิกแล้วมี JS ทำงานหนัก 400ms แก้อย่างไร',o:['เพิ่ม CSS animation','แบ่งงานยาว (yield), ย้ายงานหนักไป Web Worker, ลด re-render','ใช้รูปใหญ่ขึ้น','เพิ่ม font'],a:1,e:'อย่าให้ main thread ถูกบล็อกนาน'},
 {q:'ทำไมควรใส่ hash ในชื่อไฟล์ static (app.3f9a2.js) แล้วตั้ง cache นานมาก',o:['เพื่อความสวยงาม','ไฟล์ใหม่ได้ชื่อใหม่ → cache ได้ถาวรโดยไม่ได้ของเก่า (cache busting)','เพื่อ SEO','เพื่อซ่อนโค้ด'],a:1,e:'immutable caching + เปลี่ยนชื่อเมื่อเนื้อหาเปลี่ยน'},
 {q:'รายการ 10,000 แถวทำให้หน้าเว็บกระตุก วิธีที่เหมาะสมคือ',o:['render ทั้งหมดทีเดียว','Virtualization / windowing — render เฉพาะแถวที่มองเห็น','ใส่ไว้ใน iframe','ใช้ table แทน div'],a:1,e:'ลดจำนวน DOM node'},
 {q:'การเก็บ access token ใน localStorage มีความเสี่ยงหลักอะไร',o:['ไม่มีความเสี่ยง','ถ้าเกิด XSS สคริปต์ของผู้โจมตีอ่าน token ได้ (HttpOnly cookie ป้องกันส่วนนี้ได้ดีกว่า)','ทำให้เว็บช้า','ใช้ไม่ได้บนมือถือ'],a:1,e:'HttpOnly cookie + SameSite + CSRF protection หรือ BFF'}
],
api:[
 {q:'สร้าง resource ใหม่สำเร็จด้วย POST ควรตอบ',o:['200 OK เปล่า ๆ','201 Created + header Location ของ resource ใหม่','204 No Content','302 Found'],a:1,e:'201 + Location'},
 {q:'feed ข้อมูลใหม่ถูกเพิ่มตลอดเวลา ใช้ OFFSET แล้วเจอรายการซ้ำ/หายระหว่างหน้า ควรใช้',o:['OFFSET ใหญ่ขึ้น','Cursor/keyset pagination (WHERE id < last_id ORDER BY id DESC LIMIT n)','ส่งทั้งหมดทีเดียว','สุ่มลำดับ'],a:1,e:'cursor เสถียรและเร็วกว่า OFFSET ลึก ๆ'},
 {q:'เว็บที่ https://app.example.com เรียก API ที่ https://api.example.com แล้วโดนเบราว์เซอร์บล็อก แก้อย่างไร',o:['ปิด HTTPS','ฝั่ง API ตั้ง CORS อนุญาต origin https://app.example.com (ไม่ใช่ * เมื่อใช้ credentials)','ใช้ JSONP','ให้ผู้ใช้ปิด security ของเบราว์เซอร์'],a:1,e:'CORS ตั้งที่ server'},
 {q:'ผู้ใช้ส่งคำขอเกินโควตา ควรตอบ',o:['400','403','429 Too Many Requests + Retry-After','503 เสมอ'],a:2,e:'429 พร้อมบอกเวลาให้ลองใหม่'},
 {q:'PUT ต่างจาก PATCH อย่างไร',o:['เหมือนกัน','PUT แทนที่ resource ทั้งก้อน (idempotent), PATCH แก้บางฟิลด์','PATCH ใช้ลบข้อมูล','PUT ใช้สร้างเท่านั้น'],a:1,e:'PUT ส่งซ้ำได้ผลเหมือนเดิม'}
],
sec:[
 {q:'API GET /orders/1234 ให้ผู้ใช้คนอื่นเปลี่ยนเลขแล้วเห็นคำสั่งซื้อของคนอื่น ช่องโหว่นี้คือ',o:['XSS','BOLA/IDOR (Broken Object Level Authorization)','CSRF','Clickjacking'],a:1,e:'ต้องตรวจว่า resource เป็นของผู้ใช้คนนั้นทุกครั้ง'},
 {q:'วิธีเก็บรหัสผ่านที่ถูกต้อง',o:['MD5','SHA-256 ไม่มี salt','bcrypt/Argon2/PBKDF2 (มี salt และช้าโดยตั้งใจ)','เข้ารหัส AES แล้วเก็บ key ไว้ในโค้ด'],a:2,e:'hash ที่ช้า + salt ต่อผู้ใช้'},
 {q:'ป้องกัน SQL Injection ที่ถูกต้องที่สุดคือ',o:['ลบเครื่องหมาย \' ออก','Parameterized query / ORM ที่ bind parameter','ซ่อน error message','ใช้ HTTPS'],a:1,e:'ข้อมูลไม่ถูกตีความเป็นคำสั่ง SQL'},
 {q:'API รับ JSON แล้ว map ลง entity ตรง ๆ ผู้ใช้ส่ง "isAdmin": true มาด้วยแล้วกลายเป็น admin เรียกว่า',o:['Mass assignment','SSRF','Path traversal','Replay attack'],a:0,e:'ใช้ DTO ที่มีเฉพาะฟิลด์ที่อนุญาต'},
 {q:'Cookie ของ session ควรตั้ง flag ใดบ้าง',o:['ไม่ต้องตั้ง','HttpOnly, Secure, SameSite','Public, Max-Age=10 ปี','Domain=* เพื่อใช้ทุกเว็บ'],a:1,e:'กัน JS อ่าน, ส่งเฉพาะ HTTPS, ลด CSRF'}
],
cont:[
 {q:'image กับ container ต่างกันอย่างไร',o:['เหมือนกัน','image = template แบบอ่านอย่างเดียว, container = instance ที่กำลังรันจาก image','container ใหญ่กว่า image เสมอ','image รันได้ แต่ container รันไม่ได้'],a:1,e:'image หนึ่งรันได้หลาย container'},
 {q:'ไฟล์ที่ผู้ใช้อัปโหลดหายทุกครั้งที่ container ถูกสร้างใหม่ ควรแก้อย่างไร',o:['เพิ่ม RAM','เก็บใน volume หรือ object storage (Blob/S3) แทน filesystem ของ container','commit container เป็น image ทุกคืน','ห้าม restart'],a:1,e:'filesystem ของ container ชั่วคราว'},
 {q:'ทำไมควรเรียง COPY *.csproj + dotnet restore ก่อน COPY โค้ดทั้งหมด ใน Dockerfile',o:['ไม่มีผล','ใช้ layer cache — แก้โค้ดแต่ไม่แก้ dependency จะไม่ต้อง restore ใหม่','ทำให้ image ปลอดภัยขึ้น','บังคับโดย Docker'],a:1,e:'layer ที่เปลี่ยนน้อยไว้ข้างบน'},
 {q:'ควรรัน process ใน container ด้วย user ใด',o:['root เสมอ','non-root user','user ของ developer','ไม่ต้องสนใจ'],a:1,e:'ลดความเสียหายถ้าถูกเจาะ'},
 {q:'Kubernetes ทำอะไรที่ docker run บนเครื่องเดียวทำไม่ได้',o:['build image','orchestration: กระจาย container หลายเครื่อง, restart อัตโนมัติ, scale, rolling update, service discovery','เขียนโค้ดให้','ลดขนาด image'],a:1,e:'container orchestrator'}
],
cicd:[
 {q:'CI (Continuous Integration) หมายถึงอะไรเป็นหลัก',o:['deploy production ทุก commit โดยอัตโนมัติ','merge โค้ดบ่อย แล้ว build + test อัตโนมัติทุกครั้ง','เขียนเอกสาร','ทดสอบด้วยมือก่อน release'],a:1,e:'Continuous Delivery/Deployment คือส่วนต่อจากนั้น'},
 {q:'Blue-green deployment คืออะไร',o:['deploy ทีละเครื่อง','มีสองสภาพแวดล้อมเหมือนกัน สลับ traffic ไปชุดใหม่ทีเดียว และสลับกลับได้ทันที','ทดสอบใน production กับผู้ใช้ 1%','ลบของเก่าก่อน deploy'],a:1,e:'canary = ทยอยเปิดเป็น %'},
 {q:'secret (เช่น connection string) ใน pipeline ควรเก็บที่ใด',o:['ใน YAML ใน repo','Secret variable / variable group ที่ลิงก์ Key Vault','ในชื่อ branch','ใน README'],a:1,e:'ไม่ commit secret และ mask ใน log'},
 {q:'"Build once, deploy many" หมายความว่า',o:['build ใหม่ทุก environment','build artifact ครั้งเดียว แล้วนำ artifact เดิมไป deploy ทุก environment ด้วย config ต่างกัน','deploy ครั้งเดียวต่อปี','ใช้เครื่องเดียว'],a:1,e:'มั่นใจว่าสิ่งที่ทดสอบคือสิ่งเดียวกับที่ขึ้น prod'},
 {q:'ต้องการให้ PR เข้า main ได้เฉพาะเมื่อ build และ test ผ่าน ใช้',o:['Branch policy / required status check','ให้ทุกคน push ตรง main','cron job','tag'],a:0,e:'บังคับคุณภาพก่อน merge'}
],
cloud:[
 {q:'Shared responsibility model: เมื่อใช้ IaaS (VM) ใครรับผิดชอบ patch OS',o:['ผู้ให้บริการคลาวด์','ลูกค้า','ไม่มีใคร','ผู้ใช้ปลายทาง'],a:1,e:'PaaS/SaaS ผู้ให้บริการรับไปมากขึ้น'},
 {q:'งานที่ทำงานเมื่อมีไฟล์อัปโหลดเข้า storage นาน ๆ ครั้ง ใช้เวลาไม่กี่วินาที ควรใช้',o:['VM เปิด 24 ชั่วโมง','Serverless function (Azure Functions / Lambda) แบบ event trigger','Kubernetes cluster ใหญ่','เครื่อง on-prem'],a:1,e:'จ่ายตามการใช้งานจริง'},
 {q:'ข้อเสียที่ต้องระวังของ serverless',o:['scale ไม่ได้','cold start, จำกัดเวลารัน, ยากต่อการ debug แบบ local','แพงกว่าเสมอ','ไม่รองรับ HTTP'],a:1,e:'งานรันยาวต่อเนื่องอาจเหมาะกับ container/VM มากกว่า'},
 {q:'ต้องการรู้ว่าทีมใช้เงินคลาวด์ไปกับโปรเจกต์ใด ควรทำอย่างไร',o:['ใช้ account เดียวไม่แยก','ใส่ tag (project/env/owner) + budget alert + cost analysis','ปิดทุกอย่าง','ดูใบเสร็จสิ้นปี'],a:1,e:'FinOps เบื้องต้น'},
 {q:'Object storage (Blob/S3) เหมาะกับข้อมูลแบบใด',o:['transaction ที่ต้อง JOIN','ไฟล์ขนาดใหญ่ รูป วิดีโอ backup log (ไม่มี schema)','ตัวแปรใน RAM','session ที่ต้องอ่านทุก ms'],a:1,e:'ถูก ทนทาน เข้าถึงผ่าน HTTP'}
],
ai:[
 {q:'RAG (Retrieval-Augmented Generation) ทำงานอย่างไร',o:['ฝึกโมเดลใหม่ทุกครั้งที่มีเอกสาร','ค้นเอกสารที่เกี่ยวข้อง (มักใช้ embedding/vector search) แล้วใส่ใน prompt ให้โมเดลตอบจากข้อมูลนั้น','เพิ่ม temperature','ลบ system prompt'],a:1,e:'ลด hallucination ใช้ข้อมูลล่าสุดได้โดยไม่ต้อง fine-tune'},
 {q:'Embedding คืออะไร',o:['รูปภาพที่ฝังในเอกสาร','เวกเตอร์ตัวเลขแทนความหมายของข้อความ ใช้หาความคล้ายกันได้','รหัสผ่านของโมเดล','จำนวน token สูงสุด'],a:1,e:'ใช้ cosine similarity ค้นหาความหมายใกล้เคียง'},
 {q:'ข้อมูลใดไม่ควรส่งเข้า LLM ภายนอกโดยไม่มีการควบคุม',o:['คำถามทั่วไป','ข้อมูลส่วนบุคคล/ความลับลูกค้า/secret โดยไม่ผ่านนโยบายและการ mask','ตัวอย่างโค้ดสาธารณะ','ข้อความทักทาย'],a:1,e:'PDPA/นโยบายองค์กร'},
 {q:'Classification ต่างจาก Regression อย่างไร',o:['เหมือนกัน','Classification ทำนายหมวดหมู่ (สแปม/ไม่สแปม), Regression ทำนายค่าตัวเลขต่อเนื่อง (ราคา)','Regression ใช้กับรูปเท่านั้น','Classification ไม่ต้องมี label'],a:1,e:'metric ต่างกัน: accuracy/F1 vs MAE/RMSE'},
 {q:'Prompt injection คืออะไร',o:['การเขียน prompt ยาวเกิน','ข้อความจากผู้ใช้/เอกสารภายนอกพยายามสั่งให้โมเดลเพิกเฉยคำสั่งเดิมหรือทำสิ่งที่ไม่ได้รับอนุญาต','การ fine-tune','การตั้ง temperature = 0'],a:1,e:'แยก instruction กับ data, จำกัดสิทธิ์ tool, ตรวจ output'}
],
sqlt:[
 {q:'ต้องการกรองกลุ่มที่ SUM(amount) > 1000 หลัง GROUP BY ใช้',o:['WHERE SUM(amount) > 1000','HAVING SUM(amount) > 1000','ORDER BY','LIMIT'],a:1,e:'WHERE กรองก่อนจัดกลุ่ม HAVING กรองหลัง'},
 {q:'ต้องการลูกค้าทุกคน รวมคนที่ไม่เคยสั่งซื้อ พร้อมจำนวนคำสั่งซื้อ (0 ถ้าไม่เคย) ใช้',o:['INNER JOIN + COUNT(*)','LEFT JOIN + COUNT(o.id)','RIGHT JOIN + COUNT(*)','CROSS JOIN'],a:1,e:'COUNT(*) จะนับแถว NULL เป็น 1 — ต้องนับคอลัมน์ฝั่งขวา'},
 {q:'ต้องการคำสั่งซื้อในเดือนมีนาคม 2026 โดยใช้ index ได้ เงื่อนไขที่ถูกต้องคือ',o:['WHERE MONTH(order_date) = 3','WHERE order_date >= \'2026-03-01\' AND order_date < \'2026-04-01\'','WHERE order_date BETWEEN \'2026-03-01\' AND \'2026-03-31\' เสมอ','WHERE order_date LIKE \'%03%\''],a:1,e:'ช่วงปิด-เปิด ครอบคลุมเวลาทั้งวันสุดท้ายและ sargable'},
 {q:'ต้องการยอดขายสะสม (running total) ตามวันที่ ใช้',o:['SUM(amount) GROUP BY date','SUM(amount) OVER (ORDER BY date)','MAX(amount)','COUNT(*) OVER ()'],a:1,e:'window function ไม่ยุบแถว'},
 {q:'สินค้าราคาสูงสุดอันดับ 1 ของแต่ละหมวด (กรณีเสมอให้เอาทุกตัว) ควรใช้',o:['ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) = 1','RANK() OVER (PARTITION BY category ORDER BY price DESC) = 1','GROUP BY category อย่างเดียว','DISTINCT category'],a:1,e:'RANK ให้ลำดับ 1 กับทุกตัวที่เสมอ ROW_NUMBER เลือกแค่ตัวเดียว'}
],
pc:[
 {q:'prompt ใดดีที่สุดสำหรับให้ AI เขียนฟังก์ชันตรวจรูปแบบรหัสสินค้า',o:['"เขียนฟังก์ชันตรวจรหัสสินค้าให้หน่อย"','ระบุชื่อฟังก์ชัน, input/output, กฎทีละข้อ, ตัวอย่างถูก/ผิด และกรณีขอบ (ค่าว่าง, null, ช่องว่าง)','ส่งโค้ด regex ให้ AI แปลง','"ทำให้ดีที่สุด"'],a:1,e:'spec ชัด + ตัวอย่าง + edge case'},
 {q:'AI สร้างโค้ดที่ผ่านตัวอย่างแต่ตก hidden test ควรทำอย่างไร (ในเงื่อนไขห้ามแก้โค้ดเอง)',o:['แก้โค้ดเองเงียบ ๆ','วิเคราะห์ว่ากรณีใดที่ spec ยังไม่บอก แล้วเพิ่มกฎ/ตัวอย่างนั้นลงใน prompt','ส่ง prompt เดิมซ้ำจนผ่าน','ลดจำนวน test'],a:1,e:'ปรับที่ต้นเหตุ — spec ที่ยังไม่ครบ'},
 {q:'ทำไมการให้ตัวอย่าง input → output ที่ "ผิด/ต้องปฏิเสธ" จึงสำคัญ',o:['ไม่สำคัญ','ช่วยกำหนดขอบเขตชัดว่าอะไรไม่ผ่าน ลดการตีความกว้างเกินไปของ AI','ทำให้ prompt สั้นลง','ทำให้ AI ตอบเร็วขึ้น'],a:1,e:'ตัวอย่างลบ (negative examples) ปิดช่องว่างของกฎ'},
 {q:'ในโจทย์แปลงข้อความหลายกฎ เช่น mask ข้อมูล ควรระบุเรื่องใดเพิ่มเพื่อกันผลลัพธ์ทับกัน',o:['สีของข้อความ','ลำดับการประมวลผลกฎ และรูปแบบ output ที่แน่นอน (ตัวอักษร/จำนวนดาว)','ภาษาที่ใช้คอมเมนต์','ชื่อผู้เขียน'],a:1,e:'กฎหนึ่งอาจไปจับผลของอีกกฎ'},
 {q:'การบอก AI ว่า "คืนค่า false สำหรับ input ที่ไม่ใช่ string" มีผลอย่างไร',o:['ไม่มีผล','ทำให้ฟังก์ชันจัดการ type ผิดได้ ไม่ throw และผ่าน test กรณีขอบ','ทำให้โค้ดช้าลงมาก','ทำให้ AI ไม่ตอบ'],a:1,e:'hidden test มักมี null/undefined/number'}
],
algo:[
 {q:'หาว่าใน array มีสองตัวรวมกันได้ target หรือไม่ ใน O(n) ใช้',o:['loop ซ้อนสองชั้น','Hash map/set เก็บค่าที่เห็นแล้ว ตรวจ target - x','เรียงแล้ว binary search ทุกตัว (O(n²))','recursion'],a:1,e:'แลกหน่วยความจำ O(n) กับเวลา'},
 {q:'หาค่าน้อยที่สุดที่ "ทำได้" เช่นความจุเรือขั้นต่ำให้ขนครบใน D วัน (ถ้าความจุ x ทำได้ ค่าที่มากกว่าก็ทำได้) ใช้เทคนิค',o:['Greedy อย่างเดียว','Binary search on answer + ฟังก์ชันตรวจ feasible','DFS ทุกความเป็นไปได้','Sort อย่างเดียว'],a:1,e:'คำตอบมีคุณสมบัติ monotonic'},
 {q:'หาจำนวนกลุ่มที่เชื่อมต่อกันจากรายการคู่เพื่อน (เพิ่มขอบทีละเส้น) ใช้โครงสร้างใด',o:['Stack','Union-Find (Disjoint Set) พร้อม path compression','Priority queue','Linked list'],a:1,e:'เกือบ O(1) ต่อการ union/find'},
 {q:'จัดลำดับงานที่มีเงื่อนไข "งาน A ต้องเสร็จก่อน B" และตรวจว่ามีวงจรหรือไม่ ใช้',o:['Dijkstra','Topological sort (Kahn / in-degree)','Binary search','Two pointers'],a:1,e:'ถ้าจัดได้ไม่ครบทุกโหนด = มี cycle'},
 {q:'เส้นทางสั้นที่สุดบน grid ที่ทุกก้าวมีค่า 1 เท่ากัน ใช้อัลกอริทึมใดเหมาะที่สุด',o:['Dijkstra พร้อม heap','BFS','DFS','Bellman-Ford'],a:1,e:'น้ำหนักเท่ากันทุกเส้น BFS ให้ระยะสั้นสุดใน O(V+E)'}
]
};
