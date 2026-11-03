/* ================= LESSONS (part 1: Architecture + Engineering) ================= */
const LESSONS = [
/* ---------------- ARCH ---------------- */
{id:'sysd', tab:'arch', comp:'System Design', w:7.05, target:'I', min:90, title:'System Design — ออกแบบระบบให้ scale ได้',
 blocks:[
 {p:'<b>Lead ต้องทำได้:</b> ออกแบบระบบหลาย component ที่ scale และเชื่อถือได้ เปรียบเทียบทางเลือกสถาปัตยกรรม และสร้าง design view หลายมุม (structural, behavioral, interface) ให้ stakeholder'},
 {h:'กรอบคิด 6 ขั้น (ใช้ตอบโจทย์สถานการณ์)'},
 {ol:['<b>Requirements</b>: functional (ทำอะไร) + non-functional (ผู้ใช้กี่คน, latency, availability, consistency)','<b>Estimate</b>: QPS, ขนาดข้อมูล, อัตราอ่าน:เขียน','<b>API</b>: endpoint หลักและ contract','<b>Data model</b>: SQL/NoSQL, key, index','<b>High-level design</b>: client → LB → app (stateless) → cache → DB / queue → worker','<b>Bottleneck & trade-off</b>: จุดล่มเดี่ยว, hot key, การ scale, ความสอดคล้องของข้อมูล']},
 {h:'เครื่องมือหลักและใช้เมื่อไร'},
 {table:[['ปัญหา','เครื่องมือ','ข้อควรระวัง'],
  ['อ่านหนัก DB ทำงานหนัก','Cache-aside (Redis) + TTL, read replica','invalidation, stampede, replica lag'],
  ['static file โหลดช้าทั่วประเทศ','CDN','cache-busting ด้วยชื่อไฟล์มี hash'],
  ['งานช้า/ไม่ต้องรอผล','Message queue + worker (async)','retry, Dead Letter Queue, idempotency'],
  ['client ยิงถี่เกิน','Rate limiting (token bucket) → 429 + Retry-After','ตัวนับต้องอยู่ใน shared store'],
  ['ขยายหลายเครื่อง','Horizontal scaling + Load balancer','app ต้อง stateless (session ไป Redis/JWT)'],
  ['กระจาย key ไปหลาย cache node','Consistent hashing','ลดการย้าย key เมื่อเพิ่ม/ลด node'],
  ['cache key ดังหมดอายุพร้อมกัน','Single-flight lock, stale-while-revalidate, TTL jitter','']]},
 {h:'ตัวเลขที่ต้องคิดเป็น'},
 {ul:['<b>Availability แบบอนุกรม</b> (ต้องผ่านทุกตัว) = คูณกัน: 0.999 × 0.999 × 0.999 ≈ 99.7%','<b>แบบขนาน</b> (มีสำรอง) = 1 − (1 − a)ⁿ: สอง instance 99% → 99.99%','99.9% ต่อเดือน = downtime ≈ 43.2 นาที · 99.99% ≈ 4.3 นาที','1 ล้าน request/วัน ≈ 12 request/วินาที (เฉลี่ย) ช่วง peak มักคูณ 3–10']},
 {h:'CAP และความสอดคล้องของข้อมูล'},
 {p:'เมื่อเกิด network partition ต้องเลือก <b>C</b> (ปฏิเสธ/รอ เพื่อไม่ให้ข้อมูลผิด เช่น ยอดเงิน) หรือ <b>A</b> (ตอบได้แต่ข้อมูลอาจเก่า เช่น จำนวน like) ระบบส่วนใหญ่ใช้ <b>eventual consistency</b> ในส่วนที่ยอมได้ และ strong consistency เฉพาะส่วนสำคัญ'},
 {h:'Design views ที่ต้องรู้จัก'},
 {table:[['View','Diagram','ตอบคำถาม'],['Structural','Component / Class / C4 Container','มีอะไรบ้าง เชื่อมกันอย่างไร'],['Behavioral','Sequence / Activity / State','ทำงานตามลำดับอย่างไร'],['Data','ER diagram','ข้อมูลมีความสัมพันธ์อย่างไร'],['Deployment','Deployment / Infrastructure','รันอยู่ที่ไหน กี่ instance']]},
 {traps:['ตอบ "เปลี่ยนเป็น NoSQL/sharding" ก่อนลอง cache/replica/index — ข้อสอบชอบให้เลือกทางที่คุ้มสุดก่อน','sticky session เป็นแค่ workaround ไม่ใช่คำตอบที่ scale','retry ไม่จำกัดทำให้ระบบที่กำลังป่วยแย่ลง (ต้อง backoff + jitter + จำกัดจำนวน)']}
 ],
 quiz:[
 {q:'ระบบ 3 service ต่อกันแบบ synchronous แต่ละตัว 99.9% availability รวมประมาณเท่าไร',o:['99.9%','99.7%','99.97%','100%'],a:1,e:'อนุกรม = คูณกัน 0.999³ ≈ 0.997'},
 {q:'ข้อใดเป็นสาเหตุหลักที่ต้องทำให้ app server เป็น stateless',o:['ให้โค้ดสั้นลง','เพื่อให้ scale out หลัง load balancer ได้ และ instance ไหนล่มก็ไม่เสีย session','เพื่อให้ไม่ต้องใช้ database','เพื่อลดขนาด log'],a:1,e:'state ต้องอยู่ภายนอก (Redis/DB/token) request จึงไปเครื่องไหนก็ได้'},
 {q:'ต้องการแสดง "ลำดับการเรียกกันของ service ตามเวลา" ใน use case เดียว ควรใช้ diagram ใด',o:['ER diagram','Deployment diagram','Sequence diagram','Class diagram'],a:2,e:'Sequence diagram = behavioral view ตามเวลา'},
 {q:'Rate limiter ที่ยอมให้ burst สั้น ๆ แต่คุมอัตราเฉลี่ย คือ',o:['Fixed window','Token bucket','Round robin','Consistent hashing'],a:1,e:'ความจุ bucket = burst, อัตราเติม token = อัตราเฉลี่ย'}
 ]},

{id:'db', tab:'arch', comp:'Database Design', w:7.05, target:'I', min:90, title:'Database Design — schema, index, transaction',
 blocks:[
 {p:'<b>Lead ต้องทำได้:</b> ออกแบบและ normalize ฐานข้อมูลเชิงสัมพันธ์, ใช้ SQL ร่วมกับ NoSQL, tune ด้วย query plan/index/connection pool, ทำ migration และ versioning'},
 {h:'Normalization (จำแบบสั้น)'},
 {ul:['<b>1NF</b>: ทุกช่องเก็บค่าเดียว (ไม่เก็บ "tag1,tag2" ในช่องเดียว) ไม่มีกลุ่มคอลัมน์ซ้ำ','<b>2NF</b>: (เมื่อ PK มีหลายคอลัมน์) ทุกคอลัมน์ต้องขึ้นกับ PK "ทั้งก้อน" ไม่ใช่บางส่วน','<b>3NF</b>: ไม่มี transitive dependency — order_id → customer_id → customer_name ผิด 3NF ต้องแยกตาราง customers','Denormalize อย่างตั้งใจได้เมื่ออ่านหนักมาก (เช่น read model, reporting) แต่ต้องมีวิธีทำให้ข้อมูลตรงกัน']},
 {h:'Index — หัวใจของ performance'},
 {ul:['B-tree index เร่ง WHERE/JOIN/ORDER BY แต่ทำให้ INSERT/UPDATE ช้าลงและกินพื้นที่','<b>Composite index</b>: คอลัมน์ equality ก่อน แล้วค่อย range/sort → INDEX(status, created_at) สำหรับ WHERE status=? AND created_at>? ORDER BY created_at','<b>Leftmost prefix</b>: INDEX(a,b,c) ใช้ได้กับ a, a+b, a+b+c แต่ไม่ช่วย WHERE b=? อย่างเดียว','<b>Sargable</b>: ห้ามครอบคอลัมน์ด้วยฟังก์ชัน — WHERE YEAR(d)=2026 ❌ → WHERE d >= \'2026-01-01\' AND d < \'2027-01-01\' ✅','<b>Covering index</b> (INCLUDE คอลัมน์) ทำให้ไม่ต้องย้อนไปอ่านตาราง (key lookup)','อ่าน execution plan: Table/Index <b>Scan</b> = อ่านทั้งหมด, <b>Seek</b> = กระโดดไปที่ข้อมูล, Key Lookup จำนวนมาก = ควรทำ covering index']},
 {h:'Transaction, isolation, concurrency'},
 {table:[['Anomaly','อาการ','Isolation ต่ำสุดที่กันได้'],['Dirty read','อ่านข้อมูลที่ยังไม่ commit','READ COMMITTED'],['Non-repeatable read','อ่านแถวเดิมสองครั้งได้ค่าต่างกัน','REPEATABLE READ'],['Phantom read','query เดิมได้แถวเพิ่ม/หาย','SERIALIZABLE (หรือ snapshot)'],['Lost update','สองคนแก้ทับกัน','Optimistic concurrency (rowversion) หรือ lock']]},
 {code:`// EF Core: optimistic concurrency
public class Product {
    public int Id { get; set; }
    public decimal Price { get; set; }
    [Timestamp] public byte[] RowVersion { get; set; } = default!;
}
try { await db.SaveChangesAsync(); }
catch (DbUpdateConcurrencyException) { return Conflict(); } // HTTP 409`},
 {h:'Migration และการ deploy แบบไม่ downtime'},
 {ul:['Migration เป็น versioned script อยู่ใน Git รันผ่าน pipeline — ห้ามแก้ migration ที่ apply ไปแล้ว ให้สร้างใหม่','<b>Expand → Migrate → Contract</b>: เพิ่มคอลัมน์ใหม่ (nullable) → แอปเขียนทั้งสองที่/backfill → แอปเลิกใช้ของเก่า → ลบคอลัมน์เก่า','เปลี่ยนชื่อคอลัมน์ตรง ๆ ทำให้แอปเวอร์ชันเก่าพังระหว่าง deploy']},
 {h:'SQL vs NoSQL / scaling'},
 {table:[['ต้องการ','เลือก'],['ACID, ความสัมพันธ์ซับซ้อน, รายงาน','Relational (SQL Server, PostgreSQL)'],['schema ยืดหยุ่น เอกสารซ้อนกัน','Document (MongoDB, Cosmos DB) หรือ JSON column'],['lookup ตาม key เร็วมาก, cache, session','Key-value (Redis)'],['ค้นหาข้อความ','Search engine (Elasticsearch, Azure AI Search)'],['อ่านหนัก','Read replica (ระวัง lag → read-your-writes)'],['ตารางใหญ่ตามเวลา ลบข้อมูลเก่า','Partition ตามช่วงเวลา (drop partition)'],['เกินเครื่องเดียว','Sharding (ทางท้ายสุด ซับซ้อนสูง)']]},
 {traps:['FK ไม่สร้าง index ให้อัตโนมัติใน SQL Server/PostgreSQL','ใส่ index ทุกคอลัมน์ ≠ เร็วขึ้น','LIKE \'%abc\' (wildcard นำหน้า) ใช้ index ปกติไม่ได้','เก็บวันที่เป็น VARCHAR dd/mm/yyyy → เรียง/กรองผิด ต้องใช้ date type']}
 ],
 quiz:[
 {q:'WHERE status = \'PAID\' AND created_at >= @d ORDER BY created_at ควรใช้ index ใด',o:['(created_at, status)','(status, created_at)','(amount)','ไม่ต้องใช้ index'],a:1,e:'equality ก่อน range/sort'},
 {q:'อ่านแถวเดิมสองครั้งใน transaction ได้ค่าต่างกัน คือ anomaly ใด',o:['Dirty read','Non-repeatable read','Phantom read','Deadlock'],a:1,e:'แก้ด้วย REPEATABLE READ ขึ้นไป'},
 {q:'การเปลี่ยนชื่อคอลัมน์โดยไม่ให้ระบบ downtime ควรทำอย่างไร',o:['ALTER rename ทันที','Expand/contract: เพิ่มคอลัมน์ใหม่ ย้ายข้อมูล ให้แอปใช้ใหม่ แล้วค่อยลบของเก่า','ลบตารางแล้วสร้างใหม่','ปิดระบบชั่วคราว'],a:1,e:'ทำให้แอปเวอร์ชันเก่าและใหม่ทำงานร่วมกันได้ระหว่าง deploy'},
 {q:'WHERE LOWER(email) = @e ไม่ใช้ index บน email เพราะ',o:['email ยาวเกิน','non-sargable — ฟังก์ชันครอบคอลัมน์','ต้องใช้ LIKE','index เสีย'],a:1,e:'แก้ด้วย collation ที่ไม่สนตัวพิมพ์ หรือ computed/functional index'}
 ]},

{id:'micro', tab:'arch', comp:'Microservices', w:5.69, target:'I', min:75, title:'Microservices — สื่อสาร, ข้อมูล, ความทนทาน',
 blocks:[
 {p:'<b>Lead ต้องทำได้:</b> จัดการ cross-cutting concern (logging, monitoring, auth) ด้วย middleware, สื่อสารแบบ messaging/event-driven, จัดการข้อมูลข้าม service, ความปลอดภัยด้วย OAuth2/JWT/mTLS และ zero trust'},
 {h:'แบ่ง service อย่างไร'},
 {p:'แบ่งตาม <b>business capability / bounded context</b> (Order, Inventory, Payment) แต่ละ service เป็นเจ้าของข้อมูลของตัวเอง (<b>database per service</b>) — ห้ามแบ่งตามตารางหรือตามชั้นเทคนิค และอย่าให้ service อื่นเข้าถึงฐานข้อมูลของเราโดยตรง'},
 {h:'Sync vs Async'},
 {table:[['','Synchronous (HTTP/gRPC)','Asynchronous (queue/event)'],['เหมาะกับ','ต้องการคำตอบทันที (query)','งานที่รอได้, แจ้งหลายระบบ'],['ข้อเสีย','ผูกกันตอน runtime, availability คูณกัน','eventual consistency, debug ยากกว่า'],['ต้องมี','timeout, retry+backoff, circuit breaker','idempotent consumer, DLQ, outbox']]},
 {h:'Resilience patterns'},
 {code:`// .NET 8: Microsoft.Extensions.Http.Resilience (Polly v8)
builder.Services.AddHttpClient<PaymentClient>(c => c.BaseAddress = new("https://payment"))
    .AddStandardResilienceHandler(); // timeout + retry(backoff+jitter) + circuit breaker + rate limiter`},
 {ul:['<b>Timeout</b>: ทุกการเรียกออกต้องมี','<b>Retry</b> แบบ exponential backoff + jitter เฉพาะ error ชั่วคราว (5xx, timeout) และ operation ต้อง idempotent','<b>Circuit breaker</b>: fail fast เมื่อปลายทางพัง ป้องกัน cascading failure','<b>Bulkhead</b>: แยก resource pool ไม่ให้ dependency เดียวกิน thread หมด','<b>Fallback</b>: ค่า default/cache เมื่อเรียกไม่ได้']},
 {h:'ข้อมูลข้าม service'},
 {ul:['<b>Saga</b>: แบ่งเป็น local transaction ต่อกัน ถ้าขั้นใดล้มเหลวรัน <b>compensating transaction</b> (choreography = ฟัง event กันเอง, orchestration = มีตัวควบคุมกลาง)','<b>Transactional Outbox</b>: เขียน event ลงตาราง outbox ใน transaction เดียวกับข้อมูล แล้ว relay ส่งไป broker — แก้ dual-write problem','<b>Idempotent consumer</b>: broker ส่งแบบ at-least-once จึงต้องกันประมวลผลซ้ำด้วย messageId','<b>CQRS / read model</b>: ข้อมูลที่ต้องรวมจากหลาย service ให้สร้าง view ไว้อ่าน อัปเดตจาก event','<b>API composition</b>: gateway/BFF เรียกหลาย service แล้วรวมผล (เหมาะกับข้อมูลไม่มาก)']},
 {h:'Security ระหว่าง service'},
 {ul:['ผู้ใช้ → Gateway: OAuth2/OIDC, JWT','Service → Service: <b>Client Credentials</b> flow หรือส่งต่อ token, <b>mTLS</b> (service mesh ช่วยทำให้)','<b>Zero trust</b>: never trust, always verify — แม้อยู่ใน network ภายใน']},
 {traps:['2PC ข้าม microservices = ตัวเลือกที่ผิดในข้อสอบส่วนใหญ่','"shared database" ทำให้ service ผูกกัน — ผิดหลัก','retry โดย operation ไม่ idempotent → ตัดเงินซ้ำ']}
 ],
 quiz:[
 {q:'บันทึก DB สำเร็จแต่ publish event ล้มเหลว (dual write) แก้ด้วย pattern ใด',o:['Circuit breaker','Transactional outbox','Bulkhead','Sticky session'],a:1,e:'event อยู่ใน transaction เดียวกับข้อมูล แล้ว relay ส่งต่อพร้อม retry'},
 {q:'Saga ใช้อะไรย้อนกลับเมื่อขั้นตอนหลังล้มเหลว',o:['Rollback ของ DB กลาง','Compensating transaction','Two-phase commit','ลบ log'],a:1,e:'เช่น ยกเลิกออเดอร์/คืนสต็อก'},
 {q:'ปลายทางล่ม ทำให้ผู้เรียกรอจน thread หมด ควรใช้',o:['Retry ไม่จำกัด','Timeout + circuit breaker','เพิ่ม log','Shared DB'],a:1,e:'fail fast ป้องกัน cascading failure'},
 {q:'Zero trust ระหว่าง service ภายในควรทำอย่างไร',o:['เชื่อทุก request ใน VNet','ยืนยันตัวตนทุกครั้งด้วย mTLS/token และ least privilege','ใช้ IP whitelist อย่างเดียว','ใช้ password เดียวกันทุก service'],a:1,e:'never trust, always verify'}
 ]},

/* ---------------- ENGINEERING ---------------- */
{id:'git', tab:'eng', comp:'GIT', w:7.05, target:'I', min:60, title:'Git — workflow ระดับทีม',
 blocks:[
 {p:'<b>Lead ต้องทำได้:</b> ออกแบบ branching/merging (feature, release, hotfix), แก้ conflict ซับซ้อน, rebase ให้ history เป็นเส้นตรง, tag/release, ใช้คำสั่งขั้นสูง (cherry-pick, stash, patch) และจัดการสิทธิ์/code review'},
 {h:'คำสั่งที่ต้องรู้ว่าใช้เมื่อไร'},
 {table:[['สถานการณ์','คำสั่ง'],['ดูของใหม่จาก remote โดยยังไม่ merge','git fetch'],['อัปเดต branch ส่วนตัวให้ต่อจาก main แบบเส้นตรง','git rebase main (ยังไม่แชร์ branch)'],['รวม commit เล็ก ๆ ก่อนเปิด PR','git rebase -i HEAD~5 (squash/fixup)'],['เอา commit เดียวจาก branch อื่น','git cherry-pick &lt;sha&gt;'],['ย้อน commit ที่ push แล้วบน shared branch','git revert &lt;sha&gt;'],['ย้อนของตัวเองที่ยังไม่ push','git reset --soft/--mixed/--hard'],['พักงานชั่วคราว','git stash / git stash pop'],['หา commit ที่ทำให้พัง','git bisect start/good/bad (หรือ bisect run)'],['กู้ commit ที่หายหลัง reset','git reflog'],['ทำ release','git tag -a v1.4.0 -m "..." && git push origin v1.4.0'],['force push อย่างปลอดภัย','git push --force-with-lease']]},
 {h:'Golden rule'},
 {p:'<b>ห้าม rebase / reset / force push บน branch ที่คนอื่นใช้ร่วม</b> (main, develop) เพราะเป็นการเขียน history ใหม่ ใช้ revert แทน'},
 {h:'Branching strategies'},
 {table:[['','Git Flow','GitHub Flow','Trunk-based'],['Branch หลัก','main + develop','main','main (trunk)'],['ฟีเจอร์','feature/* จาก develop','feature จาก main','branch อายุสั้น ≤ 1–2 วัน'],['Release','release/* → main + tag','deploy จาก main','deploy จาก main บ่อย + feature flag'],['Hotfix','hotfix/* จาก main → merge main และ develop','PR เข้า main','fix บน main'],['เหมาะกับ','release เป็นรอบ หลายเวอร์ชัน','web app deploy บ่อย','CI/CD เต็มรูปแบบ']]},
 {h:'PR hygiene และความปลอดภัย'},
 {ul:['commit เล็ก ทำเรื่องเดียว ข้อความบอก "ทำไม" (Conventional Commits: feat:, fix:, refactor:)','แยก refactor/format ออกจาก PR ที่เปลี่ยน logic','Branch protection: ต้องมี review, CI ผ่าน, ห้าม push ตรงเข้า main','<b>เผลอ push secret</b>: rotate/revoke ทันที → ลบออกจาก history (git filter-repo/BFG) → .gitignore + secret scanning','ไฟล์ใหญ่ใช้ Git LFS, monorepo ใหญ่ใช้ sparse checkout']},
 {traps:['git pull = fetch + merge (ไม่ใช่แค่ดาวน์โหลด)','reset --hard แล้ว force push บน main คือคำตอบผิดเสมอ','ลบไฟล์ secret ใน commit ใหม่ยังไม่พอ — ยังอยู่ใน history']}
 ],
 quiz:[
 {q:'ต้องการนำ commit แก้บั๊กหนึ่งตัวจาก release/2.3 มาใส่ main',o:['git merge release/2.3','git cherry-pick <sha>','git rebase release/2.3','git stash'],a:1,e:'cherry-pick เอาเฉพาะ commit นั้น'},
 {q:'ใน Git Flow hotfix แตกจากไหนและ merge กลับที่ใด',o:['develop → develop','main → main และ develop','feature → main','release → release'],a:1,e:'กันบั๊กกลับมาใน release ถัดไป'},
 {q:'มี 300 commits ระหว่างเวอร์ชันดีกับเวอร์ชันพัง วิธีหาเร็วที่สุด',o:['git log อ่านทีละตัว','git bisect','git blame','git revert ทั้งหมด'],a:1,e:'binary search ≈ 9 รอบ'},
 {q:'เผลอ reset --hard แล้ว commit หาย จะกู้ได้จาก',o:['ไม่มีทางกู้','git reflog','git stash','git tag'],a:1,e:'reflog เก็บประวัติตำแหน่ง HEAD ในเครื่อง'}
 ]},

{id:'oop', tab:'eng', comp:'OOP', w:7.05, target:'I', min:90, title:'OOP & SOLID & Design Patterns (C#)',
 blocks:[
 {p:'<b>Lead ต้องทำได้:</b> ออกแบบ class hierarchy ด้วย inheritance/polymorphism, ใช้ composition/aggregation, abstract class/interface เพื่อกำหนด contract, refactor ตาม SOLID และใช้ design pattern ให้เหมาะ'},
 {h:'4 เสาหลัก'},
 {table:[['หลัก','ความหมาย','ตัวอย่าง'],['Encapsulation','ซ่อน state, เปลี่ยนผ่าน method ที่คุมกฎ','private balance + Withdraw() ตรวจยอด'],['Abstraction','เปิดเฉพาะสิ่งที่จำเป็น','IPaymentGateway.Charge()'],['Inheritance','is-a ใช้โค้ดร่วม','SavingsAccount : Account'],['Polymorphism','เรียกผ่าน type แม่ ทำงานตามตัวจริง','IShape.Area()']]},
 {h:'SOLID แบบเห็นโค้ด'},
 {ul:['<b>S</b>RP: class มีเหตุผลให้เปลี่ยนเพียงเรื่องเดียว — InvoiceService ที่คำนวณ+ทำ PDF+ส่งเมล+บันทึก DB ต้องแยก','<b>O</b>CP: เพิ่มพฤติกรรมด้วยการเพิ่ม class ไม่ใช่แก้ switch เดิม (Strategy)','<b>L</b>SP: subclass ต้องแทน base ได้โดยไม่ทำให้ผลผิด (Square : Rectangle ผิด; throw NotSupportedException = สัญญาณเตือน)','<b>I</b>SP: interface เล็ก เฉพาะเรื่อง (IPrinter, IScanner แทน IMachine)','<b>D</b>IP: พึ่ง abstraction ไม่ใช่ new class จริงข้างใน → constructor injection']},
 {code:`// OCP + Strategy + DIP
public interface IShippingRate { string Code { get; } decimal Calc(decimal kg); }
public class Kerry : IShippingRate { public string Code => "kerry"; public decimal Calc(decimal kg) => 40 + kg * 10; }
public class Flash : IShippingRate { public string Code => "flash"; public decimal Calc(decimal kg) => 35 + kg * 12; }

public class ShippingService(IEnumerable<IShippingRate> rates)   // C# 12 primary constructor
{
    public decimal Quote(string code, decimal kg) =>
        rates.Single(r => r.Code == code).Calc(kg);               // เพิ่มเจ้าใหม่ = เพิ่ม class + ลงทะเบียน DI
}
// Program.cs
builder.Services.AddScoped<IShippingRate, Kerry>();
builder.Services.AddScoped<IShippingRate, Flash>();`},
 {h:'Interface vs Abstract class'},
 {table:[['','interface','abstract class'],['สืบทอดได้','หลายตัว','ตัวเดียว'],['state/field','ไม่มี (มี default method ได้)','มีได้ + constructor'],['ใช้เมื่อ','ความสามารถ (can-do) ข้ามลำดับชั้น','ตระกูลเดียวกันที่แชร์ implementation (is-a)']]},
 {h:'DI lifetime ใน .NET'},
 {ul:['<b>Transient</b>: สร้างใหม่ทุกครั้งที่ขอ','<b>Scoped</b>: หนึ่งตัวต่อ HTTP request (DbContext)','<b>Singleton</b>: ตัวเดียวทั้งแอป (ต้อง thread-safe)','<b>Captive dependency</b>: singleton ถือ scoped → bug (DbContext ถูกใช้ข้าม request)']},
 {h:'Design patterns ที่ออกข้อสอบบ่อย'},
 {table:[['Pattern','ใช้แก้','ตัวอย่าง .NET'],['Strategy','เลือก algorithm ตอน runtime แทน switch','IShippingRate'],['Factory','ซ่อนการสร้าง object ที่ซับซ้อน','IHttpClientFactory'],['Decorator','เพิ่มพฤติกรรมซ้อนชั้น (cache, log, retry) โดยไม่แก้ class เดิม','Scrutor .Decorate()'],['Observer / Domain event','แจ้งหลายผู้ฟังโดยไม่ผูกกัน','event, MediatR notification'],['Adapter','แปลง interface ของ lib ภายนอก','wrap SDK ของ payment'],['Repository','ซ่อน data access','IOrderRepository'],['Singleton','instance เดียว (ระวัง global state)','DI AddSingleton']]},
 {p:'<b>Composition over inheritance</b>: ถ้าความสามารถผสมกันได้หลายแบบ (บิน+ว่ายน้ำ+ล่องหน) ให้ประกอบ object แทนการสร้าง subclass ทุกการผสม · <b>Value object</b> ใช้ record ที่ immutable เช่น <code>public record Money(decimal Amount, string Currency);</code>'},
 {traps:['"is-a ในภาษาพูด" ไม่ได้แปลว่าควร inherit (Square/Rectangle)','Singleton pattern มือเขียน vs DI singleton — ข้อสอบมักให้ใช้ DI','abstract class ไม่ใช่คำตอบเมื่อ class สืบทอดตัวอื่นอยู่แล้ว']}
 ],
 quiz:[
 {q:'เพิ่มช่องทางชำระเงินใหม่ต้องแก้ switch ทุกครั้ง ละเมิดหลักใด',o:['SRP','OCP','LSP','ISP'],a:1,e:'แก้ด้วย Strategy/polymorphism'},
 {q:'singleton service ที่ inject DbContext (scoped) เข้ามา เกิดปัญหาใด',o:['ไม่มีปัญหา','Captive dependency — DbContext ถูกใช้ข้าม request/thread','DbContext ถูกสร้างใหม่ทุกครั้ง','compile ไม่ผ่านเสมอ'],a:1,e:'lifetime ของ dependency ต้องไม่สั้นกว่าผู้ใช้'},
 {q:'เพิ่ม caching ให้ repository เดิมโดยไม่แก้ class เดิม ใช้ pattern ใด',o:['Decorator','Singleton','Builder','Prototype'],a:0,e:'ห่อ interface เดิมแล้วเพิ่มพฤติกรรม'},
 {q:'class ที่ implement interface แล้ว throw NotSupportedException ในหลาย method สะท้อนการละเมิดหลักใดมากที่สุด',o:['ISP (และ LSP)','DIP','SRP','ไม่ละเมิด'],a:0,e:'interface ใหญ่เกินไป บังคับ implement สิ่งที่ทำไม่ได้'}
 ]},

{id:'test', tab:'eng', comp:'Unit & Functional Testing', w:5.69, target:'I', min:60, title:'Unit & Functional Testing (xUnit, Moq)',
 blocks:[
 {p:'<b>Lead ต้องทำได้:</b> ทำให้ coverage ถึงเกณฑ์และรายงาน (SonarQube), หาและปิดช่องว่างของ test, ใช้ mocking/stubbing กับ dependency ภายนอก'},
 {h:'Test pyramid'},
 {p:'Unit test จำนวนมาก (เร็ว เสถียร) → Integration test ระดับกลาง (DB จริง, HTTP) → E2E/UI test น้อย ๆ เฉพาะ journey สำคัญ ถ้ากลับหัว (E2E เยอะ) feedback จะช้าและ flaky'},
 {h:'โครงสร้าง test ที่ดี'},
 {code:`public class CouponTests
{
    [Theory]
    [InlineData("2026-03-01", false)]
    [InlineData("2026-03-31", true)]
    public void IsExpired_ComparesWithCurrentTime(string now, bool expected)
    {
        // Arrange
        var clock = new FakeTimeProvider(DateTimeOffset.Parse(now));   // Microsoft.Extensions.TimeProvider.Testing
        var coupon = new Coupon(expiresAt: DateTimeOffset.Parse("2026-03-15"), clock);
        // Act
        var result = coupon.IsExpired();
        // Assert
        Assert.Equal(expected, result);
    }
}`},
 {h:'Test doubles'},
 {table:[['ชนิด','ทำอะไร','ใช้เมื่อ'],['Dummy','ส่งเข้าไปให้ครบ parameter ไม่ถูกใช้','constructor ต้องการ'],['Stub','คืนค่าที่กำหนด','ป้อนข้อมูลให้ code under test'],['Fake','implementation เบา ๆ ที่ทำงานจริง','in-memory repository'],['Mock','ตรวจว่าถูกเรียกอย่างไร/กี่ครั้ง','ยืนยัน interaction เช่น ส่งอีเมล 1 ครั้ง'],['Spy','บันทึกการเรียกไว้ตรวจทีหลัง','']]},
 {code:`var email = new Mock<IEmailSender>();
var sut = new SignupService(email.Object, new FakeUserRepository());
await sut.RegisterAsync("a@x.com");
email.Verify(e => e.SendAsync("a@x.com", It.IsAny<string>()), Times.Once);`},
 {h:'Coverage ≠ คุณภาพ'},
 {ul:['Line coverage สูงแต่ assert น้อยก็ยังหลุดบั๊ก — ดู branch coverage, เพิ่ม edge case (null, empty, boundary, error path)','<b>Mutation testing</b> (Stryker.NET) วัดว่า test จับการเปลี่ยนโค้ดได้จริงไหม','SonarQube quality gate: coverage บนโค้ดใหม่ ≥ เกณฑ์, ไม่มี bug/vulnerability ใหม่']},
 {h:'Integration / Functional test'},
 {ul:['ASP.NET Core: <b>WebApplicationFactory</b> เรียก API ผ่าน HttpClient ในหน่วยความจำ','<b>Testcontainers</b>: รัน SQL Server/PostgreSQL จริงใน Docker ระหว่าง test (in-memory provider พฤติกรรมไม่เหมือน DB จริง)','<b>Contract test</b> (Pact): ตรวจว่า provider ยังทำตามที่ consumer ต้องการ','<b>TDD</b>: Red (เขียน test ที่ fail) → Green (เขียนโค้ดน้อยสุดให้ผ่าน) → Refactor']},
 {traps:['DateTime.Now / Random / network ใน unit test → flaky ต้อง inject','mock ทุกอย่างจน test แค่ยืนยัน implementation ไม่ใช่พฤติกรรม','EF Core InMemory ไม่ตรวจ constraint/SQL จริง']}
 ],
 quiz:[
 {q:'ต้องการยืนยันว่า Send() ถูกเรียกหนึ่งครั้ง ใช้ test double ใด',o:['Stub','Mock','Dummy','Fake'],a:1,e:'Mock = behavior verification'},
 {q:'ลำดับ TDD ที่ถูกต้อง',o:['Green → Red → Refactor','Red → Green → Refactor','Refactor → Red → Green','เขียนโค้ดก่อนแล้วค่อยเขียน test'],a:1,e:''},
 {q:'coverage 95% แต่บั๊กหลุดบ่อย สาเหตุที่เป็นไปได้มากที่สุด',o:['coverage ต้อง 100%','assertion อ่อน/ไม่ครอบคลุม edge case','SonarQube ผิด','test เร็วเกินไป'],a:1,e:'coverage วัดการรัน ไม่ได้วัดการตรวจผล'},
 {q:'test ผ่านด้วย in-memory DB แต่ production พังเพราะ SQL จริง ควรเพิ่มอะไร',o:['mock DB ให้มากขึ้น','integration test กับ DB จริงผ่าน Testcontainers','ลบ test','รันบน production'],a:1,e:''}
 ]},

{id:'mon', tab:'eng', comp:'Monitoring and Logging', w:5.69, target:'I', min:60, title:'Monitoring, Logging & Observability',
 blocks:[
 {p:'<b>Lead ต้องทำได้:</b> ออกแบบ observability (metrics, logs, traces) ข้าม service, นำ incident response ด้วย runbook และ post-mortem (RCA), optimize reliability, ทำ distributed tracing และ APM'},
 {h:'3 Pillars'},
 {table:[['','ตอบคำถาม','เครื่องมือ'],['Metrics','เกิดอะไร มากแค่ไหน (ตัวเลขตามเวลา)','Prometheus, Azure Monitor, Grafana'],['Logs','รายละเอียดเหตุการณ์','Serilog → Seq/ELK/Log Analytics'],['Traces','request เดินทางผ่าน service ไหน ช้าที่ไหน','OpenTelemetry → Jaeger/App Insights']]},
 {h:'Structured logging'},
 {code:`// message template: ได้ทั้งข้อความและ field ที่ค้นหาได้
_logger.LogInformation("Order {OrderId} paid by {CustomerId} in {ElapsedMs} ms", order.Id, order.CustomerId, sw.ElapsedMilliseconds);
// ❌ อย่าใช้ string interpolation: $"Order {order.Id}" (ได้ข้อความแต่ไม่มี field)
// ❌ อย่า log password, token, เลขบัตร, PII`},
 {ul:['Level: Trace/Debug (dev) · Information (เหตุการณ์ปกติสำคัญ) · Warning (ผิดปกติแต่ไปต่อได้) · Error (ล้มเหลว ต้องมีคนดู) · Critical (ระบบใช้ไม่ได้)','ใส่ <b>correlation/trace id</b> ทุก log เพื่อรวม log ข้าม service (W3C traceparent)']},
 {h:'Metrics ที่ใช้ตั้ง alert'},
 {ul:['<b>Golden signals</b>: latency, traffic, errors, saturation · <b>RED</b> (Rate, Errors, Duration) สำหรับ service · <b>USE</b> (Utilization, Saturation, Errors) สำหรับ resource','ใช้ percentile (p95/p99) ไม่ใช่ค่าเฉลี่ย','ระวัง <b>high cardinality</b>: อย่าใส่ user_id/order_id เป็น label ของ metric','Alert ที่ "อาการที่ผู้ใช้รู้สึก" (error rate, latency) ไม่ใช่ CPU อย่างเดียว → ลด alert fatigue']},
 {h:'SLI / SLO / Error budget'},
 {ul:['<b>SLI</b>: ตัววัด เช่น % ของ request ที่สำเร็จและเร็วกว่า 300 ms','<b>SLO</b>: เป้าหมาย เช่น 99.9% ต่อ 30 วัน','<b>Error budget</b> = 100% − SLO → 43.2 นาที/เดือน ถ้าใช้หมดเร็ว ให้ชะลอฟีเจอร์แล้วแก้ความเสถียร','<b>Burn-rate alert</b>: แจ้งเมื่อเผางบเร็วผิดปกติ','<b>SLA</b> = สัญญากับลูกค้า (มีค่าปรับ) มักหลวมกว่า SLO']},
 {h:'Health check, tracing, incident'},
 {ul:['ASP.NET Core: AddHealthChecks() — <b>liveness</b> (process ยังอยู่ไหม → restart) vs <b>readiness</b> (พร้อมรับ traffic ไหม → ถอดออกจาก LB)','Tracing ทุก request แพง → ใช้ sampling (head-based สุ่มตั้งแต่ต้น, tail-based เก็บเฉพาะ trace ที่ error/ช้า)','Incident: detect → triage (severity) → mitigate ก่อน (rollback/feature flag) → resolve → <b>blameless post-mortem</b> (timeline, root cause ด้วย 5 Whys, action items มีเจ้าของ)']},
 {traps:['alert ที่ CPU > 70% อย่างเดียว ≠ คำตอบที่ดีที่สุด','ค่าเฉลี่ย latency ซ่อนปัญหา tail','post-mortem เพื่อหาคนผิด = ผิดหลัก']}
 ],
 quiz:[
 {q:'request ผ่าน 6 services แล้วช้า ต้องการรู้ว่าช้าที่ hop ไหน ใช้',o:['Metrics CPU','Distributed tracing','Log level Debug','Health check'],a:1,e:'trace แสดง span และเวลาของแต่ละ service'},
 {q:'SLO 99.9% ต่อ 30 วัน มี error budget ประมาณเท่าไร',o:['4.3 นาที','43.2 นาที','7.2 ชั่วโมง','1 วัน'],a:1,e:'43,200 นาที × 0.1%'},
 {q:'ใส่ label user_id ให้ metric แล้วระบบ monitoring ล่ม เพราะ',o:['user_id ยาว','high cardinality → time series ระเบิด','metric ต้องเป็นข้อความ','ต้องเปิด tracing'],a:1,e:'ข้อมูลรายผู้ใช้ไปอยู่ใน log/trace'},
 {q:'probe ใดที่ควร fail เมื่อ DB ยังเชื่อมไม่ได้ตอน start เพื่อไม่ให้รับ traffic',o:['Liveness','Readiness','Startup ไม่มีผล','ไม่ต้องมี'],a:1,e:'liveness fail จะทำให้ถูก restart วนไม่จบ'}
 ]}
];
