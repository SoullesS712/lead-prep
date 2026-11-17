/* ================= เนื้อหาเจาะลึก — แทรกก่อน "กับดักในข้อสอบ" ของแต่ละบท =================
   แต่ละบทมี: โจทย์สถานการณ์ + วิธีคิดทีละขั้น, ตารางเทียบที่ออกบ่อย, ตัวอย่างโค้ด/การใช้จริง */
const EXTRA = {
sysd:[
 {h:'เจาะลึก: ฝึกคิดกับโจทย์จริง — ระบบจองตั๋วคอนเสิร์ต'},
 {p:'โจทย์: ขายตั๋ว 50,000 ใบ เปิดขายพร้อมกัน มีคนเข้าพร้อมกัน 500,000 คน ห้ามขายเกิน และหน้าเว็บต้องไม่ล่ม'},
 {ol:['<b>Requirements</b>: ห้าม oversell (consistency สำคัญที่สุด), รองรับ burst สูงมากในช่วงสั้น, ผู้ใช้ยอมรอคิวได้','<b>Estimate</b>: 500k คนใน 1–2 นาที ≈ 5,000–10,000 req/วินาที แต่ตั๋วมีแค่ 50k → คนส่วนใหญ่จะไม่ได้ตั๋ว','<b>ลดโหลดที่ทางเข้า</b>: virtual waiting room (queue) ปล่อยคนเข้าเป็นรอบ ๆ + rate limit ต่อผู้ใช้ + CDN สำหรับหน้า static','<b>กันขายเกิน</b>: ตัดสต็อกแบบ atomic (UPDATE … WHERE remaining > 0 หรือ Redis DECR) และ "จองชั่วคราว" (hold) 10 นาที ถ้าไม่จ่ายคืนสต็อก','<b>ชำระเงิน</b>: async ผ่าน queue + idempotency key กันตัดเงินซ้ำ แจ้งผลด้วย webhook','<b>ความทนทาน</b>: ถ้า payment ล่ม ให้ hold ยังอยู่และ retry ได้ ไม่ทำให้ระบบจองล่มตาม (circuit breaker)']},
 {h:'เลือก consistency ให้ถูกส่วน'},
 {table:[['ข้อมูล','ต้องการ','เหตุผล'],['จำนวนตั๋วคงเหลือ / ยอดเงิน','Strong consistency','ผิดแล้วเสียเงิน/ขายเกิน'],['จำนวนคนรอคิว, ยอดวิว','Eventual consistency','คลาดเล็กน้อยไม่กระทบ'],['ประวัติการสั่งซื้อของผู้ใช้','Read-your-writes','ผู้ใช้ต้องเห็นสิ่งที่ตัวเองเพิ่งทำ'],['รายงานยอดขายรายวัน','Eventual (batch/CQRS)','อ่านจาก read model ได้']]},
 {h:'Back-of-the-envelope ที่ควรจำ'},
 {ul:['1 วัน ≈ 86,400 วินาที → 1 ล้าน request/วัน ≈ 12 req/วินาที (เฉลี่ย) ช่วงพีคมักคูณ 3–10','อ่าน memory ~100 ns, SSD ~100 µs, network ใน data center ~0.5 ms, ข้ามทวีป ~150 ms','availability 99.9% = ล่มได้ ~43 นาที/เดือน, 99.99% ≈ 4.3 นาที/เดือน','ข้อมูล 1 KB × 1 ล้านแถว ≈ 1 GB (ยังไม่รวม index)']}
],
db:[
 {h:'เจาะลึก: อ่าน execution plan ให้เป็น'},
 {table:[['สิ่งที่เห็นใน plan','ความหมาย','สิ่งที่ควรทำ'],['Table Scan / Clustered Index Scan บนตารางใหญ่','อ่านทุกแถว','หา index ที่ตรงกับ WHERE/JOIN'],['Index Seek + Key Lookup จำนวนมาก','เจอแถวด้วย index แต่ต้องย้อนไปอ่านคอลัมน์อื่น','covering index (INCLUDE คอลัมน์ที่ SELECT)'],['Estimated rows ต่างจาก Actual มาก','สถิติเก่าหรือ parameter sniffing','UPDATE STATISTICS / ปรับ query'],['Sort / Hash Match กิน cost สูง','เรียงหรือ join ข้อมูลมาก','index ที่เรียงตาม ORDER BY/JOIN อยู่แล้ว'],['Implicit conversion','ชนิดข้อมูลไม่ตรง (nvarchar vs varchar)','ใช้ชนิดเดียวกับคอลัมน์']]},
 {h:'ตัวอย่าง: ออกแบบ schema ระบบ e-commerce ให้ผ่าน 3NF'},
 {code:`customers(id PK, name, email UNIQUE, phone)
products(id PK, sku UNIQUE, name, category_id FK, price)
categories(id PK, name)
orders(id PK, customer_id FK, status, created_at, total)      -- total เก็บซ้ำได้ (denormalize) เพื่อรายงานเร็ว
order_items(order_id FK, product_id FK, qty, unit_price,    -- unit_price = ราคา ณ วันซื้อ ไม่ใช่ราคาปัจจุบัน
            PRIMARY KEY (order_id, product_id))
-- index ที่ควรมี: orders(customer_id, created_at), order_items(product_id), products(category_id)`},
 {p:'จุดที่ข้อสอบชอบถาม: <b>unit_price ใน order_items ไม่ใช่การซ้ำซ้อนผิด 3NF</b> เพราะเป็นข้อเท็จจริง ณ เวลาซื้อ (ราคาสินค้าเปลี่ยนได้ภายหลัง) และ FK ต้องสร้าง index เองเพื่อให้ JOIN/DELETE เร็ว'},
 {h:'Isolation level เทียบกันในตารางเดียว'},
 {table:[['Level','Dirty read','Non-repeatable','Phantom','ใช้เมื่อ'],['READ UNCOMMITTED','เกิดได้','เกิดได้','เกิดได้','รายงานคร่าว ๆ ที่ยอมผิดได้'],['READ COMMITTED (ค่าเริ่มต้น SQL Server)','กันได้','เกิดได้','เกิดได้','งานทั่วไป'],['REPEATABLE READ','กันได้','กันได้','เกิดได้','อ่านซ้ำต้องได้ค่าเดิม'],['SERIALIZABLE','กันได้','กันได้','กันได้','ต้องถูกต้องสูงสุด แลกกับ lock มาก'],['SNAPSHOT','กันได้','กันได้','กันได้','อ่านไม่บล็อกเขียน (ใช้ row versioning)']]}
],
micro:[
 {h:'เจาะลึก: Saga แบบ choreography vs orchestration'},
 {table:[['','Choreography','Orchestration'],['การควบคุม','แต่ละ service ฟัง event แล้วทำต่อเอง','มี orchestrator สั่งทีละขั้น'],['เหมาะกับ','flow สั้น 2–3 ขั้น','flow ยาว มีเงื่อนไขซับซ้อน'],['ข้อดี','ไม่มีศูนย์กลาง coupling ต่ำ','เห็น flow ที่เดียว debug ง่าย'],['ข้อเสีย','flow กระจาย ตามยาก วนกันได้','orchestrator อาจกลายเป็นจุดรวม logic']]},
 {p:'ตัวอย่าง flow สั่งซื้อ: <b>Order(PENDING)</b> → Payment ตัดเงิน → Inventory ตัดสต็อก → Order(CONFIRMED) ถ้า Inventory ไม่พอ ให้ส่ง event "StockFailed" → Payment <b>คืนเงิน</b> (compensating) → Order(CANCELLED) — ทุกขั้นต้อง idempotent เพราะ event อาจมาซ้ำ'},
 {h:'Transactional Outbox ในโค้ด'},
 {code:`// 1) ในฐานข้อมูลเดียวกัน transaction เดียว
await using var tx = await db.Database.BeginTransactionAsync();
order.Status = "PAID";
db.Outbox.Add(new OutboxMessage { Id = Guid.NewGuid(), Type = "OrderPaid",
                                  Payload = JsonSerializer.Serialize(new { order.Id }) });
await db.SaveChangesAsync();
await tx.CommitAsync();
// 2) Background worker อ่าน Outbox ที่ยังไม่ส่ง → publish ไป broker → ทำเครื่องหมายว่าส่งแล้ว
//    (ส่งซ้ำได้ ผู้รับต้อง idempotent ด้วย message Id)`},
 {h:'Resilience patterns สรุปรวม'},
 {table:[['Pattern','แก้ปัญหา','ค่าที่ต้องตั้ง'],['Timeout','รอนานไม่จบ','ต่ำกว่า timeout ของผู้เรียกเสมอ'],['Retry + backoff + jitter','ล้มชั่วคราว','จำนวนครั้ง, ฐานเวลา, ใช้กับ operation ที่ idempotent'],['Circuit breaker','ปลายทางป่วยต่อเนื่อง','threshold, ระยะ open, half-open trial'],['Bulkhead','ปลายทางหนึ่งกิน resource หมด','ขนาด pool ต่อปลายทาง'],['Fallback','ต้องตอบอะไรสักอย่าง','ค่า cache/ค่าเริ่มต้นที่ปลอดภัย']]}
],
git:[
 {h:'เจาะลึก: เลือก branching strategy'},
 {table:[['Strategy','branch หลัก','เหมาะกับ','ข้อควรระวัง'],['Git Flow','main, develop, feature/*, release/*, hotfix/*','release เป็นรอบ มีหลายเวอร์ชันต้องดูแล','branch อายุยาว merge ยาก'],['GitHub Flow','main + feature branch สั้น ๆ','deploy ต่อเนื่อง เว็บ/บริการเดียว','main ต้อง deploy ได้เสมอ'],['Trunk-based','main (trunk) + branch อายุ ≤ 1–2 วัน','ทีมที่ deploy วันละหลายครั้ง','ต้องมี feature flag และ CI ที่ดี']]},
 {h:'สถานการณ์กู้คืนที่ต้องตอบได้'},
 {table:[['สถานการณ์','คำสั่งที่เหมาะ','หมายเหตุ'],['commit ผิดยังไม่ push','git reset --soft HEAD~1 แล้วแก้ใหม่','ไม่กระทบคนอื่น'],['commit ผิดและ push ขึ้น main แล้ว','git revert <sha>','ไม่เขียนประวัติที่แชร์ใหม่'],['เผลอ reset --hard','git reflog แล้ว git reset --hard <sha>','reflog เก็บประวัติ HEAD ในเครื่อง'],['ต้องการ commit เดียวจากอีก branch','git cherry-pick <sha>','อาจ conflict ต้องแก้'],['หาว่า commit ไหนทำพัง','git bisect start/good/bad หรือ bisect run','binary search'],['ไฟล์ secret ถูก push','rotate secret ก่อน แล้วค่อยล้างประวัติ','ถือว่ารั่วแล้วเสมอ']]},
 {h:'merge vs rebase vs squash'},
 {ul:['<b>merge</b>: เก็บประวัติจริงทั้งหมด มี merge commit — ปลอดภัยกับ branch ที่แชร์','<b>rebase</b>: ย้าย commit ไปต่อท้าย ได้ประวัติเส้นตรง — ใช้กับ branch ส่วนตัวที่ยังไม่แชร์เท่านั้น','<b>squash merge</b>: รวมทั้ง PR เป็น commit เดียวบน main — ประวัติ main สะอาด แต่เสียรายละเอียด commit ย่อย']}
],
oop:[
 {h:'เจาะลึก: refactor ทีละขั้นด้วย SOLID'},
 {p:'โค้ดเริ่มต้น: <code>OrderService.Checkout()</code> คำนวณส่วนลดด้วย switch, บันทึกด้วย new SqlRepository(), ส่งอีเมลด้วย new SmtpClient() — test ยาก แก้ทีพังหลายที่'},
 {code:`// หลัง refactor
public interface IDiscountPolicy { bool AppliesTo(Customer c); decimal Apply(decimal total); }   // OCP: เพิ่ม policy ใหม่ไม่แก้ของเดิม
public interface IOrderRepository { Task SaveAsync(Order o); }                                  // DIP
public interface INotifier { Task OrderPlacedAsync(Order o); }                                   // ISP: interface เล็ก ตรงงาน

public class CheckoutService                                                                      // SRP: ประสานงานอย่างเดียว
{
    private readonly IEnumerable<IDiscountPolicy> _policies;
    private readonly IOrderRepository _repo;
    private readonly INotifier _notifier;
    public CheckoutService(IEnumerable<IDiscountPolicy> p, IOrderRepository r, INotifier n)
        => (_policies, _repo, _notifier) = (p, r, n);

    public async Task<Order> CheckoutAsync(Customer c, Cart cart)
    {
        var total = cart.Total;
        foreach (var p in _policies.Where(p => p.AppliesTo(c))) total = p.Apply(total);
        var order = Order.Create(c.Id, cart.Items, total);   // กฎของ Order อยู่ใน Order (encapsulation)
        await _repo.SaveAsync(order);
        await _notifier.OrderPlacedAsync(order);
        return order;
    }
}`},
 {h:'Design patterns ที่ออกสอบบ่อย — จำจาก "ปัญหา"'},
 {table:[['ปัญหา','Pattern'],['เลือกอัลกอริทึมได้หลายแบบตอน runtime','Strategy'],['เพิ่มความสามารถ (cache/log/retry) โดยไม่แก้ class เดิม','Decorator'],['ใช้ library ที่ interface ไม่ตรงกับของเรา','Adapter'],['สร้าง object ต่างชนิดโดยผู้เรียกไม่ต้องรู้ class จริง','Factory'],['แจ้งหลายผู้รับเมื่อ state เปลี่ยน','Observer (event)'],['object มีพารามิเตอร์ทางเลือกเยอะ','Builder'],['ซ่อนระบบย่อยซับซ้อนไว้หลัง interface ง่าย ๆ','Facade'],['ขั้นตอนหลักเหมือนกัน ต่างกันบางขั้น','Template Method']]},
 {h:'Composition over inheritance'},
 {p:'ใช้ inheritance เมื่อเป็นความสัมพันธ์ "is-a" จริงและแทนกันได้ตาม LSP ถ้าแค่อยากใช้โค้ดซ้ำหรือผสมความสามารถหลายแบบ ให้ใช้ composition (ถือ object ที่ทำงานนั้นไว้) — ลด class explosion และเปลี่ยนพฤติกรรมได้ตอน runtime'}
],
test:[
 {h:'เจาะลึก: เขียน unit test ที่ดีด้วย xUnit + Moq'},
 {code:`public class CheckoutServiceTests
{
    [Theory]
    [InlineData(1000, 900)]     // สมาชิก VIP ลด 10%
    [InlineData(0, 0)]          // กรณีขอบ: ตะกร้าว่าง
    public async Task Vip_gets_10_percent_off(decimal cartTotal, decimal expected)
    {
        // Arrange
        var repo = new Mock<IOrderRepository>();
        var notifier = new Mock<INotifier>();
        var sut = new CheckoutService(new[] { new VipDiscount() }, repo.Object, notifier.Object);
        var vip = new Customer { Id = 1, IsVip = true };

        // Act
        var order = await sut.CheckoutAsync(vip, Cart.WithTotal(cartTotal));

        // Assert
        Assert.Equal(expected, order.Total);
        repo.Verify(r => r.SaveAsync(It.Is<Order>(o => o.Total == expected)), Times.Once);
        notifier.Verify(n => n.OrderPlacedAsync(It.IsAny<Order>()), Times.Once);
    }
}`},
 {h:'Test double — เลือกให้ถูก'},
 {table:[['ชนิด','ทำอะไร','ใช้เมื่อ'],['Dummy','ส่งไปให้ครบพารามิเตอร์ ไม่ถูกใช้','constructor ต้องการแต่ test ไม่เกี่ยว'],['Stub','คืนค่าที่กำหนดไว้','ควบคุม input จาก dependency'],['Fake','ทำงานได้จริงแบบเบา (in-memory repo)','ต้องการพฤติกรรมใกล้ของจริง'],['Spy','จดว่าถูกเรียกอย่างไร','ตรวจภายหลังแบบยืดหยุ่น'],['Mock','ตั้งความคาดหวังและ verify interaction','ต้องยืนยันว่ามีการเรียก (Times.Once)']]},
 {h:'ตั้งชื่อ test ให้อ่านแล้วรู้ว่าพังเพราะอะไร'},
 {ul:['รูปแบบ <code>Method_Condition_ExpectedResult</code> เช่น <code>Withdraw_InsufficientBalance_ThrowsDomainException</code>','หนึ่ง test ตรวจหนึ่งพฤติกรรม — assert หลายตัวได้ถ้าเป็นผลของพฤติกรรมเดียวกัน','test ต้อง deterministic: ไม่พึ่งเวลาจริง ลำดับการรัน หรือ network']}
],
mon:[
 {h:'เจาะลึก: ตั้ง SLO และ alert ให้ทีมไม่ล้า'},
 {ol:['เลือก <b>SLI</b> ที่สะท้อนผู้ใช้: สัดส่วน request ที่สำเร็จ และสัดส่วนที่ตอบภายใน 300 ms','ตั้ง <b>SLO</b>: เช่น 99.9% ของ request ใน 30 วันต้องสำเร็จ → error budget 0.1% ≈ 43 นาที','<b>Burn-rate alert</b>: ปลุกคนเมื่อใช้ budget เร็ว (เช่นใช้ 2% ใน 1 ชั่วโมง) ส่วนที่ช้ากว่านั้นเปิด ticket','<b>Error budget policy</b>: budget ใกล้หมด → หยุดปล่อยฟีเจอร์เสี่ยง ทำงาน reliability ก่อน']},
 {h:'Structured logging ใน ASP.NET Core (Serilog)'},
 {code:`Log.Information("Order {OrderId} paid by {CustomerId} amount {Amount}", order.Id, c.Id, total);
// ได้ JSON ที่ค้นได้: {"OrderId":1043,"CustomerId":7,"Amount":1250,"TraceId":"4bf92f…","Level":"Information"}
// ห้าม: Log.Information($"Order {order.Id} paid ... card {cardNumber}")  ← string interpolation ค้นยาก และรั่ว PII`},
 {h:'Three pillars + เมื่อใช้อะไร'},
 {table:[['สัญญาณ','ตอบคำถาม','ตัวอย่างเครื่องมือ'],['Metrics','ระบบโดยรวมปกติไหม เกิดบ่อยแค่ไหน','Prometheus, Azure Monitor'],['Logs','เกิดอะไรขึ้นกับ request/เหตุการณ์นี้','Elasticsearch, Loki, Log Analytics'],['Traces','ช้าที่ service/hop ไหน','OpenTelemetry + Jaeger, App Insights']]}
],
fe:[
 {h:'เจาะลึก: ไล่แก้หน้าเว็บช้าตาม Core Web Vitals'},
 {table:[['อาการ','วัดด้วย','สาเหตุที่พบบ่อย','วิธีแก้'],['เนื้อหาหลักขึ้นช้า','LCP > 2.5 s','รูป hero ใหญ่, render-blocking CSS/JS, server ช้า','รูปขนาดพอดี WebP/AVIF + preload, SSR/SSG, CDN'],['กดแล้วตอบสนองช้า','INP > 200 ms','JS งานยาวบน main thread, re-render ทั้งหน้า','แบ่งงาน (yield), Web Worker, memo, code splitting'],['หน้ากระตุก/เลื่อน','CLS > 0.1','รูป/โฆษณาไม่จองพื้นที่, font สลับ','กำหนด width/height/aspect-ratio, font-display']]},
 {h:'Rendering strategy — ตัดสินใจจากคำถาม 3 ข้อ'},
 {ol:['ต้องติด SEO หรือแชร์ลิงก์แล้วต้องมี preview ไหม? ถ้าใช่ → SSR/SSG/ISR','ข้อมูลเปลี่ยนบ่อยแค่ไหน? นาน ๆ ครั้ง → SSG/ISR, ทุก request ต่างกัน → SSR','หลัง login และโต้ตอบมาก? → CSR (SPA) ได้ ไม่ต้องห่วง SEO']},
 {h:'Security ฝั่ง frontend ที่ Lead ต้องรู้'},
 {ul:['ไม่ใช้ <code>dangerouslySetInnerHTML</code>/<code>innerHTML</code> กับข้อมูลผู้ใช้ ถ้าจำเป็นต้อง sanitize (DOMPurify)','เก็บ token ใน HttpOnly cookie หรือผ่าน BFF แทน localStorage','ตั้ง Content-Security-Policy จำกัดแหล่ง script','อย่าใส่ secret ใน bundle — ทุกอย่างใน JS ฝั่ง client อ่านได้']}
],
api:[
 {h:'เจาะลึก: ออกแบบ API ชำระเงินที่ส่งซ้ำได้อย่างปลอดภัย'},
 {code:`POST /payments
Idempotency-Key: 6f1c-…-a92e          ← client สร้าง UUID หนึ่งครั้งต่อการกดจ่าย
{ "orderId": 1043, "amount": 1250.00 }

// Server
if (await store.TryGetAsync(key, out var saved)) return saved.Response;   // เคยทำแล้ว → ตอบผลเดิม
var result = await gateway.ChargeAsync(...);
await store.SaveAsync(key, requestHash, result, ttl: TimeSpan.FromHours(24));
return Created($"/payments/{result.Id}", result);                          // 201 + Location`},
 {p:'ถ้า key เดิมแต่ body ต่างกัน ให้ตอบ <b>422/409</b> เพราะเป็นการใช้ key ผิด ไม่ใช่การ retry'},
 {h:'Status code ที่ต้องแยกให้ออก'},
 {table:[['Code','ใช้เมื่อ'],['200 OK','สำเร็จและมี body'],['201 Created','สร้างใหม่สำเร็จ + Location'],['202 Accepted','รับงานไว้ทำแบบ async + URL ดูสถานะ'],['204 No Content','สำเร็จไม่มี body (เช่น DELETE)'],['400 Bad Request','รูปแบบ request ผิด'],['401 Unauthorized','ยังไม่ยืนยันตัวตน/token หมดอายุ'],['403 Forbidden','รู้ว่าเป็นใครแต่ไม่มีสิทธิ์'],['404 Not Found','ไม่มี resource (หรือซ่อนว่ามีจากคนไม่มีสิทธิ์)'],['409 Conflict','ชนกับสถานะปัจจุบัน (เช่น version ไม่ตรง)'],['412 Precondition Failed','If-Match ไม่ตรง ETag'],['422 Unprocessable Entity','รูปแบบถูกแต่ผิดกฎทางธุรกิจ'],['429 Too Many Requests','เกินโควตา + Retry-After'],['503 Service Unavailable','ชั่วคราวให้บริการไม่ได้ + Retry-After']]},
 {h:'REST vs GraphQL vs gRPC'},
 {table:[['','REST','GraphQL','gRPC'],['เหมาะกับ','public API, CRUD, cache ผ่าน HTTP','frontend ที่ต้องการข้อมูลหลายรูปแบบ','service-to-service ประสิทธิภาพสูง'],['จุดแข็ง','เรียบง่าย cache ได้ดี','client เลือก field เอง ลด over/under-fetching','binary, streaming, contract ชัด'],['ระวัง','over/under-fetching','N+1 (ใช้ DataLoader), cache ยาก','เบราว์เซอร์เรียกตรงยาก']]}
],
sec:[
 {h:'เจาะลึก: OWASP Top 10 (2021) กับตัวอย่างใน .NET'},
 {table:[['ความเสี่ยง','ตัวอย่าง','ป้องกัน'],['A01 Broken Access Control','เปลี่ยน id ใน URL แล้วเห็นข้อมูลคนอื่น','ตรวจ owner/role ฝั่ง server ทุกครั้ง, deny by default'],['A02 Cryptographic Failures','เก็บรหัสผ่านด้วย MD5, ส่งข้อมูลผ่าน HTTP','bcrypt/Argon2, TLS ทุกที่, เข้ารหัสข้อมูลอ่อนไหว'],['A03 Injection','ต่อ string เป็น SQL/command','parameterized query, ORM, validate input'],['A04 Insecure Design','ไม่มี rate limit ที่หน้า OTP','threat modeling ตั้งแต่ออกแบบ'],['A05 Security Misconfiguration','เปิด stack trace/Swagger บน prod','hardening, ปิดของที่ไม่ใช้'],['A06 Vulnerable Components','ใช้ library ที่มี CVE','SCA ใน pipeline, อัปเดตสม่ำเสมอ'],['A07 Auth Failures','ไม่มี lockout, session ไม่หมดอายุ','MFA, lockout, token อายุสั้น'],['A08 Integrity Failures','deserialize ข้อมูลไม่น่าเชื่อถือ, CI ไม่ verify','ลงลายเซ็น artifact, จำกัด type'],['A09 Logging Failures','ไม่ log การ login ล้มเหลว','log เหตุการณ์ความปลอดภัย + alert'],['A10 SSRF','server ดึง URL ที่ผู้ใช้ส่งมา','allowlist ปลายทาง, บล็อก IP ภายใน/metadata']]},
 {h:'ตรวจสิทธิ์ระดับ object ใน ASP.NET Core'},
 {code:`[Authorize]
[HttpGet("/api/orders/{id:int}")]
public async Task<IActionResult> Get(int id)
{
    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
    var order = await db.Orders.SingleOrDefaultAsync(o => o.Id == id && o.CustomerId == userId);
    return order is null ? NotFound() : Ok(OrderDto.From(order));   // ไม่บอกว่ามี order ของคนอื่นอยู่
}`},
 {h:'Authentication vs Authorization'},
 {ul:['<b>Authentication</b> = คุณคือใคร (login, OIDC, MFA) → ล้มเหลวตอบ 401','<b>Authorization</b> = คุณทำสิ่งนี้ได้ไหม (role, policy, ownership) → ล้มเหลวตอบ 403 (หรือ 404 เพื่อไม่เปิดเผยว่ามีอยู่)','JWT: ตรวจ signature + iss + aud + exp เสมอ และกำหนด algorithm ฝั่ง server ตายตัว']}
],
cont:[
 {h:'เจาะลึก: Dockerfile ที่ดีสำหรับ ASP.NET Core'},
 {code:`# ---- build ----
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY *.csproj ./
RUN dotnet restore                      # layer นี้ถูก cache ถ้า csproj ไม่เปลี่ยน
COPY . .
RUN dotnet publish -c Release -o /app --no-restore

# ---- runtime ----
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app .
USER app                                # ไม่รันด้วย root
EXPOSE 8080
ENTRYPOINT ["dotnet", "Api.dll"]
# config/secret ส่งตอน runtime ผ่าน env var หรือ secret store — ไม่ใส่ใน image`},
 {h:'Kubernetes objects ที่ต้องรู้จัก'},
 {table:[['Object','หน้าที่'],['Pod','หน่วยเล็กสุดที่รัน container (ตายได้ ถูกแทนได้)'],['Deployment','จำนวน replica + rolling update ของ pod'],['Service','ชื่อ DNS และ load balance ไปยัง pod'],['Ingress','รับ HTTP จากภายนอกแล้ว route ตาม host/path'],['ConfigMap / Secret','config ทั่วไป / ค่าลับ ส่งเข้า pod'],['HorizontalPodAutoscaler','เพิ่ม/ลด replica ตาม CPU หรือ metric'],['Probe (liveness/readiness/startup)','ตรวจว่าควร restart / ส่ง traffic / ยัง start อยู่']]},
 {h:'สาเหตุที่ container มีปัญหาบ่อย'},
 {ul:['<b>CrashLoopBackOff</b>: แอปล้มตอน start (config ผิด, ต่อ DB ไม่ได้) → ดู kubectl logs --previous','<b>OOMKilled</b>: ใช้ memory เกิน limit','<b>ImagePullBackOff</b>: ชื่อ/tag image ผิด หรือไม่มีสิทธิ์ดึงจาก registry','readiness fail ตลอด: health endpoint เช็ก dependency ที่ช้าหรือผิด path']}
],
cicd:[
 {h:'เจาะลึก: pipeline ของ .NET API (Azure DevOps YAML)'},
 {code:`stages:
- stage: Build
  jobs:
  - job: build
    steps:
    - script: dotnet restore --locked-mode          # ใช้ lock file กัน dependency เปลี่ยนเอง
    - script: dotnet build -c Release --no-restore
    - script: dotnet test -c Release --no-build --collect:"XPlat Code Coverage"
    - task: SonarCloudAnalyze@1                      # quality gate
    - script: dotnet publish -c Release -o $(Build.ArtifactStagingDirectory)
    - publish: $(Build.ArtifactStagingDirectory)     # artifact เดียว ใช้ทุก environment
      artifact: api
- stage: DeployUAT
  dependsOn: Build
  jobs:
  - deployment: uat
    environment: uat
- stage: DeployProd
  dependsOn: DeployUAT
  jobs:
  - deployment: prod
    environment: prod                                # environment นี้ตั้ง approval ไว้`},
 {h:'กลยุทธ์ deploy เทียบกัน'},
 {table:[['กลยุทธ์','downtime','rollback','ต้นทุน'],['Recreate','มี','ช้า (deploy ใหม่)','ต่ำ'],['Rolling','ไม่มี','ปานกลาง','ต่ำ'],['Blue-green / slot swap','ไม่มี','เร็วมาก (สลับกลับ)','สองชุด'],['Canary','ไม่มี','เร็ว จำกัดผลกระทบ','ต้องมี metric และ routing'],['Feature flag','ไม่มี','ปิด flag ทันที','ต้องจัดการ flag เก่า']]},
 {h:'DORA metrics'},
 {ul:['<b>Deployment frequency</b> — deploy บ่อยแค่ไหน','<b>Lead time for changes</b> — จาก commit ถึง production นานเท่าไร','<b>Change failure rate</b> — deploy กี่ % ที่ทำให้เกิดปัญหา','<b>Time to restore</b> — กู้ระบบได้เร็วแค่ไหน']}
],
cloud:[
 {h:'เจาะลึก: เลือกบริการ compute ให้ตรงงาน'},
 {table:[['บริการ','ดูแลเอง','เหมาะกับ'],['VM (IaaS)','OS, patch, runtime, แอป','ซอฟต์แวร์เดิมที่ต้องควบคุมเครื่อง'],['App Service (PaaS)','แอปและ config','web/API ทั่วไป deploy ง่าย'],['Container Apps / ECS','container และ config','microservices ที่ไม่อยากดูแล cluster'],['Kubernetes (AKS/EKS)','workload + cluster บางส่วน','ระบบใหญ่ ต้องการควบคุมละเอียด'],['Functions / Lambda','โค้ดฟังก์ชัน','งานตาม event/ตารางเวลา รันสั้น']]},
 {h:'Storage และฐานข้อมูลบน cloud'},
 {table:[['ต้องการ','บริการตัวอย่าง (Azure / AWS)'],['ไฟล์ รูป backup','Blob Storage / S3'],['ฐานข้อมูล relational แบบจัดการให้','Azure SQL / RDS'],['NoSQL กระจายหลาย region','Cosmos DB / DynamoDB'],['cache','Azure Cache for Redis / ElastiCache'],['ค้นหาข้อความ','Azure AI Search / OpenSearch'],['ส่งข้อความระหว่าง service','Service Bus / SQS+SNS']]},
 {h:'ความปลอดภัยและค่าใช้จ่าย'},
 {ul:['ใช้ <b>Managed Identity / IAM Role</b> แทน key ในโค้ด และให้สิทธิ์น้อยที่สุด','เปิด <b>private endpoint</b> ให้ฐานข้อมูล ไม่เปิด public','ติด tag (project/env/owner) ตั้ง budget alert และปิด resource ที่ไม่ใช้','งานคงที่ทั้งปี → reserved/savings plan, งานหยุดได้ → spot, งานเป็นช่วง ๆ → serverless']}
],
ai:[
 {h:'เจาะลึก: สถาปัตยกรรม RAG ที่ใช้งานจริง'},
 {ol:['<b>Ingest</b>: แบ่งเอกสารเป็น chunk (เช่น 300–800 token, มี overlap) เก็บ metadata (แหล่ง, วันที่, สิทธิ์)','<b>Embed</b>: แปลง chunk เป็นเวกเตอร์ เก็บใน vector index','<b>Retrieve</b>: แปลงคำถามเป็นเวกเตอร์ ค้น top-k (มัก hybrid: vector + keyword) แล้ว re-rank','<b>Generate</b>: ใส่ chunk ที่ได้ลง prompt สั่งให้ตอบจาก context เท่านั้น อ้างอิงแหล่ง และตอบว่าไม่ทราบเมื่อไม่พบ','<b>Evaluate</b>: ชุดคำถามทดสอบ วัดความถูกต้อง/ความครบ/การอ้างอิง ก่อนและหลังแก้']},
 {h:'Metric ของ machine learning'},
 {table:[['งาน','Metric','หมายเหตุ'],['Classification','Accuracy, Precision, Recall, F1, AUC','ข้อมูลไม่สมดุลใช้ precision/recall/F1 แทน accuracy'],['Regression','MAE, RMSE, R²','RMSE ลงโทษความผิดพลาดใหญ่มากกว่า'],['Ranking/Search','Precision@k, nDCG','วัดลำดับผลลัพธ์'],['LLM/RAG','faithfulness, answer relevance, groundedness','มักใช้ชุด eval + คนตรวจ']]},
 {h:'ใช้ AI ในงานพัฒนาอย่างปลอดภัย'},
 {ul:['ไม่ส่ง secret/ข้อมูลส่วนบุคคลเข้า AI ภายนอกโดยไม่ผ่านนโยบาย','review โค้ดที่ AI เขียนเหมือนโค้ดคน: เข้าใจทุกบรรทัด, มี test, ตรวจ security และ license','ให้ AI เรียกระบบผ่าน tool ที่โค้ดเราควบคุมสิทธิ์ ไม่ให้รัน SQL/คำสั่งตรง','ป้องกัน prompt injection: แยก instruction กับข้อมูล, จำกัดสิทธิ์ tool, ตรวจ output']}
],
sqlt:[
 {h:'เจาะลึก: ลำดับการทำงานของ SQL (logical order)'},
 {p:'<b>FROM/JOIN → WHERE → GROUP BY → HAVING → SELECT (window function คำนวณตรงนี้) → DISTINCT → ORDER BY → LIMIT</b> — เพราะเหตุนี้ WHERE ใช้ alias ใน SELECT หรือกรองผลของ window function ไม่ได้ ต้องห่อด้วย CTE/subquery ก่อน'},
 {h:'Window function ที่ต้องเขียนคล่อง'},
 {table:[['ฟังก์ชัน','ให้อะไร','ตัวอย่างใช้'],['ROW_NUMBER()','ลำดับไม่ซ้ำ','เลือก 1 แถวต่อกลุ่ม'],['RANK()','ลำดับ เสมอได้ ข้ามเลข (1,1,3)','top-N ที่ต้องเอาทุกตัวที่เสมอ'],['DENSE_RANK()','ลำดับ เสมอได้ ไม่ข้าม (1,1,2)','อันดับที่ 2 แบบไม่ข้าม'],['SUM() OVER (ORDER BY …)','ยอดสะสม','running total'],['SUM() OVER ()','ยอดรวมทั้งหมดในทุกแถว','คิด % ของทั้งหมด'],['LAG()/LEAD()','ค่าแถวก่อน/ถัดไป','เทียบกับเดือนก่อน, ระยะห่างวัน'],['AVG() OVER (PARTITION BY …)','ค่าเฉลี่ยของกลุ่มในทุกแถว','เทียบกับค่าเฉลี่ยแผนก']]},
 {h:'รูปแบบ query ที่เจอบ่อยในข้อสอบ'},
 {code:`-- Top-N ต่อกลุ่ม
WITH r AS (SELECT *, ROW_NUMBER() OVER (PARTITION BY category ORDER BY revenue DESC) rn FROM s)
SELECT * FROM r WHERE rn <= 3;

-- คนที่ "ไม่เคย" ทำ X  (ปลอดภัยกับ NULL)
SELECT c.* FROM customers c
WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id AND o.status = 'PAID');

-- Pivot ด้วย CASE
SELECT category,
       SUM(CASE WHEN month = '2026-01' THEN amount ELSE 0 END) AS jan,
       SUM(CASE WHEN month = '2026-02' THEN amount ELSE 0 END) AS feb
FROM sales GROUP BY category;

-- ช่วงวันที่ที่ใช้ index ได้และครอบคลุมเวลาทั้งวัน
WHERE order_date >= '2026-03-01' AND order_date < '2026-04-01'`}
],
pc:[
 {h:'เจาะลึก: โครงสร้าง prompt ที่ใช้ได้กับทุกโจทย์แปลงข้อความ'},
 {ol:['<b>หน้าที่</b>: ชื่อฟังก์ชัน input/output และชนิดข้อมูล ("คืน number หรือ null")','<b>ขั้นตอนตามลำดับ</b>: ตัดช่องว่าง → ตรวจรูปแบบ → แปลง → คืนผล (ลำดับสำคัญเมื่อกฎทับกัน)','<b>กฎแต่ละข้อ</b>: เขียนเป็นข้อ ๆ ชัดเจน ระบุสิ่งที่ "รับ" และ "ไม่รับ"','<b>รูปแบบ output ที่แน่นอน</b>: ตัวพิมพ์, ตัวคั่น, จำนวนตำแหน่งทศนิยม, ค่าที่คืนเมื่อผิด','<b>ตัวอย่าง</b>: กรณีปกติ 3–5 ตัว + กรณีขอบ (ว่าง, ช่องว่าง, ตัวพิมพ์) + กรณีที่ต้องปฏิเสธ']},
 {h:'ช่องโหว่ของ prompt ที่ทำให้ตก hidden test'},
 {table:[['ไม่ได้บอก','AI มักทำ','ผลที่ตามมา'],['ช่องว่างหน้า/หลัง','ไม่ trim หรือ trim ทุกที่','test ช่องว่างตก'],['ตัวพิมพ์ใหญ่เล็ก','เทียบแบบตรงตัว','"HRS" ไม่ผ่าน'],['ค่าว่าง/null/ชนิดผิด','throw exception','test กรณีขอบตก'],['ลำดับกฎ','ทำตามลำดับที่สะดวก','ผลทับกันผิด'],['สิ่งที่ต้องคงเดิม','normalize เกินจำเป็น','ข้อความเดิมถูกแก้'],['รูปแบบผิดที่ต้องปฏิเสธ','รับแบบหลวม ๆ','"12,34" ผ่านทั้งที่ควรผิด']]},
 {h:'กลยุทธ์ใช้ 3 รอบให้คุ้ม'},
 {ul:['รอบ 1: prompt ครบทุกกฎ + ตัวอย่างขอบ → ดูว่า test ไหนตก','รอบ 2: เพิ่มกฎ/ตัวอย่างเฉพาะกรณีที่ตก (อย่าเขียนใหม่ทั้งหมด)','รอบ 3: เก็บตก — ถ้ายังไม่ผ่าน เลือกส่งรอบที่ผ่านมากที่สุด']}
],
algo:[
 {h:'เจาะลึก: เลือกอัลกอริทึมจากขนาดข้อมูล'},
 {table:[['n สูงสุด','complexity ที่ยอมได้ (≈1 วินาที)','แนวทาง'],['≤ 20','O(2ⁿ), O(n!)','ลองทุกแบบ / backtracking'],['≤ 500','O(n³)','DP 3 มิติ, Floyd-Warshall'],['≤ 5,000','O(n²)','DP 2 มิติ, loop ซ้อน'],['≤ 200,000','O(n log n)','sort, heap, binary search, Dijkstra'],['≥ 1,000,000','O(n)','hash map, two pointers, sliding window, prefix sum']]},
 {h:'จำ pattern จาก "คำในโจทย์"'},
 {table:[['คำในโจทย์','Pattern'],['หาคู่/มีอยู่หรือไม่ ใน O(n)','Hash map/set'],['subarray/substring ต่อเนื่องที่ยาวสุด/สั้นสุด','Sliding window'],['ผลรวมช่วง, subarray sum = k','Prefix sum (+ hash map)'],['ค่าน้อยสุดที่ทำได้ / มากสุดที่ทำได้','Binary search on answer'],['k ตัวที่มาก/น้อยสุด, รวม k ชุด','Heap'],['จับคู่วงเล็บ, ค่าที่มากกว่าตัวถัดไป','Stack / monotonic stack'],['เส้นทางสั้นสุด น้ำหนักเท่ากัน','BFS'],['เส้นทางสั้นสุด น้ำหนักบวก','Dijkstra'],['กลุ่มที่เชื่อมกัน, วงจรในกราฟไม่มีทิศทาง','Union-Find'],['ลำดับงานที่มีเงื่อนไขก่อนหลัง','Topological sort'],['วิธีที่ดีที่สุด/จำนวนวิธี ที่ปัญหาย่อยซ้ำ','Dynamic programming']]},
 {h:'C# ที่ใช้บ่อยในโจทย์'},
 {code:`var seen = new HashSet<int>();                         // O(1) ตรวจซ้ำ
var count = new Dictionary<string, int>();            // นับความถี่: count[k] = count.GetValueOrDefault(k) + 1;
var pq = new PriorityQueue<int, int>();               // min-heap: pq.Enqueue(item, priority)
var q = new Queue<(int r, int c)>();                  // BFS
var st = new Stack<char>();                           // วงเล็บ / monotonic stack
Array.Sort(arr, (a, b) => a[1].CompareTo(b[1]));      // เรียง int[][] ตามคอลัมน์ที่ 2
int i = list.BinarySearch(x); if (i < 0) i = ~i;      // ตำแหน่งแรกที่ >= x
long sum = 0;                                         // ระวัง overflow ใช้ long กับผลรวมใหญ่`}
]
};
// แทรกเนื้อหาเจาะลึกไว้ก่อนส่วน "กับดักในข้อสอบ" (ถ้าไม่มี ให้ต่อท้าย)
LESSONS.forEach(l => {
  const extra = EXTRA[l.id]; if (!extra) return;
  const i = l.blocks.findIndex(b => b.traps);
  l.blocks.splice(i < 0 ? l.blocks.length : i, 0, ...extra);
});
