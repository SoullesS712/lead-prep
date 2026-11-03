/* ================= ตัวรันโค้ด JS (Web Worker) + หน้าฝึก Coding / SQL Lab / Prompt Lab ================= */
/* ---------- JS runner ---------- */
const WORKER_SRC = `onmessage = e => {
  const { code, fn, tests } = e.data;
  let f;
  try { f = new Function(code + '\\n;return typeof ' + fn + ' === "function" ? ' + fn + ' : undefined;')(); }
  catch (err) { postMessage({ error: 'Syntax/Runtime error: ' + err.message }); return; }
  if (typeof f !== 'function') { postMessage({ error: 'ไม่พบฟังก์ชัน ' + fn }); return; }
  postMessage({ results: tests.map(t => {
    const t0 = Date.now();
    try { const out = f(...JSON.parse(JSON.stringify(t.args))); const s = JSON.stringify(out), ms = Date.now() - t0, slow = t.maxMs && ms > t.maxMs;
      return { ok: s === JSON.stringify(t.expected) && !slow, out: (s === undefined ? 'undefined' : s) + (slow ? ' (ช้าเกิน ' + t.maxMs + ' ms)' : ''), ms }; }
    catch (err) { return { ok: false, out: 'Error: ' + err.message, ms: Date.now() - t0 }; }
  }) });
};`;
let workerUrl = null;
const genCache = {};
function expandTests(p, tests){
  return tests.map(t => {
    if (!t.gen) return t;
    if (!genCache[t.gen]) { const args = GEN[t.gen](); const ref = new Function(p.sol + '\n;return ' + p.fn + ';')(); genCache[t.gen] = { args, expected: ref(...JSON.parse(JSON.stringify(args))) }; }
    return { n: t.n, args: genCache[t.gen].args, expected: genCache[t.gen].expected, big: true, maxMs: t.maxMs };
  });
}
function runJs(code, fn, tests){
  const limit = 3000 + tests.filter(t => t.big).length * 4000;
  return new Promise(resolve => {
    let w;
    try { workerUrl = workerUrl || URL.createObjectURL(new Blob([WORKER_SRC], { type: 'text/javascript' })); w = new Worker(workerUrl); }
    catch (e) { resolve(runInline(code, fn, tests)); return; }
    const timer = setTimeout(() => { w.terminate(); resolve({ error: `Timeout > ${limit / 1000} วินาที (infinite loop หรืออัลกอริทึมช้าเกินไป)` }); }, limit);
    w.onmessage = e => { clearTimeout(timer); w.terminate(); resolve(e.data); };
    w.onerror = e => { clearTimeout(timer); w.terminate(); resolve({ error: e.message || 'Worker error' }); };
    w.postMessage({ code, fn, tests });
  });
}
function runInline(code, fn, tests){
  let f;
  try { f = new Function(code + '\n;return typeof ' + fn + ' === "function" ? ' + fn + ' : undefined;')(); } catch (err) { return { error: err.message }; }
  if (typeof f !== 'function') return { error: 'ไม่พบฟังก์ชัน ' + fn };
  return { results: tests.map(t => { try { const s = JSON.stringify(f(...JSON.parse(JSON.stringify(t.args)))); return { ok: s === JSON.stringify(t.expected), out: String(s) }; } catch (err) { return { ok: false, out: 'Error: ' + err.message }; } }) };
}
function showResult(out, r, tests){
  out.innerHTML = '';
  if (r.error) { out.appendChild(el('div', 'fail', '✗ ' + r.error)); return false; }
  const pass = r.results.filter(x => x.ok).length, all = pass === tests.length;
  out.appendChild(el('div', all ? 'pass' : 'fail', `ผ่าน ${pass}/${tests.length} test${all ? ' 🎉' : ''}`));
  r.results.forEach((x, k) => {
    const t = tests[k], a = t.args.map(v => JSON.stringify(v)).join(', ');
    const label = t.big ? t.n : (t.n ? t.n + ': ' : '') + '(' + (a.length > 120 ? a.slice(0, 120) + '…' : a) + ')';
    out.appendChild(el('div', x.ok ? 'pass' : 'fail', `${x.ok ? '✓' : '✗'} ${label} → ${x.out.length > 120 ? x.out.slice(0, 120) + '…' : x.out}${x.ok ? '' : '   expected ' + JSON.stringify(t.expected)}${t.big && x.ms != null ? `  (${x.ms} ms)` : ''}`));
  });
  return all;
}
function codeArea(key, starter, rows){
  const ta = el('textarea'); ta.rows = rows || 12; ta.spellcheck = false; ta.value = ST.code[key] != null ? ST.code[key] : starter;
  ta.oninput = () => { ST.code[key] = ta.value; save(); };
  ta.onkeydown = e => { if (e.key === 'Tab') { e.preventDefault(); const s = ta.selectionStart; ta.value = ta.value.slice(0, s) + '  ' + ta.value.slice(ta.selectionEnd); ta.selectionStart = ta.selectionEnd = s + 2; ST.code[key] = ta.value; save(); } };
  return ta;
}
function reveal(label, text){ const d = el('details'); d.appendChild(el('summary', 'muted', label)); d.appendChild(el('pre', null, text)); d.style.margin = '6px 0'; return d; }

/* ---------- Program Coding problems ---------- */
function renderProblems(m){
  const head = el('div', 'card'); head.appendChild(el('h2', null, `โจทย์ฝึก Program Coding (${PROBLEMS.length} ข้อ)`));
  head.appendChild(html('p', 'muted', 'เขียนเป็น JavaScript เพื่อรันตรวจในหน้าเว็บได้ทันที แล้วฝึกเขียนซ้ำเป็น C# ตามเฉลย (ข้อสอบจริงเลือก C# ได้ แต่ต้องตรวจเองด้วย xUnit) · ข้อ Dijkstra มี performance test เหมือนข้อสอบจริง'));
  m.appendChild(head);
  PROBLEMS.forEach((p, idx) => {
    const d = el('details', 'card lesson');
    const s = el('summary');
    s.appendChild(el('span', 't', `${idx + 1}. ${p.title}`));
    s.appendChild(el('span', 'tag', p.pattern)); s.appendChild(lvTag(p.lv));
    if (ST.prob[p.id]) s.appendChild(el('span', 'tag done', '✓ ผ่าน'));
    d.appendChild(s);
    const b = el('div');
    b.appendChild(el('p', 'b', p.desc)).style.whiteSpace = 'pre-wrap';
    const ta = codeArea(p.id, p.starter); b.appendChild(ta);
    const row = el('div', 'row'), out = el('div', 'out');
    const run = el('button', 'btn green', '▶ Run tests');
    run.onclick = async () => {
      out.textContent = 'กำลังรัน...';
      const tests = expandTests(p, p.tests);
      const ok = showResult(out, await runJs(ta.value, p.fn, tests), tests);
      if (ok && !ST.prob[p.id]) { ST.prob[p.id] = true; save(); s.appendChild(el('span', 'tag done', '✓ ผ่าน')); }
    };
    const rs = el('button', 'btn', 'Reset'); rs.onclick = async () => { if (await uiConfirm('โค้ดที่เขียนไว้ในโจทย์นี้จะหายไป', {title: 'ล้างโค้ด?', ok: 'ล้างโค้ด', danger: true})) { ta.value = p.starter; ST.code[p.id] = p.starter; save(); } };
    row.appendChild(run); row.appendChild(rs); b.appendChild(row); b.appendChild(out);
    b.appendChild(reveal('💡 คำใบ้', p.hint));
    b.appendChild(reveal('เฉลย JavaScript', p.sol));
    b.appendChild(reveal('เฉลย C#', p.cs));
    b.appendChild(el('div', 'muted', 'Complexity: ' + p.cx));
    d.appendChild(b); m.appendChild(d);
  });
}

/* ---------- SQL lab ---------- */
let SQL = null, sqlLoading = null;
function loadSql(){
  if (sqlLoading) return sqlLoading;
  sqlLoading = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    const CDN = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/';
    // ในแอปมีไฟล์ sqljs/ อยู่ในเครื่อง (ใช้ออฟไลน์ได้) ถ้าโหลดไม่ได้ค่อยใช้ CDN
    const tryLoad = (base, next) => {
      const s = document.createElement('script'); s.src = base + 'sql-wasm.js';
      s.onload = () => initSqlJs({ locateFile: f => base + f }).then(x => { SQL = x; resolve(x); }).catch(e => next ? next() : reject(e));
      s.onerror = () => { s.remove(); next ? next() : reject(new Error('โหลด SQLite engine ไม่ได้ (ต้องต่ออินเทอร์เน็ต)')); };
      document.head.appendChild(s);
    };
    location.protocol.startsWith('http') ? tryLoad('sqljs/', () => tryLoad(CDN)) : tryLoad(CDN);
  });
  sqlLoading.catch(() => { sqlLoading = null; });
  return sqlLoading;
}
function execQ(q){ const db = new SQL.Database(); try { db.run(SHOP_DB); const r = db.exec(q); return r.length ? r[r.length - 1] : { columns: [], values: [] }; } finally { db.close(); } }
function tableOf(r){
  const tw = el('div', 'tw'), t = el('table'), h = el('tr');
  r.columns.forEach(c => h.appendChild(el('th', null, c))); t.appendChild(h);
  r.values.forEach(v => { const tr = el('tr'); v.forEach(x => tr.appendChild(el('td', null, x === null ? 'NULL' : x))); t.appendChild(tr); });
  tw.appendChild(t); return tw;
}
const norm = r => JSON.stringify(r.values.map(v => v.map(x => typeof x === 'number' ? Math.round(x * 100) / 100 : x)));
function renderSqlLab(m){
  const c = el('div', 'card');
  c.appendChild(el('h2', null, 'SQL Lab — ฐานข้อมูลร้านค้า (SQLite)'));
  c.appendChild(html('p', 'muted', 'ตาราง: <code>customers(id, name, city, joined_at)</code> · <code>products(id, name, category, price)</code> · <code>orders(id, customer_id, order_date, status)</code> · <code>order_items(order_id, product_id, qty, unit_price)</code> · <code>employees(id, name, manager_id, dept, salary)</code> — ตรวจทั้งค่าและลำดับแถว (ไม่สนชื่อคอลัมน์)'));
  const ta = el('textarea'); ta.rows = 3; ta.value = 'SELECT * FROM orders;';
  const out = el('div', 'out'), row = el('div', 'row');
  const run = el('button', 'btn green', '▶ Run (ทดลองอิสระ)');
  run.onclick = async () => { try { await loadSql(); out.innerHTML = ''; const r = execQ(ta.value); out.appendChild(el('div', 'muted', r.values.length + ' แถว')); out.appendChild(tableOf(r)); } catch (e) { out.textContent = '✗ ' + e.message; } };
  row.appendChild(run); c.appendChild(ta); c.appendChild(row); c.appendChild(out);
  m.appendChild(c);
  SQL_EX.forEach((x, i) => {
    const d = el('details', 'card lesson'), s = el('summary');
    s.appendChild(el('span', 't', `SQL ${i + 1}. ${x.t}`)); s.appendChild(lvTag(x.lv));
    if (ST.sql[i]) s.appendChild(el('span', 'tag done', '✓ ผ่าน'));
    d.appendChild(s);
    const b = el('div'); b.appendChild(el('p', 'b', x.d));
    const area = codeArea('sql' + i, 'SELECT ', 7); b.appendChild(area);
    const r2 = el('div', 'row'), o2 = el('div', 'out');
    const chk = el('button', 'btn green', '▶ Run & ตรวจ');
    chk.onclick = async () => {
      o2.textContent = 'กำลังรัน...';
      try { await loadSql(); } catch (e) { o2.textContent = '✗ ' + e.message; return; }
      o2.innerHTML = '';
      try {
        const mine = execQ(area.value), ref = execQ(x.ref), ok = norm(mine) === norm(ref);
        o2.appendChild(el('div', ok ? 'pass' : 'fail', ok ? '✓ ถูกต้อง 🎉' : `✗ ยังไม่ตรง (ได้ ${mine.values.length} แถว, ที่คาดหวัง ${ref.values.length} แถว)`));
        o2.appendChild(el('div', 'muted', 'ผลของคุณ:')); o2.appendChild(tableOf(mine));
        if (!ok) { const dd = el('details'); dd.appendChild(el('summary', 'muted', 'ดูผลที่คาดหวัง')); dd.appendChild(tableOf(ref)); o2.appendChild(dd); }
        if (ok && !ST.sql[i]) { ST.sql[i] = true; save(); s.appendChild(el('span', 'tag done', '✓ ผ่าน')); }
      } catch (e) { o2.appendChild(el('div', 'fail', '✗ SQL error: ' + e.message)); }
    };
    r2.appendChild(chk); b.appendChild(r2); b.appendChild(o2);
    b.appendChild(reveal('เฉลย', x.ref));
    d.appendChild(b); m.appendChild(d);
  });
}

/* ---------- Prompt lab ---------- */
const CODE_IN_PROMPT = /```|=>|\bfunction\b|\breturn\b|\bconst\s|\blet\s|\bvar\s|\bfor\s*\(|\bwhile\s*\(|\.replace\(|\.match\(|new RegExp|\\d|\\s|\[0-9\]/i;
function promptIssue(t){
  t = (t || '').trim();
  if (t.length < 30) return 'prompt สั้นเกินไป (อย่างน้อย 30 ตัวอักษร)';
  if (t.length > 2000) return 'prompt ยาวเกิน 2000 ตัวอักษร';
  if (CODE_IN_PROMPT.test(t)) return 'ห้ามเขียนโค้ดหรือ regex ใน prompt (พบ function, return, =>, \\d ฯลฯ)';
  return '';
}
function wrapPrompt(task, text){
  return `คุณคือผู้ช่วยเขียนโค้ด จงเขียนฟังก์ชัน JavaScript (ES2020) ชื่อ ${task.fn}(${task.params}) ตามคำสั่งของผู้ใช้ด้านล่าง\nข้อกำหนดของระบบ:\n- ตอบเป็นโค้ด JavaScript ใน code block เดียว ไม่ต้องอธิบาย\n- ประกาศ function ${task.fn}(${task.params}) { ... } ที่ระดับบนสุด\n- ห้ามใช้ require, import, fetch หรือ API ของ browser/Node.js\n\nคำสั่งของผู้ใช้:\n"""\n${text.trim()}\n"""`;
}
function extractCode(t){ const mm = t.match(/```(?:javascript|js)?[^\n]*\n([\s\S]*?)```/i); return (mm ? mm[1] : t).trim(); }
function renderPromptLab(m){
  const c = el('div', 'card');
  c.appendChild(el('h2', null, 'Prompt Lab'));
  c.appendChild(html('ol', 'b', '<li>อ่านโจทย์ แล้วเขียน prompt เป็นภาษาคน (ห้ามโค้ด/regex)</li><li>กด "คัดลอก prompt" ไปวางใน AI (Claude, ChatGPT, Copilot) — ใช้แชตใหม่ทุกครั้ง เพื่อให้ AI เห็นเฉพาะ prompt ของคุณ</li><li>วางคำตอบของ AI ทั้งหมดในช่องที่ 2 <b>ห้ามแก้โค้ดเอง</b> แล้วกด Run</li><li>ถ้าไม่ผ่านบางเคส ให้ปรับ prompt (ไม่ใช่ปรับโค้ด) — ข้อสอบจริงมีโอกาสประมาณ 3 ครั้ง</li>'));
  m.appendChild(c);
  PROMPT_TASKS.forEach(task => {
    const d = el('details', 'card lesson'), s = el('summary');
    s.appendChild(el('span', 't', task.title)); s.appendChild(lvTag('I'));
    if (ST.prompt[task.id]) s.appendChild(el('span', 'tag done', '✓ ผ่าน'));
    d.appendChild(s);
    const b = el('div');
    b.appendChild(el('p', 'b', task.spec)).style.whiteSpace = 'pre-wrap';
    b.appendChild(el('b', null, '1) prompt ของคุณ'));
    const pa = el('textarea', 'prompt'); pa.value = ST.code[task.id + '-p'] || '';
    const info = el('div', 'muted');
    const upd = () => { const p = promptIssue(pa.value); info.textContent = `${pa.value.trim().length}/2000 ตัวอักษร · ` + (p || '✓ ใช้ได้'); info.className = p ? 'warn' : 'pass'; };
    pa.oninput = () => { ST.code[task.id + '-p'] = pa.value; save(); upd(); }; upd();
    b.appendChild(pa); b.appendChild(info);
    const cp = el('button', 'btn primary', '📋 คัดลอก prompt ไปวางใน AI');
    cp.onclick = () => { const p = promptIssue(pa.value); if (p) { uiAlert(p, {title: 'ยังคัดลอก prompt ไม่ได้'}); return; } copyText(wrapPrompt(task, pa.value), cp); };
    const r1 = el('div', 'row'); r1.appendChild(cp); b.appendChild(r1);
    b.appendChild(el('b', null, '2) วางคำตอบของ AI'));
    const ca = codeArea(task.id + '-c', '', 10); ca.placeholder = 'วางคำตอบของ AI ทั้งหมด ระบบจะดึงโค้ดจาก code block ให้'; b.appendChild(ca);
    const r2 = el('div', 'row'), out = el('div', 'out');
    const run = el('button', 'btn green', '▶ Run tests');
    run.onclick = async () => {
      const p = promptIssue(pa.value); if (p) { out.textContent = '✗ ' + p; return; }
      if (!ca.value.trim()) { out.textContent = '✗ ยังไม่ได้วางโค้ด'; return; }
      out.textContent = 'กำลังรัน...';
      const ok = showResult(out, await runJs(extractCode(ca.value), task.fn, task.tests), task.tests);
      if (ok && !ST.prompt[task.id]) { ST.prompt[task.id] = true; save(); s.appendChild(el('span', 'tag done', '✓ ผ่าน')); }
    };
    r2.appendChild(run); b.appendChild(r2); b.appendChild(out);
    b.appendChild(reveal('ตัวอย่าง prompt ที่ผ่าน (ดูหลังลองเองแล้ว)', task.sample));
    b.appendChild(reveal('ตัวอย่างโค้ดที่ถูกต้อง', task.sol));
    d.appendChild(b); m.appendChild(d);
  });
}

