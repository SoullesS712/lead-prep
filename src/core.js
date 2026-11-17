/* ================= CORE: state, schedule, helpers ================= */
const COMPS = [
  ['Program Coding',13.55,'code'],['System Design',7.05,'sysd'],['Database Design',7.05,'db'],['GIT',7.05,'git'],
  ['Web & Mobile (Advance)',7.05,'fe'],['OOP',7.05,'oop'],['SQL Coding',6.78,'sql'],['Prompt Coding',6.78,'prompt'],
  ['Microservices',5.69,'micro'],['SQL',5.69,'sqlt'],['Monitoring & Logging',5.69,'mon'],['Unit & Functional Testing',5.69,'test'],
  ['Application Security',5.69,'sec'],['Container',2.98,'cont'],['Cloud',2.98,'cloud'],['CI/CD',1.63,'cicd'],['AI & Prompt Engineer',1.63,'ai']
];
// ระดับที่ต้องได้ต่อทักษะ ตามตำแหน่ง (Junior, Senior, Lead, Expert, Manager) จาก sheet "competency"
const ROLES = ['Junior', 'Senior', 'Lead', 'Expert', 'Manager'];
const EXP = {code:'BIIAB', sysd:'BIIAI', db:'BIIAI', git:'BIIAB', fe:'BIAAB', oop:'BIIAB', sql:'BIIAB', prompt:'BIIAB', micro:'BIIAI',
  sqlt:'BIIAB', mon:'BIIAI', test:'BIIAB', sec:'BIIAI', cont:'BIIAB', cloud:'IIIAI', cicd:'BIIAB', ai:'BIIIB'};
const LESSON_COMP = {algo:'code', sqlt:'sqlt', pc:'prompt', sysd:'sysd', db:'db', micro:'micro', git:'git', oop:'oop', test:'test',
  mon:'mon', fe:'fe', api:'fe', sec:'sec', cont:'cont', cicd:'cicd', cloud:'cloud', ai:'ai'};
const CUT = {B:30, I:50, A:70};
const PASS_OPTIONS = [60, 70, 80, 90];
const GROUPS = [
  ['ฝึกมือ (น้ำหนักสูงสุด)', ['algo', 'sqlt', 'pc']],
  ['Architecture', ['sysd', 'db', 'micro']],
  ['Web & API', ['fe', 'api']],
  ['Engineering', ['oop', 'git', 'test', 'mon']],
  ['Security', ['sec']],
  ['DevOps & Cloud', ['cont', 'cicd', 'cloud']],
  ['AI', ['ai']]
];
const LV = {B:'Beginner',I:'Intermediate',A:'Advance'};
const KEY = 'comp2026-lead-training-v1', HIST_KEY = 'comp2026-exam-history';
function ymd(d){ return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
function parseYmd(s){ const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); }
const freshState = () => ({lessons:{}, quiz:{}, pre:{}, post:{}, units:{}, prob:{}, sql:{}, prompt:{}, code:{}, practice:'mcq', target:{role:'Lead', pass:80},
  sched:{examDate:'2026-11-23', time:'20:00', days:[0,1,2,3,4,5,6], start:ymd(new Date()), units:null}});
let ST = freshState();
try { const s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s) { ST = Object.assign(ST, s); ST.sched = Object.assign(freshState().sched, s.sched || {}); ST.target = Object.assign({role:'Lead', pass:80}, s.target || {}); ['pre','post','units'].forEach(k => ST[k] = ST[k] || {}); } } catch (e) {}
function save(){ try { localStorage.setItem(KEY, JSON.stringify(ST)); } catch (e) {} }
async function resetProgress(){ if (await uiConfirm('ลบผล pre-test / post-test โจทย์ที่ผ่าน และโค้ดที่เขียนไว้ทั้งหมด ส่วนตารางเรียน การแจ้งเตือน และเป้าหมายยังอยู่', {title: 'ล้างความคืบหน้า?', ok: 'ล้างข้อมูล', danger: true})) { const sc = ST.sched, tg = ST.target; ST = freshState(); ST.sched = sc; ST.target = tg; save(); render(); } }

/* ---------- modal ยืนยัน/แจ้งเตือน ตาม theme (แทน confirm/alert ของระบบที่เป็นกล่องสีขาว) ---------- */
function uiDialog(msg, opts){
  opts = opts || {};
  return new Promise(resolve => {
    const d = document.createElement('dialog'); d.className = 'ui-dialog';
    const box = document.createElement('div'); box.className = 'in';
    if (opts.title) { const h = document.createElement('h3'); h.textContent = opts.title; box.appendChild(h); }
    if (msg) { const p = document.createElement('p'); p.textContent = msg; box.appendChild(p); }
    const row = document.createElement('div'); row.className = 'ui-dialog-actions';
    const done = v => { d.close(); d.remove(); resolve(v); };
    if (opts.cancel !== false) { const c = document.createElement('button'); c.className = 'ui-btn'; c.textContent = opts.cancel || 'ยกเลิก'; c.onclick = () => done(false); row.appendChild(c); }
    const ok = document.createElement('button'); ok.className = 'ui-btn ' + (opts.danger ? 'danger' : 'primary'); ok.textContent = opts.ok || 'ตกลง';
    ok.onclick = () => done(true); row.appendChild(ok);
    box.appendChild(row); d.appendChild(box);
    d.addEventListener('cancel', e => { e.preventDefault(); done(false); });   // ปุ่ม back / Esc
    d.addEventListener('click', e => { if (e.target === d) done(false); });     // แตะนอกกล่อง
    document.body.appendChild(d); d.showModal(); ok.focus({preventScroll: true});
  });
}
const uiConfirm = (msg, opts) => uiDialog(msg, opts);
const uiAlert = (msg, opts) => uiDialog(msg, Object.assign({cancel: false}, opts));
function el(tag, cls, text){ const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
function html(tag, cls, h){ const e = el(tag, cls); e.innerHTML = h; return e; }
function lvTag(lv){ return el('span', 'tag lv-' + lv, LV[lv]); }
async function copyText(text, btn){
  try { await navigator.clipboard.writeText(text); }
  catch (e) { const t = el('textarea'); t.value = text; document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove(); }
  if (btn) { const o = btn.textContent; btn.textContent = 'คัดลอกแล้ว ✓'; setTimeout(() => btn.textContent = o, 1500); }
}
const lessonById = id => LESSONS.find(l => l.id === id);
// ชื่อสั้นสำหรับปุ่มเลือกบท (ไม่ตัดกลางคำ)
const CHIP = {algo:'Coding', sqlt:'SQL', pc:'Prompt', sysd:'System Design', db:'Database', micro:'Microservices',
  fe:'Frontend', api:'Backend & API', oop:'OOP', git:'Git', test:'Testing', mon:'Monitoring', sec:'Security',
  cont:'Container', cicd:'CI/CD', cloud:'Cloud', ai:'AI'};
const shortTitle = l => l.title.split(' — ')[0];
const subTitle = l => l.title.split(' — ')[1] || l.comp;

/* ---------- ตารางเรียน ---------- */
const DOW = ['อา','จ','อ','พ','พฤ','ศ','ส'];
const MON = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
function thDate(s){ const d = parseYmd(s); return `${DOW[d.getDay()]} ${d.getDate()} ${MON[d.getMonth()]}`; }
const rng = (a, b) => Array.from({length: b - a + 1}, (_, i) => a + i);
// หน่วยการเรียนตามลำดับความสำคัญ (h = ชั่วโมงโดยประมาณ ใช้กระจายลงวัน)
const UNITS = [
  {id:'u1', t:'วัดระดับก่อนเรียน — สอบ V2 แบบ Final', h:2, manual:true, exam:true},
  {id:'u2', t:'Program Coding I — วิธีคิด + โจทย์ 1–6', h:3, lessons:['algo'], probs:rng(0, 5)},
  {id:'u3', t:'Program Coding II — โจทย์ 7–12 (Advance)', h:3, probs:rng(6, 11)},
  {id:'u3b', t:'Program Coding III — โจทย์ 13–21 (heap, LIS, deque)', h:3, probs:rng(12, 20)},
  {id:'u4', t:'SQL — บทเรียน + SQL Lab 1–5', h:2.5, lessons:['sqlt'], sql:rng(0, 4)},
  {id:'u5', t:'SQL Lab 6–10 (window, CTE, recursive)', h:2, sql:rng(5, 9)},
  {id:'u5b', t:'SQL Lab 11–20 (pivot, LAG, RANK, self join)', h:2, sql:rng(10, 19)},
  {id:'u6', t:'System Design', h:1.5, lessons:['sysd']},
  {id:'u7', t:'Database Design', h:1.5, lessons:['db']},
  {id:'u8', t:'Frontend', h:1.5, lessons:['fe']},
  {id:'u9', t:'Backend & API', h:1.5, lessons:['api']},
  {id:'u10', t:'OOP + Git', h:2, lessons:['oop', 'git']},
  {id:'u11', t:'Testing + Monitoring', h:2, lessons:['test', 'mon']},
  {id:'u12', t:'Application Security', h:1.5, lessons:['sec']},
  {id:'u13', t:'Microservices', h:1.5, lessons:['micro']},
  {id:'u14', t:'Prompt Coding + Prompt Lab', h:2, lessons:['pc'], prompts:true},
  {id:'u15', t:'Container + CI/CD + Cloud + AI', h:2, lessons:['cont', 'cicd', 'cloud', 'ai']},
  {id:'u16', t:'ทบทวน — ทำ post-test ที่ยังไม่ผ่านให้ผ่านทุกบท', h:1.5, review:true},
  {id:'u17', t:'สอบจำลอง V1 แบบ Final', h:2, manual:true, exam:true},
  {id:'u18', t:'ทบทวนทักษะที่ยังไม่ถึงเกณฑ์จากผลสอบ V1', h:1.5, manual:true},
  {id:'u19', t:'สอบ V2 แบบ Final รอบสุดท้าย เทียบกับครั้งแรก', h:2, manual:true, exam:true}
];
const role = () => ROLES.includes(ST.target.role) ? ST.target.role : 'Lead';
const passPct = () => ST.target.pass || 80;
const need = key => EXP[key][ROLES.indexOf(role())];
const lessonNeed = l => need(LESSON_COMP[l.id] || 'code');
// ผ่านเมื่อคะแนน post-test ที่ดีที่สุดถึงเกณฑ์ปัจจุบัน (เปลี่ยนเกณฑ์แล้วสถานะเปลี่ยนตาม)
const lessonPassed = id => !!(ST.post[id] && ST.post[id].best >= passPct());
function unitDone(u){
  if (u.manual) return !!ST.units[u.id];
  if (u.review) return LESSONS.every(l => lessonPassed(l.id));
  return (u.lessons || []).every(lessonPassed) && (u.probs || []).every(i => ST.prob[PROBLEMS[i].id])
    && (u.sql || []).every(i => ST.sql[i]) && (!u.prompts || PROMPT_TASKS.every(t => ST.prompt[t.id]));
}
// หน่วยนี้ควรพาไปหน้าไหน (บทที่ยังไม่ผ่านก่อน แล้วค่อยไปโจทย์)
function unitRoute(u){
  if (u.exam) return 'competency-2026-exam.html#final';
  const l = (u.lessons || []).find(id => !lessonPassed(id));
  if (l) return '#/lesson/' + l;
  if (u.probs) return '#/practice/code';
  if (u.sql) return '#/practice/sql';
  if (u.prompts) return '#/practice/prompt';
  return '#/learn';
}
function studyDates(){
  const sc = ST.sched, out = [], end = parseYmd(sc.examDate);
  for (let d = parseYmd(sc.start); d < end; d.setDate(d.getDate() + 1)) if (sc.days.includes(d.getDay())) out.push(ymd(d));
  return out;
}
// กระจายหน่วยลงวันตามสัดส่วนชั่วโมง — วันน้อยจะรวมหลายหน่วย วันมากหน่วยใหญ่จะต่อหลายวัน
function buildPlan(){
  const dates = studyDates(), units = UNITS.filter(u => !ST.sched.units || ST.sched.units.includes(u.id));
  if (!dates.length || !units.length) return [];
  const W = units.reduce((s, u) => s + u.h, 0), per = W / dates.length;
  let acc = 0;
  const spans = units.map(u => { const s = acc; acc += u.h; return {u, s, e: acc}; });
  return dates.map((date, i) => {
    const a = i * per, b = (i + 1) * per;
    const items = spans.filter(x => Math.min(b, x.e) - Math.max(a, x.s) > 1e-6).map(x => ({u: x.u, cont: x.s < a - 1e-6}));
    return {date, items};
  });
}
const daysLeft = () => Math.round((parseYmd(ST.sched.examDate) - parseYmd(ymd(new Date()))) / 864e5);

/* ---------- สะพานไปแอป Android (แจ้งเตือน) ---------- */
const IN_APP = typeof AppBridge !== 'undefined';
// ในแอป Flutter เว้นขอบล่างให้แล้ว (SafeArea) — ไม่ต้องเว้นซ้ำด้วย safe-area-inset
if (IN_APP) document.documentElement.classList.add('in-app');
function bridge(msg){ if (IN_APP) try { AppBridge.postMessage(JSON.stringify(msg)); } catch (e) {} }
window.appMsg = m => {
  const n = document.getElementById('notifStatus'); if (!n) return;
  if (m.type === 'scheduled') n.textContent = m.perm === false ? 'ยังไม่ได้รับสิทธิ์แจ้งเตือน — เปิดที่ ตั้งค่าเครื่อง › แอป › Lead Prep › การแจ้งเตือน'
    : `ตั้งแจ้งเตือนแล้ว ${m.count} ครั้ง` + (m.exact === false ? ' (อาจคลาดเคลื่อนไม่กี่นาที)' : '');
  if (m.type === 'test') n.textContent = m.perm === false ? 'ยังไม่ได้รับสิทธิ์แจ้งเตือน' : 'ส่งแจ้งเตือนทดสอบแล้ว จะเด้งในอีกประมาณ 5 วินาที';
};
// ask = ผู้ใช้กดบันทึกเอง → แอปขอสิทธิ์ที่ขาด (เปิดหน้าตั้งค่า) ได้; ตอนเปิดแอปจะไม่เด้งไปหน้าตั้งค่า
function sendSchedule(ask){
  const [hh, mm] = ST.sched.time.split(':').map(Number), now = Date.now(), items = [];
  const exam = parseYmd(ST.sched.examDate);
  buildPlan().forEach((p, i) => {
    const d = parseYmd(p.date); d.setHours(hh, mm, 0, 0);
    if (d.getTime() <= now || !p.items.length) return;
    const left = Math.round((exam - parseYmd(p.date)) / 864e5), r = unitRoute(p.items[0].u);
    items.push({id: 1000 + i, at: d.getTime(), title: `ถึงเวลาเรียน · อีก ${left} วันสอบ`,
      body: p.items.map(x => x.u.t + (x.cont ? ' (ต่อ)' : '')).join(' · '), hash: r.startsWith('#') ? r : '#/exam'});
  });
  const ed = new Date(exam); ed.setHours(7, 0, 0, 0);
  if (ed.getTime() > now) items.push({id: 999, at: ed.getTime(), title: 'วันนี้สอบ Competency', body: 'ทำปรนัยให้เร็ว เก็บเวลาไว้ให้ข้อ Coding อ่านข้อจำกัดก่อนเลือกอัลกอริทึม — สู้ ๆ', hash: '#/today'});
  bridge({type: 'schedule', items, ask: !!ask});
  return items.length;
}
