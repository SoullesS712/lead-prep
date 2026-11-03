/* ================= LESSONS (part 2: Web, Security, Ops, AI, SQL theory) ================= */
LESSONS.push(
/* ---------------- WEB (Advance) ---------------- */
{id:'fe', tab:'web', comp:'Web & Mobile — Frontend', w:3.52, target:'A', min:90, title:'Frontend ระดับ Advance — rendering, performance, PWA',
 blocks:[
 {p:'<b>Lead ต้องได้ระดับ Advance:</b> แอป web/mobile ซับซ้อนด้วย framework สมัยใหม่ (SPA, SSR), state management, UI/UX ขั้นสูง, optimize ด้วย profiling, code splitting, lazy loading, image compression, PWA (service worker, offline cache) และ frontend security'},
 {h:'Rendering strategies'},
 {table:[['','ทำงานอย่างไร','เหมาะกับ','ข้อเสีย'],['CSR (SPA)','ส่ง HTML ว่าง + JS แล้ว render บน browser','dashboard หลัง login, interactive สูง','FCP ช้า, SEO แย่'],['SSR','server render HTML ทุก request แล้ว hydrate','หน้าที่ข้อมูลเปลี่ยนบ่อยและต้อง SEO','โหลด server, TTFB'],['SSG','build HTML ล่วงหน้า วางบน CDN','blog, docs, landing','ข้อมูลเก่าจนกว่าจะ build ใหม่'],['ISR','SSG ที่ revalidate ตามรอบ','หน้าสินค้า ราคาเปลี่ยนวันละไม่กี่ครั้ง','ข้อมูลช้าได้ไม่เกินรอบ']]},
 {p:'แอปจริงมักผสม: หน้า marketing/สินค้า = SSG/ISR/SSR, หลัง login = CSR'},
 {h:'Core Web Vitals และวิธีแก้'},
 {table:[['Metric','วัดอะไร','ดี','วิธีแก้ที่พบบ่อย'],['LCP','เนื้อหาหลักแสดงเร็วแค่ไหน','≤ 2.5 s','SSR/SSG, CDN, preload รูป hero, บีบอัดรูป (WebP/AVIF)'],['INP','ตอบสนองการกดเร็วแค่ไหน','≤ 200 ms','ลด JS บน main thread, แบ่ง long task, code splitting'],['CLS','layout กระโดดไหม','≤ 0.1','กำหนด width/height ของรูป/โฆษณา, จองพื้นที่']]},
 {h:'Performance toolkit'},
 {ul:['<b>Code splitting</b> ตาม route: dynamic import() / React.lazy + Suspense','<b>Lazy loading รูป</b>: loading="lazy", responsive srcset/sizes, ขนาดเหมาะกับจอ','Tree-shaking, minify, bundle analyzer','HTTP caching: Cache-Control: public, max-age=31536000, immutable สำหรับไฟล์ที่มี hash ในชื่อ; ETag สำหรับข้อมูลที่เปลี่ยน','Debounce input ค้นหา, virtualize list ยาว ๆ','วัดด้วย Lighthouse, Chrome DevTools Performance, RUM (real user monitoring)']},
 {h:'State management'},
 {table:[['ประเภท state','ตัวอย่าง','เครื่องมือ'],['Local UI','เปิด/ปิด modal','useState'],['Global client','theme, user profile','Context, Redux Toolkit, Zustand'],['Server state','รายการสินค้าจาก API','React Query/TanStack Query, SWR (cache, refetch, dedupe)'],['URL state','filter, page','query string — share/bookmark ได้']]},
 {h:'PWA / Offline'},
 {ul:['ต้องมี HTTPS + manifest.json + service worker','Static assets (app shell): <b>cache-first</b>','API data: <b>network-first</b> fallback cache หรือ <b>stale-while-revalidate</b>','Background sync สำหรับส่งข้อมูลเมื่อกลับมาออนไลน์']},
 {h:'Mobile และ Architecture ขั้นสูง'},
 {ul:['Cross-platform: React Native, Flutter, .NET MAUI · Offline-first + local DB (SQLite)','เก็บ token บน mobile ใน Keychain/Keystore (secure storage) ไม่ใช่ AsyncStorage/SharedPreferences ธรรมดา','Micro-frontends / Module Federation: แยกทีม deploy ส่วนของหน้าเว็บอิสระ (ระดับ Expert)','Accessibility: semantic HTML, alt, label, keyboard navigation, contrast']},
 {traps:['CSR ล้วนสำหรับหน้า SEO = คำตอบผิด','รูป 4 MB โหลดพร้อมกันทั้งหน้า → แก้ด้วย resize + lazy + modern format','เก็บ token ใน localStorage = เสี่ยง XSS']}
 ],
 quiz:[
 {q:'หน้าแนะนำสินค้าต้องติด SEO และเร็วบนมือถือ ส่วน dashboard หลัง login โต้ตอบมาก ควรเลือก',o:['CSR ทั้งหมด','SSR/SSG/ISR สำหรับหน้าแนะนำสินค้า และ CSR สำหรับ dashboard','SSR ทั้งหมดรวม dashboard','ใช้ iframe'],a:1,e:'เลือก rendering ตามลักษณะหน้า'},
 {q:'CLS สูงเพราะรูปโหลดแล้วดันเนื้อหาลง แก้อย่างไร',o:['ลบรูป','กำหนด width/height หรือ aspect-ratio ให้รูป','เพิ่ม JS','ใช้ CSR'],a:1,e:'จองพื้นที่ไว้ก่อน'},
 {q:'Service worker สำหรับ API ที่ต้องการข้อมูลสดเมื่อออนไลน์แต่เปิดได้เมื่อออฟไลน์ ใช้กลยุทธ์ใด',o:['cache-only','network-first fallback cache','ไม่ cache เลย','cache-first ตลอดไป'],a:1,e:''},
 {q:'ข้อมูลจาก API ที่หลาย component ใช้ร่วมกันและต้อง refetch/cache ควรจัดการด้วย',o:['useState ในทุก component','Server-state library เช่น React Query','localStorage','global variable'],a:1,e:'จัดการ cache, dedupe, refetch, loading/error ให้'}
 ]},

{id:'api', tab:'web', comp:'Web & Mobile — Backend & API', w:3.52, target:'A', min:120, title:'Backend & API Design ระดับ Advance',
 blocks:[
 {p:'<b>Lead ต้องได้ระดับ Advance:</b> ออกแบบ REST และ GraphQL ที่มี schema validation, layered architecture (controller-service-repository), filtering/pagination, security (OAuth2, JWT, rate limiting, input sanitization) และจัดการ versioning, lifecycle, backward compatibility, deprecation'},
 {h:'HTTP methods และ status code'},
 {table:[['Method','ใช้','Idempotent','Safe'],['GET','อ่าน','✓','✓'],['POST','สร้าง / สั่งงาน','✗','✗'],['PUT','แทนทั้ง resource','✓','✗'],['PATCH','แก้บางส่วน','ไม่รับประกัน','✗'],['DELETE','ลบ','✓','✗']]},
 {table:[['Code','ใช้เมื่อ'],['200 OK / 201 Created + Location / 202 Accepted (งาน async) / 204 No Content',''],['400 ข้อมูลผิดรูปแบบ · 401 ไม่ได้ยืนยันตัวตน · 403 ยืนยันแล้วแต่ไม่มีสิทธิ์ · 404 ไม่พบ',''],['409 Conflict (ชนกัน/ซ้ำ) · 412 Precondition Failed (ETag ไม่ตรง) · 422 ผ่าน format แต่ผิดกฎธุรกิจ · 429 Too Many Requests',''],['500 server พัง · 502/503/504 ปลายทาง/ไม่พร้อม/timeout','']]},
 {h:'Error format มาตรฐาน — RFC 7807/9457 Problem Details'},
 {code:`// Program.cs
builder.Services.AddProblemDetails();
app.UseExceptionHandler();   // ไม่ส่ง stack trace ให้ client
// response
{ "type": "https://api.example.com/errors/insufficient-stock",
  "title": "Insufficient stock", "status": 422,
  "detail": "SKU A12 has 2 items left", "traceId": "00-4bf9..." }`},
 {h:'Pagination, filtering, sorting'},
 {ul:['Offset: ?page=3&size=20 — ง่าย แต่ช้าเมื่อหน้าลึก และข้อมูลซ้ำ/ข้ามเมื่อมีของใหม่','<b>Cursor/keyset</b>: ?after=eyJpZCI6MTIzfQ — WHERE (created_at, id) &lt; (@c, @id) ORDER BY created_at DESC, id DESC เร็วคงที่ เหมาะกับ feed','Filter/sort ผ่าน query string ที่ allowlist คอลัมน์ไว้ (กัน injection และ query หนัก)','จำกัด page size สูงสุด']},
 {h:'Versioning และ backward compatibility'},
 {ul:['<b>ไม่ breaking</b>: เพิ่ม endpoint, เพิ่ม field ใน response, เพิ่ม optional parameter','<b>Breaking</b>: ลบ/เปลี่ยนชื่อ field, เปลี่ยน type, เปลี่ยนความหมาย, เพิ่ม required field ใน request','เปลี่ยนแบบ breaking → ออกเวอร์ชันใหม่ (/v2 หรือ header) และประกาศ deprecate ด้วย header Deprecation + Sunset, มี migration guide','client ควร tolerant reader: ไม่พังเมื่อเจอ field ใหม่']},
 {h:'Reliability ของ API'},
 {ul:['<b>Idempotency-Key</b> header สำหรับ POST ที่สำคัญ (ชำระเงิน): server เก็บผลตาม key แล้วตอบผลเดิมเมื่อ client retry','งานนาน: ตอบ <b>202 Accepted</b> + Location ของ status resource ให้ poll หรือแจ้งผ่าน webhook','Webhook: ลงลายเซ็น HMAC + timestamp, ผู้รับตรวจลายเซ็นและกัน replay, retry ฝั่งผู้ส่ง','Optimistic concurrency ด้วย ETag + If-Match → 412','Rate limit ต่อ client → 429 + Retry-After']},
 {h:'Layered architecture ใน ASP.NET Core'},
 {code:`[ApiController, Route("api/v1/orders")]
public class OrdersController(IOrderService svc) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<OrderDto>> Create(CreateOrderRequest req)   // DTO + validation
    {
        var order = await svc.CreateAsync(req);                               // business rules ใน service
        return CreatedAtAction(nameof(Get), new { id = order.Id }, order);    // 201 + Location
    }
}
// Service → IOrderRepository → DbContext   (controller บาง, logic อยู่ service, data access อยู่ repository)`},
 {h:'GraphQL'},
 {ul:['client เลือก field เอง → แก้ over-fetching/under-fetching, endpoint เดียว, schema มี type ชัดเจน','<b>N+1 problem</b>: resolver ดึง author ทีละ post → ใช้ <b>DataLoader</b> batch เป็น query เดียว','ต้องจำกัด query depth/complexity กัน query หนักเกินไป, caching ทำยากกว่า REST (ใช้ persisted queries)','.NET: Hot Chocolate']},
 {h:'API security checklist'},
 {ul:['Authentication: OAuth2/OIDC (Authorization Code + PKCE สำหรับ user, Client Credentials สำหรับ service)','ตรวจ JWT ครบ: signature, algorithm ที่อนุญาต, issuer, audience, expiry','Authorization ระดับ object (BOLA) และระดับ function (admin endpoint)','Request DTO แบบ allowlist กัน mass assignment, response DTO กันข้อมูลเกิน','Input validation (FluentValidation/DataAnnotations), จำกัดขนาด body, timeout','CORS เจาะจง origin, HTTPS เท่านั้น, API Gateway + WAF','เอกสาร: OpenAPI/Swagger, contract-first design']},
 {traps:['PUT ไม่ idempotent ❌ (PUT เป็น idempotent, POST ไม่ใช่)','401 กับ 403 สลับกัน','เปลี่ยนชื่อ field ใน v1 ทันที = breaking change','ส่ง stack trace ใน error response']}
 ],
 quiz:[
 {q:'client ส่ง POST ชำระเงินแล้ว timeout จึงส่งซ้ำ จะกันการตัดเงินซ้ำอย่างไร',o:['ห้าม client retry','Idempotency-Key: server จำผลตาม key และตอบผลเดิม','เปลี่ยนเป็น GET','เพิ่ม timeout'],a:1,e:''},
 {q:'ผู้ใช้ login แล้วแต่ไม่มีสิทธิ์เข้าถึง resource ควรตอบ',o:['401','403','404 เสมอ','500'],a:1,e:'401 = ยังไม่ยืนยันตัวตน (บางระบบตอบ 404 เพื่อซ่อนการมีอยู่ของ resource ได้)'},
 {q:'การเปลี่ยนแปลงใด "ไม่" เป็น breaking change',o:['ลบ field','เปลี่ยน type ของ field','เพิ่ม field ใหม่ใน response','เพิ่ม required field ใน request'],a:2,e:''},
 {q:'รายงานที่ใช้เวลาสร้าง 3 นาที API ควรตอบอย่างไร',o:['ให้ client รอ 3 นาที','202 Accepted + URL สำหรับดูสถานะ (หรือ webhook เมื่อเสร็จ)','500','204'],a:1,e:'asynchronous request-reply pattern'}
 ]},

/* ---------------- SECURITY ---------------- */
{id:'sec', tab:'sec', comp:'Application Security', w:5.69, target:'I', min:120, title:'Application Security — OWASP, AuthN/AuthZ, Secure coding',
 blocks:[
 {p:'<b>Lead ต้องทำได้:</b> security ครบทุก component (encryption, JWT auth, audit logging), RBAC + MFA (OAuth2, SAML), security testing/vulnerability assessment, ป้องกัน API ด้วย validation, rate limiting, token auth (API Gateway + WAF) และดูแล monitoring/incident response'},
 {h:'OWASP Top 10 (2021) แบบจำง่าย'},
 {table:[['#','หมวด','ตัวอย่าง / วิธีกัน'],['A01','Broken Access Control','IDOR/BOLA, เข้าหน้า admin ได้ → ตรวจสิทธิ์ฝั่ง server ทุกครั้ง, deny by default'],['A02','Cryptographic Failures','HTTP ไม่เข้ารหัส, MD5 รหัสผ่าน → TLS, bcrypt/Argon2/PBKDF2, encrypt at rest'],['A03','Injection (รวม XSS)','SQLi, command injection → parameterized query, output encoding'],['A04','Insecure Design','ไม่มี rate limit/threat model → threat modeling, secure design pattern'],['A05','Security Misconfiguration','debug เปิดบน prod, default password → hardening, security headers'],['A06','Vulnerable Components','library มี CVE → SCA (Dependabot, dotnet list package --vulnerable), อัปเดตสม่ำเสมอ'],['A07','Identification & Auth Failures','brute force, session ไม่หมดอายุ → MFA, lockout, rate limit'],['A08','Software & Data Integrity','package/CI ถูกปลอม, deserialization ไม่ปลอดภัย → ลงลายเซ็น, ตรวจ integrity'],['A09','Logging & Monitoring Failures','ไม่มี log การ login ล้มเหลว → log security event + alert'],['A10','SSRF','server ไปดึง URL ที่ผู้ใช้ส่ง เช่น 169.254.169.254 → allowlist ปลายทาง, บล็อก IP ภายใน']]},
 {h:'OWASP API Security Top 10 ที่ออกบ่อย'},
 {ul:['<b>API1 BOLA</b>: เปลี่ยน id แล้วเห็นของคนอื่น → WHERE Id=@id AND OwnerId=@currentUser','<b>API2 Broken Authentication</b>: ตรวจ JWT ไม่ครบ, alg:none','<b>API3 BOPLA</b>: mass assignment (ส่ง "role":"Admin") / ส่งข้อมูลเกิน → DTO allowlist','<b>API4 Unrestricted Resource Consumption</b>: ไม่มี rate limit/page size limit','<b>API5 BFLA</b>: ผู้ใช้ทั่วไปเรียก endpoint ของ admin ได้','<b>API7 SSRF</b>']},
 {h:'XSS & CSRF'},
 {table:[['','XSS','CSRF'],['คืออะไร','script ของผู้โจมตีรันใน browser ของเหยื่อ','หลอกให้ browser เหยื่อส่ง request พร้อม cookie'],['ประเภท','Stored, Reflected, DOM-based',''],['ป้องกัน','output encoding (Razor/React ทำให้), sanitize HTML (HtmlSanitizer/DOMPurify), CSP, cookie HttpOnly','anti-forgery token, SameSite cookie, ไม่ใช้ GET เปลี่ยนข้อมูล'],['ระวัง','Html.Raw, dangerouslySetInnerHTML, innerHTML','API ที่ใช้ cookie auth']]},
 {h:'Authentication & Authorization'},
 {table:[['Flow','ใช้กับ'],['Authorization Code + PKCE','web/SPA/mobile ที่มีผู้ใช้'],['Client Credentials','service-to-service ไม่มีผู้ใช้'],['Device Code','TV/CLI'],['❌ Implicit, ❌ Password grant','เลิกใช้ (OAuth 2.1)']]},
 {ul:['OAuth2 = authorization (delegated access) · OIDC = authentication ต่อยอด (id_token) · SAML = SSO แบบ XML ในองค์กร','RBAC (ตาม role) vs ABAC/policy-based (ตาม attribute เช่น สาขา, เจ้าของ) — ASP.NET Core: [Authorize(Policy="...")] + IAuthorizationHandler','MFA ลดความเสี่ยงจากรหัสผ่านรั่ว/credential stuffing']},
 {code:`builder.Services.AddAuthentication().AddJwtBearer(o => {
    o.Authority = "https://login.example.com";
    o.Audience  = "orders-api";
    o.TokenValidationParameters = new() {
        ValidateIssuer = true, ValidateAudience = true, ValidateLifetime = true,
        ValidateIssuerSigningKey = true, ValidAlgorithms = new[] { "RS256" },
        ClockSkew = TimeSpan.FromMinutes(1)
    };
});`},
 {h:'Secure SDLC & Data privacy'},
 {ul:['SAST (SonarQube) ตรวจโค้ด · DAST (OWASP ZAP) ทดสอบแอปที่รันอยู่ · SCA ตรวจ library · secret scanning','Secret เก็บใน Key Vault/Secrets Manager + Managed Identity ไม่ใช่ appsettings ใน Git','Security headers: HSTS, CSP, X-Content-Type-Options: nosniff, frame-ancestors','PDPA: ขอ consent, เก็บเท่าที่จำเป็น (minimization), mask/anonymize PII ใน log, encrypt in transit (TLS) และ at rest, สิทธิ์ลบ/ขอดูข้อมูล','Audit log: ใคร ทำอะไร เมื่อไร กับข้อมูลใด (ห้ามแก้ไขย้อนหลัง)']},
 {traps:['validation ฝั่ง client ไม่ใช่ security control','Base64 ไม่ใช่การเข้ารหัส — JWT payload อ่านได้ทุกคน','HTTPS ไม่กัน SQL injection/XSS','GUID แทนเลข id ไม่ได้แก้ BOLA (แค่เดายากขึ้น)']}
 ],
 quiz:[
 {q:'ผู้ใช้กรอก URL รูปภาพ แล้ว server ไปดาวน์โหลด ผู้โจมตีใส่ http://169.254.169.254/... ช่องโหว่นี้คือ',o:['XSS','SSRF','CSRF','BOLA'],a:1,e:'กันด้วย allowlist โดเมน, บล็อก IP ภายใน/link-local, ไม่ follow redirect โดยไม่ตรวจ'},
 {q:'flow OAuth2 ที่เหมาะกับ SPA ที่มีผู้ใช้ login',o:['Implicit','Authorization Code + PKCE','Password grant','Client Credentials'],a:1,e:''},
 {q:'ผลสแกนพบ library มี CVE critical ควรทำอย่างไรเป็นระบบ',o:['ไม่ต้องทำ','อัปเดต/patch และเพิ่ม SCA ใน pipeline ให้ fail เมื่อพบช่องโหว่ร้ายแรง','ซ่อนผลสแกน','ลบ test'],a:1,e:'A06 Vulnerable and Outdated Components'},
 {q:'CSP (Content-Security-Policy) ช่วยป้องกันอะไรเป็นหลัก',o:['SQL injection','ลด impact ของ XSS โดยจำกัดแหล่ง script ที่รันได้','DDoS','CSRF ทั้งหมด'],a:1,e:''}
 ]},

/* ---------------- OPS ---------------- */
{id:'cont', tab:'ops', comp:'Container', w:2.98, target:'I', min:45, title:'Container (Docker) สำหรับ .NET',
 blocks:[
 {p:'<b>Lead ต้องทำได้:</b> networking และ storage ขั้นสูง, นำ migration สู่ container, ใช้ security policy กับ image'},
 {code:`# Multi-stage build (.NET 8)
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY *.csproj .
RUN dotnet restore                      # แยก layer: restore จะ cache ถ้า csproj ไม่เปลี่ยน
COPY . .
RUN dotnet publish -c Release -o /app --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final   # runtime image เล็กกว่า SDK มาก
WORKDIR /app
COPY --from=build /app .
USER app                                # ไม่รันด้วย root (.NET 8 image มี user app)
EXPOSE 8080
HEALTHCHECK CMD curl -f http://localhost:8080/health || exit 1
ENTRYPOINT ["dotnet", "Shop.Api.dll"]`},
 {ul:['Image = แม่แบบ read-only หลาย layer · Container = instance ที่รันอยู่ + writable layer (หายเมื่อลบ)','<b>Container vs VM</b>: container แชร์ kernel ของ host เบาและเริ่มเร็ว, VM มี OS เต็ม แยกขาดกว่า','.dockerignore (bin/, obj/, .git, .env) · pin tag (aspnet:8.0 หรือ digest) ไม่ใช้ latest','<b>Storage</b>: ข้อมูลถาวรใช้ volume หรือ object storage (Blob/S3) — ไม่เก็บไฟล์ผู้ใช้ใน container','<b>Config/secret</b> ส่งตอน runtime (env, secret store) — image เดียวใช้ทุก environment','<b>Security</b>: non-root, image เล็ก (chiseled/alpine), สแกนด้วย Trivy ใน pipeline, read-only filesystem, จำกัด resource (CPU/memory)','<b>Networking</b>: docker compose สร้าง network ให้ service เรียกกันด้วยชื่อ service (http://db:5432)']},
 {h:'Kubernetes คำที่ควรรู้ (ระดับรู้จัก)'},
 {table:[['คำ','ความหมาย'],['Pod','หน่วยเล็กสุดที่รัน container'],['Deployment','จำนวน replica + rolling update'],['Service','ที่อยู่คงที่ + load balance ไปยัง pod'],['Ingress','HTTP routing จากภายนอก'],['ConfigMap / Secret','config และ secret'],['Liveness / Readiness probe','restart เมื่อค้าง / ถอดจาก traffic เมื่อไม่พร้อม'],['HPA','autoscale ตาม CPU/metric']]},
 {traps:['ENV ApiKey=... ใน Dockerfile = secret ฝังใน image ถาวร','build image แยกต่อ environment เพราะ config ต่างกัน = ผิดหลัก']}
 ],
 quiz:[
 {q:'image .NET ขนาด 1.4 GB เพราะใช้ SDK image ตอนรัน แก้อย่างไร',o:['บีบอัด zip','Multi-stage build: build ด้วย sdk แล้ว copy ไป aspnet runtime image','ลบ Dockerfile','เพิ่ม RAM'],a:1,e:''},
 {q:'ทีม build image แยก Dev/UAT/Prod เพราะ connection string ต่างกัน ควรปรับเป็น',o:['ทำต่อไป','image เดียว ส่ง config/secret ตอน runtime ต่อ environment','ใส่ทุก connection string ใน image','ให้ dev แก้ไฟล์ใน container'],a:1,e:'build once, deploy many'},
 {q:'ข้อใดไม่ใช่ best practice',o:['USER app','สแกนด้วย Trivy','ใช้ tag latest ใน production','.dockerignore'],a:2,e:'latest ทำให้ build ไม่ซ้ำเดิม'}
 ]},

{id:'cicd', tab:'ops', comp:'CI/CD', w:1.63, target:'I', min:45, title:'CI/CD (Azure DevOps pipelines)',
 blocks:[
 {p:'<b>Lead ต้องทำได้:</b> ออกแบบ workflow หลาย environment ด้วย Azure DevOps พร้อม config แยก env, ใส่ SonarQube และ ZAP ใน pipeline, build/test อัตโนมัติ, deploy ซ้ำได้คงที่'},
 {code:`# azure-pipelines.yml (ย่อ)
trigger: [ main ]
stages:
- stage: Build
  jobs:
  - job: build
    steps:
    - task: DotNetCoreCLI@2
      inputs: { command: test, projects: '**/*Tests.csproj', arguments: '--collect "XPlat Code Coverage"' }
    - task: SonarQubeAnalyze@5          # quality gate: coverage, bugs, vulnerabilities
    - script: dotnet publish -c Release -o $(Build.ArtifactStagingDirectory)
    - publish: $(Build.ArtifactStagingDirectory)
      artifact: drop                     # build ครั้งเดียว
- stage: DeployUAT
  dependsOn: Build
  jobs:
  - deployment: uat
    environment: uat                     # config/secret จาก variable group + Key Vault
    strategy: { runOnce: { deploy: { steps: [ { script: echo deploy drop to UAT } ] } } }
- stage: DeployProd
  dependsOn: DeployUAT
  jobs:
  - deployment: prod
    environment: production              # approval + check ตั้งที่ environment
    strategy: { runOnce: { deploy: { steps: [ { script: echo swap slot } ] } } }`},
 {ul:['<b>CI</b>: merge บ่อย + build + test อัตโนมัติทุก push/PR · <b>Continuous Delivery</b>: พร้อม deploy ได้เสมอ (กดอนุมัติ) · <b>Continuous Deployment</b>: deploy อัตโนมัติ','<b>Build once, promote the same artifact</b> ไป Dev → UAT → Prod','Quality gates: unit test, coverage, SonarQube, SCA, Trivy, ZAP (DAST บน env ทดสอบ)','<b>Pin dependency</b> (lock file: packages.lock.json / package-lock.json) — build ไม่พังเองเพราะ library ออกเวอร์ชันใหม่','DB migration เป็นขั้นหนึ่งใน pipeline (idempotent script / migration bundle)','Strategies: rolling, <b>blue-green</b> (swap slot, rollback ทันที), <b>canary</b> (ปล่อยบางส่วนแล้วดู metric), feature flag','GitOps (Argo CD/Flux): สถานะที่ต้องการอยู่ใน Git แล้ว sync อัตโนมัติ (ระดับ Expert)']},
 {traps:['build ใหม่ทุก environment = สิ่งที่ทดสอบไม่ใช่สิ่งที่ขึ้น prod','deploy prod ก่อนแล้วค่อยทดสอบ']}
 ],
 quiz:[
 {q:'pipeline พังทั้งที่ไม่ได้แก้โค้ด เพราะ library ออกเวอร์ชันใหม่ (ใช้ version range) แก้อย่างไร',o:['ลบ test','pin เวอร์ชันด้วย lock file และอัปเดตแบบตั้งใจผ่าน PR (Dependabot)','build เฉพาะวันศุกร์','ใช้ latest ทุกอย่าง'],a:1,e:''},
 {q:'กลยุทธ์ deploy ที่ rollback ได้ภายในไม่กี่วินาที',o:['ทับไฟล์บน server','Blue-green / slot swap','ลบเวอร์ชันเก่าก่อน','deploy ตอนตีสอง'],a:1,e:''},
 {q:'ลำดับ pipeline ที่เหมาะสม',o:['Deploy → Build → Test','Build → Test/Scan → Publish artifact → Deploy UAT → Approval → Deploy Prod','Test → Deploy Prod → Build','Scan หลัง deploy prod เท่านั้น'],a:1,e:''}
 ]},

{id:'cloud', tab:'ops', comp:'Cloud', w:2.98, target:'I', min:45, title:'Cloud — services, pricing, security',
 blocks:[
 {p:'<b>Lead ต้องทำได้:</b> อธิบายการทำงานร่วมกันของ cloud service ใน architecture diagram, แยก managed service และ pricing model, ใช้ IAM/encryption และหลัก SLA'},
 {table:[['ประเภท','ลูกค้าดูแล','ตัวอย่าง'],['IaaS','OS, runtime, app, data','Azure VM, EC2'],['PaaS','app, data, config','App Service, Azure SQL, Elastic Beanstalk'],['FaaS / Serverless','function code','Azure Functions, Lambda'],['SaaS','ข้อมูลและสิทธิ์','Microsoft 365, Salesforce']]},
 {table:[['งาน','Azure','AWS','GCP'],['รันเว็บ (PaaS)','App Service','Elastic Beanstalk / App Runner','App Engine / Cloud Run'],['Container','AKS, Container Apps','EKS, ECS/Fargate','GKE, Cloud Run'],['Function','Functions','Lambda','Cloud Functions'],['Object storage','Blob Storage','S3','Cloud Storage'],['SQL managed','Azure SQL','RDS / Aurora','Cloud SQL'],['Queue / Event','Service Bus / Event Grid','SQS/SNS / EventBridge','Pub/Sub'],['Secret','Key Vault','Secrets Manager','Secret Manager'],['Identity สำหรับแอป','Managed Identity','IAM Role','Service Account'],['Monitoring','Azure Monitor / App Insights','CloudWatch / X-Ray','Cloud Monitoring']]},
 {ul:['<b>Region</b> = พื้นที่ทางภูมิศาสตร์ · <b>Availability Zone</b> = data center แยกไฟ/network ภายใน region — กระจายข้าม AZ กันศูนย์เดียวล่ม, ข้าม region สำหรับ DR','<b>Pricing</b>: pay-as-you-go, reserved/savings plan (ผูก 1–3 ปีถูกลง), spot (ถูกมากแต่ถูกเรียกคืนได้), serverless (จ่ายตามการรัน)','<b>Autoscaling</b> ตาม load (scale out ช่วง peak, scale in กลางคืน) + schedule','<b>Security</b>: least privilege, Managed Identity แทน access key, private endpoint, encryption at rest/in transit, Key Vault','<b>Composite SLA</b>: พึ่งกันแบบอนุกรมคูณกัน (App 99.95% × SQL 99.99% ≈ 99.94%)','Cloud-native: microservices, serverless, event-driven, managed services, IaC (Bicep/Terraform)']},
 {traps:['ฝัง access key ใน appsettings','เปิด storage เป็น public เพื่อให้ "ใช้ง่าย"','IaaS ไม่ได้แปลว่า provider patch OS ให้']}
 ],
 quiz:[
 {q:'server 20 เครื่องเปิดตลอด แต่ใช้หนักแค่ 8–10 โมง ควรทำอย่างไร',o:['เพิ่มเป็น 40 เครื่อง','Autoscaling ตาม load/schedule','ปิดระบบกลางคืน','ใช้ VM ใหญ่ขึ้น'],a:1,e:''},
 {q:'แอปบน Azure ต้องอ่าน Key Vault/Blob วิธีที่ปลอดภัยที่สุด',o:['ใส่ key ใน appsettings.json','Managed Identity + role แบบ least privilege','ใช้ account owner','เปิด public'],a:1,e:''},
 {q:'Availability Zone ต่างจาก Region อย่างไร',o:['เหมือนกัน','AZ คือ data center แยกกันภายใน region เดียว','Region อยู่ใน AZ','AZ คือประเทศ'],a:1,e:''}
 ]},

/* ---------------- AI ---------------- */
{id:'ai', tab:'ai', comp:'AI & Prompt Engineer', w:1.63, target:'I', min:60, title:'AI, LLM และ ML พื้นฐานสำหรับ Developer',
 blocks:[
 {p:'<b>Lead ต้องทำได้:</b> สร้างแอปที่ใช้ AI service (object detection, NLP), นำฟีเจอร์ AI ขึ้น production พร้อม monitoring และ retraining, ใช้ prompt ขั้นสูง (structured input/output, few-shot)'},
 {h:'LLM พื้นฐาน'},
 {ul:['<b>Token</b>: หน่วยย่อยของข้อความ ใช้คิดเงินและนับ context window (ภาษาไทยใช้ token มากกว่า)','<b>Context window</b>: จำนวน token สูงสุดของ input + output ต่อครั้ง','<b>Temperature</b>: ต่ำ = คงที่/ตรงไปตรงมา (extraction, classification) · สูง = หลากหลาย (creative)','<b>Hallucination</b>: แต่งข้อมูลที่ไม่มีจริง → ใช้ RAG, ให้อ้างอิง, ให้ตอบว่าไม่ทราบ']},
 {h:'Prompting techniques'},
 {table:[['เทคนิค','ใช้เมื่อ'],['บทบาท + เป้าหมายชัดเจน','ทุกงาน'],['Delimiter (""" / XML tag)','แยกคำสั่งออกจากข้อมูล (กัน prompt injection)'],['Structured output (JSON schema)','ต้องให้โปรแกรม parse ผล'],['Few-shot (ยกตัวอย่าง input→output)','อยากได้รูปแบบ/สไตล์เฉพาะ'],['ให้คิดเป็นขั้นตอน','งานตรรกะ/คำนวณหลายขั้น'],['Constraints + edge case + negative example','งานที่ต้องแม่นยำ เช่น ให้เขียนโค้ด']]},
 {h:'สถาปัตยกรรมแอป AI'},
 {ul:['<b>RAG</b>: แบ่งเอกสารเป็น chunk → ทำ <b>embedding</b> → เก็บใน vector index → ค้น chunk ที่ใกล้คำถาม → ใส่ใน prompt ให้ตอบจาก context','<b>Embedding</b>: เวกเตอร์แทนความหมาย ใช้ semantic search, จัดกลุ่ม, แนะนำ','<b>Fine-tune</b>: ปรับรูปแบบ/สไตล์ ไม่เหมาะกับข้อมูลที่เปลี่ยนบ่อย','<b>Tool/function calling</b>: ให้โมเดลเรียก API ของเรา — จำกัดสิทธิ์ (least privilege), ยืนยันก่อนทำ action สำคัญ','<b>Prompt injection</b> (OWASP LLM01): ข้อมูลจากผู้ใช้/เอกสารถูกตีความเป็นคำสั่ง → แยก instruction กับ data, ไม่ใส่ secret ใน prompt, ตรวจ output','Evaluation: ชุดทดสอบ + metric (ความถูกต้อง, groundedness), log prompt/response, ติดตามค่าใช้จ่าย']},
 {h:'ML พื้นฐาน (จาก AI Literacy quiz)'},
 {table:[['คำ','ความหมาย'],['Supervised','มี label: Classification (หมวด), Regression (ตัวเลข เช่น demand forecasting)'],['Unsupervised','ไม่มี label: Clustering (จัดกลุ่มลูกค้า)'],['Regression metric','MAE, RMSE, R²'],['Classification metric','Accuracy, Precision, Recall, F1'],['Data leakage','ข้อมูล test ปนเข้า training (เช่น preprocess ก่อนแบ่งข้อมูล)'],['Data/Concept drift','ข้อมูลจริงเปลี่ยนจนโมเดลแย่ลง → monitor + retrain'],['Bias จากข้อมูล','training data ไม่ครอบคลุม (แมวขาวอย่างเดียว)'],['Supply chain risk','โหลด pre-trained model/pickle จากแหล่งไม่น่าเชื่อถือ → รันโค้ดอันตรายได้']]},
 {h:'ใช้ AI coding assistant อย่างมืออาชีพ'},
 {ul:['ผู้ commit รับผิดชอบโค้ด: อ่านเข้าใจทุกบรรทัด, เขียน/รัน test, ตรวจ security และ license','ระวัง package ที่ AI แต่งชื่อขึ้น (slopsquatting) และ API ที่ deprecated','ไม่ส่ง secret/ข้อมูลลูกค้าเข้าเครื่องมือที่องค์กรไม่อนุญาต']}
 ],
 quiz:[
 {q:'ต้องการผลลัพธ์ extraction ที่คงที่ที่สุดเมื่อส่งเอกสารเดิมซ้ำ ควรตั้ง temperature',o:['สูงสุด','ต่ำ (ใกล้ 0) + structured output','สุ่ม','ไม่มีผล'],a:1,e:''},
 {q:'Demand forecasting เป็นงานประเภทใด',o:['Classification','Regression','Clustering','Reinforcement'],a:1,e:'ทำนายตัวเลขต่อเนื่อง'},
 {q:'chatbot ตอบนโยบายบริษัทแบบแต่งขึ้นเอง แก้ด้วย',o:['เพิ่ม temperature','RAG + ให้ตอบจาก context และบอกว่าไม่ทราบเมื่อไม่พบ','fine-tune ทุกวัน','prompt ยาวขึ้น'],a:1,e:''},
 {q:'Metric ใดเหมาะกับงาน Regression',o:['Precision','Recall','MAE','Accuracy'],a:2,e:''}
 ]},

/* ---------------- SQL theory (shown in SQL lab) ---------------- */
{id:'sqlt', tab:'sql', comp:'SQL', w:5.69, target:'I', min:60, title:'SQL ที่ต้องเขียนคล่องระดับ Lead',
 blocks:[
 {p:'<b>Lead ต้องทำได้:</b> query ซับซ้อนด้วย subquery, CTE, JOIN หลายตาราง, ใช้ index/filter/query plan ให้เร็ว, กำหนด constraint ให้ข้อมูลถูกต้อง'},
 {h:'ลำดับการทำงานเชิงตรรกะ (จำให้ขึ้นใจ)'},
 {p:'<b>FROM / JOIN → WHERE → GROUP BY → HAVING → SELECT (window function คำนวณที่นี่) → DISTINCT → ORDER BY → LIMIT/OFFSET</b> — ดังนั้น WHERE ใช้ aggregate ไม่ได้ และ WHERE ใช้ alias ใน SELECT ไม่ได้ (ORDER BY ใช้ได้)'},
 {h:'Pattern ที่ใช้บ่อย'},
 {code:`-- 1) Anti-join: ลูกค้าที่ไม่เคยสั่ง
SELECT c.* FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.id IS NULL;                      -- หรือ WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id)

-- 2) Top-N per group: สินค้าขายดีอันดับ 1 ของแต่ละหมวด
WITH s AS (
  SELECT p.category, p.name, SUM(i.qty * i.unit_price) AS revenue,
         ROW_NUMBER() OVER (PARTITION BY p.category ORDER BY SUM(i.qty * i.unit_price) DESC) AS rn
  FROM order_items i JOIN products p ON p.id = i.product_id
  GROUP BY p.category, p.name)
SELECT category, name, revenue FROM s WHERE rn = 1;

-- 3) Running total และเทียบเดือนก่อน
SELECT month, revenue,
       SUM(revenue) OVER (ORDER BY month) AS running_total,
       revenue - LAG(revenue) OVER (ORDER BY month) AS diff_prev
FROM monthly;

-- 4) Recursive CTE: ลำดับชั้นพนักงาน
WITH RECURSIVE tree AS (
  SELECT id, name, 0 AS lvl FROM employees WHERE manager_id IS NULL
  UNION ALL
  SELECT e.id, e.name, t.lvl + 1 FROM employees e JOIN tree t ON e.manager_id = t.id)
SELECT * FROM tree;            -- SQL Server ไม่ต้องใส่คำว่า RECURSIVE

-- 5) ช่วงวันที่แบบ sargable (ใช้ index ได้ ไม่ตกรายการเวลา 23:59)
WHERE order_date >= '2026-01-01' AND order_date < '2026-04-01'`},
 {h:'NULL และ aggregate'},
 {ul:['COUNT(*) นับทุกแถว · COUNT(col) ไม่นับ NULL · COUNT(DISTINCT col) นับค่าไม่ซ้ำ','SUM/AVG ข้าม NULL · ใช้ COALESCE(col, 0) เมื่อต้องการให้เป็น 0','col = NULL ได้ UNKNOWN เสมอ ต้องใช้ IS NULL','NOT IN (subquery ที่มี NULL) ได้ผลว่างเปล่า — ใช้ NOT EXISTS ปลอดภัยกว่า']},
 {h:'Window functions'},
 {table:[['ฟังก์ชัน','ผลเมื่อค่าเท่ากัน (100, 90, 90, 80)'],['ROW_NUMBER()','1, 2, 3, 4'],['RANK()','1, 2, 2, 4'],['DENSE_RANK()','1, 2, 2, 3']]},
 {h:'Performance และ integrity'},
 {ul:['เลือกเฉพาะคอลัมน์ที่ใช้ (ไม่ SELECT *), filter ให้เร็วที่สุด, index คอลัมน์ที่ JOIN/WHERE','ดู execution plan หา scan ที่ไม่ควรมี, key lookup เยอะ, ค่าประมาณแถวผิดมาก (statistics เก่า)','Constraint: PRIMARY KEY, FOREIGN KEY, UNIQUE, CHECK (amount &gt;= 0), NOT NULL, DEFAULT','Transaction สั้น เข้าถึงแถวลำดับเดียวกัน → ลด deadlock และ retry เมื่อเกิด (SQL Server error 1205)','Stored procedure/trigger: ใช้ได้กับ logic ใกล้ข้อมูล แต่ทดสอบ/version ยากกว่า — ระวัง trigger ซ่อน logic']},
 {traps:['ใช้ COUNT(*) แทน COUNT(DISTINCT order_id) หลัง JOIN order_items → นับเกิน','BETWEEN \'2026-03-01\' AND \'2026-03-31\' กับคอลัมน์ที่มีเวลา ตกรายการวันสุดท้าย','LIMIT เป็นของ PostgreSQL/MySQL/SQLite — SQL Server ใช้ TOP / OFFSET FETCH']}
 ],
 quiz:[
 {q:'หลัง JOIN orders กับ order_items ต้องการนับจำนวนคำสั่งซื้อ ควรใช้',o:['COUNT(*)','COUNT(DISTINCT o.id)','SUM(o.id)','MAX(o.id)'],a:1,e:'หนึ่ง order มีหลาย item → COUNT(*) นับเกิน'},
 {q:'คะแนน 100, 90, 90, 80 ใช้ DENSE_RANK ได้ลำดับใด',o:['1,2,3,4','1,2,2,4','1,2,2,3','1,1,2,3'],a:2,e:''},
 {q:'WHERE customer_id NOT IN (SELECT customer_id FROM orders) ได้ผลว่างเปล่า ทั้งที่มีลูกค้าไม่เคยสั่ง สาเหตุที่เป็นไปได้',o:['ไม่มี index','subquery มีค่า NULL','ต้องใช้ HAVING','ต้องใช้ DISTINCT'],a:1,e:'x NOT IN (..., NULL) = UNKNOWN เสมอ ใช้ NOT EXISTS'}
 ]},

/* ---------------- Prompt coding theory (shown in Prompt lab) ---------------- */
{id:'pc', tab:'prompt', comp:'Prompt Coding', w:6.78, target:'I', min:45, title:'Prompt Coding — เขียน spec ให้ AI สร้างโค้ดถูกตั้งแต่ครั้งแรก',
 blocks:[
 {p:'ข้อสอบ Prompt Coding ให้คุณเขียน prompt เป็น <b>ภาษาคน (ห้ามเขียนโค้ด/regex)</b> แล้ว AI สร้างฟังก์ชันจาก prompt นั้น คะแนน = จำนวน test case ที่ผ่าน AI <b>ไม่เห็นโจทย์และ test case</b> จึงต้องอธิบายให้ครบเอง โดยปกติมีโอกาสลองประมาณ 3 ครั้ง'},
 {h:'โครงสร้าง prompt ที่ได้ผล'},
 {ol:['<b>เป้าหมาย 1 ประโยค</b> + ชื่อฟังก์ชัน, input, output type','<b>นิยามแต่ละกฎเป็นข้อ ๆ</b> ระบุรูปแบบให้ชัด (ตัวเลขกี่หลัก, ตัวคั่นอะไร, ตัวพิมพ์ใหญ่เล็ก)','<b>ลำดับการประมวลผล</b> เมื่อกฎทับกัน','<b>ขอบเขต (boundary)</b>: อะไรติดอยู่ข้างหน้า/หลังได้หรือไม่ได้, ยาวกว่า/สั้นกว่าทำอย่างไร','<b>สิ่งที่ต้องคงเดิม</b>: "ข้อความส่วนอื่นห้ามเปลี่ยนแม้แต่ตัวเดียว"','<b>ตัวอย่าง input → output</b> 3–6 ตัวอย่าง รวม <b>negative examples</b> (กรณีที่ต้องไม่เปลี่ยน/ต้องคืน error)','กรณีพิเศษ: ข้อมูลว่าง, ค่าไม่ถูกต้อง, ทศนิยม, ช่องว่างเกิน']},
 {h:'ตัวอย่างเทียบ'},
 {code:`❌ prompt อ่อน:
"เขียนฟังก์ชันปิดบังเบอร์โทรในข้อความ"

✅ prompt ที่ดี:
"เขียนฟังก์ชัน maskPhone(text) รับข้อความ คืนข้อความที่ปิดบังเบอร์มือถือไทย
กติกา:
1. เบอร์มือถือ = ตัวเลข 10 หลัก ขึ้นต้นด้วย 06, 08 หรือ 09
   อาจมีขีดหนึ่งตัวหลังหลักที่ 3 และ/หรือหลังหลักที่ 6 (เช่น 081-234-5678, 081-2345678)
2. ต้องไม่มีตัวเลขติดอยู่ด้านหน้าหรือด้านหลังของเบอร์ (ตัวอักษรอื่นติดได้)
3. แทนทั้งเบอร์ด้วย xxx-xxx- ตามด้วย 4 หลักสุดท้าย
4. เบอร์บ้าน (ขึ้นต้น 02) และตัวเลขที่ยาวกว่า 10 หลักให้คงเดิม
5. ข้อความส่วนอื่นห้ามเปลี่ยน
ตัวอย่าง:
- 'โทร 0812345678' → 'โทร xxx-xxx-5678'
- 'โทร 081-234-5678.' → 'โทร xxx-xxx-5678.'
- 'บ้าน 021234567' → คงเดิม
- 'ref 08123456789' (11 หลัก) → คงเดิม"`},
 {h:'Checklist ก่อนกดส่ง'},
 {ul:['ทุกกฎในโจทย์ถูกพูดถึงครบหรือยัง (ไล่ทีละบรรทัดของโจทย์)','ลำดับการทำเมื่อกฎชนกัน','ตัวพิมพ์ใหญ่/เล็ก, ช่องว่าง, เครื่องหมายวรรคตอนที่ติดท้าย','ตัวอย่างที่ "ต้องไม่เปลี่ยน" อย่างน้อย 2 ตัวอย่าง','ไม่มีคำว่า function/return/=>/regex ใน prompt (ระบบตัดสิทธิ์)','ถ้ารอบแรกไม่ผ่านบางเคส ดูว่า test ชื่ออะไรพัง แล้วเพิ่มกฎ/ตัวอย่างเฉพาะจุดนั้น']}
 ],
 quiz:[
 {q:'สิ่งใดสำคัญที่สุดที่คนมักลืมใส่ใน prompt เมื่อให้ AI เขียนฟังก์ชันแปลงข้อความ',o:['ชื่อผู้เขียน','ขอบเขต/edge case และสิ่งที่ต้องคงเดิม พร้อม negative examples','ภาษาโปรแกรมที่ชอบ','ความยาวโค้ด'],a:1,e:''},
 {q:'ทำไมควรระบุ "ลำดับการประมวลผล"',o:['ให้ prompt ยาวขึ้น','เพราะเมื่อกฎทับกัน (เช่น API key อยู่ใน Bearer token) ผลจะต่างกันตามลำดับ','AI ชอบตัวเลข','ไม่จำเป็น'],a:1,e:''}
 ]}
);
