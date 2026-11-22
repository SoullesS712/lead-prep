/* ================= จำลอง HackerRank: 8 section จับเวลาแยก (สอบครบ หรือซ้อมทีละ section) ================= */
const HR_SECTIONS = [
  {id:'s1', name:'Software Design and Architecture', n:14, min:25, lids:['sysd', 'db', 'micro']},
  {id:'s2', name:'Software Engineering and Development', n:26, min:35, lids:['oop', 'test', 'git', 'fe', 'api', 'sqlt', 'algo', 'hr']},
  {id:'s3', name:'Infrastructure & DevOps', n:8, min:15, lids:['cont', 'cicd', 'cloud', 'mon']},
  {id:'s4', name:'Security', n:4, min:10, lids:['sec']},
  {id:'s5', name:'Future Skill', n:2, min:5, lids:['ai', 'pc']},
  {id:'s6', name:'SQL Coding', n:1, min:10, kind:'sql'},
  {id:'s7', name:'Prompt Coding', n:1, min:15, kind:'prompt'},
  {id:'s8', name:'Software Coding', n:1, min:30, kind:'code'}
];
// โจทย์ coding ที่สุ่มมาใช้ใน section 8 (แนวที่ HackerRank ชอบออก)
const HR_CODE_IDS = ['p22', 'p23', 'p24', 'p25', 'p26', 'p27', 'p28', 'p29', 'p30', 'p1', 'p3', 'p12', 'p13', 'p14', 'p19'];
let hrTimer = null, hrClosing = false;

function hrToast(msg){ const t = el('div', 'toast', msg); document.body.appendChild(t); setTimeout(() => t.remove(), 3500); }
function hrFmt(ms){ const s = Math.max(0, Math.round(ms / 1000)); return `${Math.floor(s / 60)} min ${String(s % 60).padStart(2, '0')} sec`; }
// สลับตัวเลือก รองรับทั้งคำตอบเดียวและหลายคำตอบ
function hrShuffleQ(q){
  const idx = shuffle(q.o.map((_, i) => i));
  return Object.assign({}, q, {o: idx.map(i => q.o[i]), a: Array.isArray(q.a) ? q.a.map(x => idx.indexOf(x)).sort() : idx.indexOf(q.a)});
}
function hrBuild(sec){
  if (sec.kind === 'sql') return {task: HR_SQL[Math.floor(Math.random() * HR_SQL.length)].id};
  if (sec.kind === 'prompt') return {task: HR_PROMPT[Math.floor(Math.random() * HR_PROMPT.length)].id};
  if (sec.kind === 'code') return {task: HR_CODE_IDS[Math.floor(Math.random() * HR_CODE_IDS.length)]};
  const pool = allDrillQs(sec.lids).concat(MULTI.filter(q => sec.lids.includes(q.lid)));
  // ให้มีข้อเลือกหลายคำตอบปนอยู่บ้าง (เหมือนข้อสอบจริง)
  const multi = shuffle(pool.filter(q => q.multi)).slice(0, Math.max(1, Math.round(sec.n / 7)));
  const single = shuffle(pool.filter(q => !q.multi)).slice(0, sec.n - multi.length);
  return {items: shuffle(multi.concat(single)).map(hrShuffleQ)};
}
function hrStart(order){
  const H = ST.hr = {order, pos: 0, secs: {}, startedAt: Date.now(), results: null};
  hrOpenSection(H);
  save(); render(); window.scrollTo(0, 0);
}
function hrOpenSection(H){
  const sec = HR_SECTIONS[H.order[H.pos]];
  H.secs[sec.id] = Object.assign(hrBuild(sec), {ans: {}, marks: {}, cur: 0, code: null, prompt: '\n\n{testcase input}', caseOut: {}, start: Date.now()});
  H.deadline = Date.now() + sec.min * 60000;
}
const hrSec = H => HR_SECTIONS[H.order[H.pos]];

/* ---------- ตรวจคำตอบ ---------- */
function hrMcqOk(q, ans){
  if (ans == null) return false;
  if (Array.isArray(q.a)) return Array.isArray(ans) && ans.length === q.a.length && ans.slice().sort().every((x, i) => x === q.a[i]);
  return ans === q.a;
}
function hrSqlRun(task, q, data){ const db = new SQL.Database(); try { db.run(task.schema + data); const r = db.exec(q); return r.length ? r[r.length - 1] : {columns: [], values: []}; } finally { db.close(); } }
async function hrGrade(sec, S){
  if (!sec.kind) { const ok = S.items.filter((q, i) => hrMcqOk(q, S.ans[i])).length; return {ok, n: S.items.length, pct: Math.round(ok / S.items.length * 100)}; }
  if (sec.kind === 'sql') {
    const t = HR_SQL.find(x => x.id === S.task); let ok = 0;
    try { await loadSql(); for (const d of [t.sample, t.hidden]) { try { if (norm(hrSqlRun(t, S.code || '', d)) === norm(hrSqlRun(t, t.ref, d))) ok++; } catch (e) {} } } catch (e) {}
    return {ok, n: 2, pct: ok * 50, note: ok === 2 ? 'ผ่านทั้งข้อมูลตัวอย่างและชุดซ่อน' : ok === 1 ? 'ผ่านข้อมูลตัวอย่าง แต่ไม่ผ่านชุดซ่อน' : 'ไม่ผ่าน'};
  }
  if (sec.kind === 'prompt') {
    const t = HR_PROMPT.find(x => x.id === S.task);
    const valid = hrPromptIssue(S.prompt) === '';
    const ok = valid ? t.cases.filter((c, i) => (S.caseOut[i] || '').trim() === c.output).length : 0;
    return {ok, n: t.cases.length, pct: Math.round(ok / t.cases.length * 100), note: valid ? `ผลจาก AI ตรง ${ok}/${t.cases.length} เคส` : 'prompt ไม่มี {testcase input}'};
  }
  const p = PROBLEMS.find(x => x.id === S.task), tests = expandTests(p, p.tests);
  const r = await runJs(S.code == null ? p.starter : S.code, p.fn, tests);
  const ok = r.results ? r.results.filter(x => x.ok).length : 0;
  return {ok, n: tests.length, pct: Math.round(ok / tests.length * 100), note: r.error ? r.error : `ผ่าน ${ok}/${tests.length} test`};
}
async function hrClose(auto){
  const H = ST.hr; if (!H || H.results || hrClosing) return;
  hrClosing = true;
  const sec = hrSec(H), S = H.secs[sec.id];
  S.used = Math.min(Date.now(), H.deadline) - S.start;
  S.grade = await hrGrade(sec, S);
  if (auto) hrToast(`หมดเวลา ${sec.name} — ปิด section อัตโนมัติ`);
  H.pos++;
  if (H.pos < H.order.length) hrOpenSection(H);
  else {
    H.results = true; clearInterval(hrTimer);
    const secs = H.order.map(i => { const s = HR_SECTIONS[i]; return {id: s.id, name: s.name, pct: H.secs[s.id].grade.pct}; });
    ST.hrHist = (ST.hrHist || []).concat([{at: Date.now(), mode: H.order.length === HR_SECTIONS.length ? 'full' : 'single', secs}]).slice(-30);
  }
  hrClosing = false;
  save(); render(); window.scrollTo(0, 0);
}
function hrPromptIssue(t){ const n = (t.match(/\{testcase input\}/g) || []).length; if (n !== 1) return 'prompt ต้องมี {testcase input} หนึ่งตำแหน่งพอดี'; if (t.replace('{testcase input}', '').trim().length < 20) return 'prompt สั้นเกินไป'; return ''; }

/* ---------- หน้าจอ ---------- */
function viewHr(m){
  clearInterval(hrTimer);
  const H = ST.hr;
  if (H && !H.results) return hrRunView(m, H);
  if (H && H.results) return hrResultView(m, H);
  hrIntro(m);
}
function hrIntro(m){
  const b = el('a', 'back', '← สอบ'); b.href = '#/exam'; m.appendChild(b);
  m.appendChild(el('h1', null, 'จำลอง HackerRank'));
  m.appendChild(el('p', 'muted', 'แต่ละ section จับเวลาแยก · กด Save & Proceed แล้วกลับไปแก้ไม่ได้ · เวลาที่เหลือไม่ทบไป section ถัดไป · ข้อสุ่มใหม่ทุกครั้ง'));
  const c = el('div', 'card');
  const t = el('table'); t.innerHTML = '<tr><th>#</th><th>Section</th><th>ข้อ</th><th>เวลา</th><th></th></tr>';
  HR_SECTIONS.forEach((s, i) => {
    const tr = el('tr');
    [String(i + 1), s.name, String(s.n), s.min + ' นาที'].forEach((v, k) => tr.appendChild(el('td', k === 3 ? 'nowrap' : null, v)));
    const td = el('td'), go = el('button', 'btn small', 'ซ้อม'); go.onclick = () => hrStart([i]); td.appendChild(go); tr.appendChild(td);
    t.appendChild(tr);
  });
  const tw = el('div', 'tw'); tw.appendChild(t); c.appendChild(tw);
  const full = el('button', 'btn primary block', 'สอบครบ 8 section (57 ข้อ · 145 นาที)');
  full.onclick = async () => { if (await uiConfirm('ทำต่อเนื่องทั้ง 8 section ตามเวลาจริง ระหว่างทางปิดแอปได้ เวลายังเดินต่อ', {title: 'เริ่มสอบเต็มรูปแบบ?', ok: 'เริ่มจับเวลา'})) hrStart(HR_SECTIONS.map((_, i) => i)); };
  c.appendChild(full);
  m.appendChild(c);
  const hist = ST.hrHist || [];
  m.appendChild(el('div', 'section-label', 'ประวัติ'));
  const hc = el('div', 'card');
  if (!hist.length) hc.appendChild(el('div', 'empty', 'ยังไม่เคยทำ — ลองซ้อมทีละ section ก่อน แล้วค่อยสอบเต็ม'));
  hist.slice().reverse().slice(0, 10).forEach(x => {
    const d = new Date(x.at), row = el('div', 'item');
    const mm = el('div', 'main'); mm.appendChild(el('div', 'ttl', `${d.getDate()} ${MON[d.getMonth()]} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')} · ${x.mode === 'full' ? 'สอบเต็ม' : 'ซ้อม section'}`));
    mm.appendChild(el('div', 'sub', x.secs.map(s => `${s.name.replace(/ and | & /, ' ').split(' ').slice(0, 2).join(' ')} ${s.pct}%`).join(' · ')));
    row.appendChild(mm); hc.appendChild(row);
  });
  m.appendChild(hc);
}
function hrRunView(m, H){
  const sec = hrSec(H), S = H.secs[sec.id];
  const bar = el('div', 'hr-bar');
  const chip = el('span', 'hr-timer'); bar.appendChild(chip);
  bar.appendChild(el('span', 'hr-secname', `${H.order.length > 1 ? `Section ${H.pos + 1}/${H.order.length} · ` : ''}${sec.name}`));
  const proceed = el('button', 'btn primary small', 'Save & Proceed');
  proceed.onclick = async () => {
    const left = sec.kind ? 0 : S.items.filter((_, i) => S.ans[i] == null).length;
    const msg = (left ? `ยังไม่ได้ตอบ ${left} ข้อ · ` : '') + 'ปิด section นี้แล้วกลับมาแก้ไม่ได้ และเวลาที่เหลือจะไม่ทบไป';
    if (await uiConfirm(msg, {title: 'Save & Proceed?', ok: 'ปิด section'})) hrClose(false);
  };
  bar.appendChild(proceed);
  m.appendChild(bar);
  const tick = () => {
    if (!location.hash.startsWith('#/hr') || ST.hr !== H || H.results) { clearInterval(hrTimer); return; }
    const left = H.deadline - Date.now();
    chip.textContent = hrFmt(left);
    chip.className = 'hr-timer' + (left < 60000 ? ' danger' : left < 3 * 60000 ? ' warn' : '');
    if (left <= 0) { clearInterval(hrTimer); hrClose(true); }
  };
  tick(); hrTimer = setInterval(tick, 1000);
  const body = el('div'); m.appendChild(body);
  if (!sec.kind) hrMcqView(body, S);
  else if (sec.kind === 'sql') hrSqlView(body, S);
  else if (sec.kind === 'prompt') hrPromptView(body, S);
  else hrCodeView(body, S);
  const quit = el('button', 'btn small', 'ยกเลิกการซ้อมนี้'); quit.style.marginTop = '24px';
  quit.onclick = async () => { if (await uiConfirm('ผลของรอบนี้จะไม่ถูกบันทึก', {title: 'ยกเลิกการซ้อม?', ok: 'ยกเลิก', danger: true})) { ST.hr = null; save(); render(); } };
  m.appendChild(quit);
}
function hrMcqView(box, S){
  const nav = el('div', 'hr-nav');
  S.items.forEach((_, i) => {
    const b = el('button', 'hr-num' + (i === S.cur ? ' cur' : '') + (S.ans[i] != null && (!Array.isArray(S.ans[i]) || S.ans[i].length) ? ' done' : '') + (S.marks[i] ? ' mark' : ''), String(i + 1));
    b.onclick = () => { S.cur = i; save(); render(); };
    nav.appendChild(b);
  });
  box.appendChild(nav);
  const q = S.items[S.cur], c = el('div', 'card');
  const head = el('div', 'row'); head.style.justifyContent = 'space-between';
  head.appendChild(el('b', null, `ข้อ ${S.cur + 1} / ${S.items.length}`));
  const mk = el('button', 'btn small', S.marks[S.cur] ? '★ bookmark แล้ว' : '☆ bookmark'); mk.onclick = () => { S.marks[S.cur] = !S.marks[S.cur]; save(); render(); };
  head.appendChild(mk); c.appendChild(head);
  c.appendChild(el('p', 'b', q.q));
  c.appendChild(el('div', 'muted', q.multi ? 'Pick ONE or MORE options' : 'Pick ONE option'));
  q.o.forEach((o, k) => {
    const cur = S.ans[S.cur], on = q.multi ? (cur || []).includes(k) : cur === k;
    const b = el('button', 'opt' + (on ? ' sel' : ''), (q.multi ? (on ? '☑ ' : '☐ ') : '') + o);
    b.onclick = () => {
      if (q.multi) { const a = new Set(S.ans[S.cur] || []); a.has(k) ? a.delete(k) : a.add(k); S.ans[S.cur] = [...a].sort(); }
      else S.ans[S.cur] = k;
      save(); render();
    };
    c.appendChild(b);
  });
  const clear = el('button', 'btn small', 'Clear Selection'); clear.onclick = () => { delete S.ans[S.cur]; save(); render(); };
  const row = el('div', 'row');
  const prev = el('button', 'btn', '‹ ก่อนหน้า'); prev.disabled = S.cur === 0; prev.onclick = () => { S.cur--; save(); render(); };
  const next = el('button', 'btn', 'ถัดไป ›'); next.disabled = S.cur === S.items.length - 1; next.onclick = () => { S.cur++; save(); render(); };
  row.appendChild(prev); row.appendChild(next); row.appendChild(clear);
  c.appendChild(row);
  box.appendChild(c);
}
function hrSqlView(box, S){
  const t = HR_SQL.find(x => x.id === S.task), c = el('div', 'card');
  c.appendChild(el('h2', null, t.title));
  c.appendChild(el('p', 'b', t.desc));
  t.tables.forEach(([name, cols]) => c.appendChild(html('div', 'muted', `<b>${name}</b>: ${cols}`)));
  const peekOut = el('div', 'out');
  const peek = el('button', 'btn small', 'ดูข้อมูลตัวอย่าง');
  peek.onclick = async () => { try { await loadSql(); peekOut.innerHTML = ''; t.tables.forEach(([name]) => { peekOut.appendChild(el('b', null, name)); peekOut.appendChild(tableOf(hrSqlRun(t, `SELECT * FROM ${name};`, t.sample))); }); } catch (e) { peekOut.textContent = '✗ ' + e.message; } };
  c.appendChild(el('div', 'row')).appendChild(peek); c.appendChild(peekOut);
  c.appendChild(el('div', 'muted', 'เขียน query (ปิดท้ายด้วย ;) — ตรวจทั้งค่าและลำดับแถว ทั้งข้อมูลตัวอย่างและชุดซ่อน · ที่นี่รันด้วย SQLite (ใกล้ MySQL) ข้อสอบจริงเลือก mysql/oracle/tsql/postgresql ได้'));
  const ta = el('textarea'); ta.rows = 8; ta.spellcheck = false; ta.value = S.code || '';
  ta.oninput = () => { S.code = ta.value; save(); };
  c.appendChild(ta);
  const out = el('div', 'out'), run = el('button', 'btn green', '▶ Run Query');
  run.onclick = async () => { try { await loadSql(); out.innerHTML = ''; const r = hrSqlRun(t, ta.value, t.sample); out.appendChild(el('div', 'muted', r.values.length + ' แถว (ข้อมูลตัวอย่าง)')); out.appendChild(tableOf(r)); } catch (e) { out.textContent = '✗ ' + e.message; } };
  c.appendChild(el('div', 'row')).appendChild(run); c.appendChild(out);
  box.appendChild(c);
}
function hrPromptView(box, S){
  const t = HR_PROMPT.find(x => x.id === S.task), c = el('div', 'card');
  c.appendChild(el('h2', null, t.title));
  c.appendChild(el('p', 'b', t.desc)).style.whiteSpace = 'pre-wrap';
  c.appendChild(el('b', null, 'Sample Input')); c.appendChild(el('pre', null, t.cases[0].input));
  c.appendChild(el('b', null, 'Sample Output')); c.appendChild(el('pre', null, t.cases[0].output));
  c.appendChild(el('div', 'muted', '{testcase input} จะถูกแทนด้วยข้อมูลแต่ละเคส'));
  const pa = el('textarea', 'prompt'); pa.value = S.prompt; pa.placeholder = 'Write your prompt here...';
  const info = el('div', 'muted');
  const upd = () => { const p = hrPromptIssue(pa.value); info.textContent = p || '✓ prompt พร้อมใช้'; info.className = p ? 'warn' : 'pass'; };
  pa.oninput = () => { S.prompt = pa.value; save(); upd(); }; upd();
  c.appendChild(pa); c.appendChild(info);
  c.appendChild(el('h3', null, 'Test Results — คัดลอก prompt ของแต่ละเคสไปถาม AI (แชตใหม่) แล้ววางคำตอบกลับ'));
  t.cases.forEach((cs, i) => {
    const w = el('div', 'q');
    const row = el('div', 'row'); row.appendChild(el('b', null, `Test Case ${i + 1}`));
    const cp = el('button', 'btn small', 'คัดลอก prompt'); cp.onclick = () => { const p = hrPromptIssue(pa.value); if (p) { uiAlert(p); return; } copyText(pa.value.replace('{testcase input}', cs.input), cp); };
    row.appendChild(cp); const st = el('span'); row.appendChild(st); w.appendChild(row);
    const ans = el('textarea'); ans.rows = 2; ans.placeholder = 'วางคำตอบของ AI'; ans.value = S.caseOut[i] || '';
    const check = () => { const v = ans.value.trim(); st.className = !v ? 'muted' : v === cs.output ? 'pass' : 'fail'; st.textContent = !v ? '' : v === cs.output ? '✓ ตรง' : '✗ ไม่ตรง (expected ' + cs.output + ')'; };
    ans.oninput = () => { S.caseOut[i] = ans.value; save(); check(); }; check();
    w.appendChild(ans); c.appendChild(w);
  });
  box.appendChild(c);
}
function hrCodeView(box, S){
  const p = PROBLEMS.find(x => x.id === S.task), c = el('div', 'card');
  c.appendChild(el('h2', null, p.title));
  c.appendChild(el('p', 'b', p.desc)).style.whiteSpace = 'pre-wrap';
  c.appendChild(el('div', 'muted', 'เขียนเป็น JavaScript — ข้อสอบจริง (Q57) เลือก javascript ได้เหมือนกัน (มีให้เลือก 22 ภาษา รวม csharp)'));
  const ta = el('textarea'); ta.rows = 14; ta.spellcheck = false; ta.value = S.code == null ? p.starter : S.code;
  ta.oninput = () => { S.code = ta.value; save(); };
  c.appendChild(ta);
  const out = el('div', 'out'), run = el('button', 'btn green', '▶ Run Code (sample tests)');
  run.onclick = async () => { out.textContent = 'กำลังรัน...'; const tests = p.tests.filter(t => !t.gen).slice(0, 3); showResult(out, await runJs(ta.value, p.fn, tests), tests); };
  c.appendChild(el('div', 'row')).appendChild(run);
  c.appendChild(el('div', 'muted', 'มี hidden test และ performance test ตรวจตอนปิด section'));
  c.appendChild(out);
  box.appendChild(c);
}
function hrResultView(m, H){
  m.appendChild(el('h1', null, 'ผลการจำลอง HackerRank'));
  const c = el('div', 'card');
  const t = el('table'); t.innerHTML = '<tr><th>Section</th><th>คะแนน</th><th>เวลาที่ใช้</th></tr>';
  let sumOk = 0, sumN = 0;
  H.order.forEach(i => {
    const s = HR_SECTIONS[i], S = H.secs[s.id], g = S.grade;
    if (!s.kind) { sumOk += g.ok; sumN += g.n; }
    const tr = el('tr');
    tr.appendChild(el('td', null, s.name));
    tr.appendChild(el('td', g.pct >= 70 ? 'pass' : g.pct >= 50 ? 'warn' : 'fail', s.kind ? `${g.pct}% · ${g.note}` : `${g.ok}/${g.n} (${g.pct}%)`));
    tr.appendChild(el('td', null, `${Math.round(S.used / 60000)} / ${s.min} นาที`));
    t.appendChild(tr);
  });
  const tw = el('div', 'tw'); tw.appendChild(t); c.appendChild(tw);
  if (sumN) c.appendChild(el('p', 'b', `ปรนัยรวม ${sumOk}/${sumN} (${Math.round(sumOk / sumN * 100)}%) — เป้าหมาย Lead ต้องได้ ≥ 50% ทุกทักษะ และ ≥ 70% ใน Web/API`));
  const again = el('button', 'btn primary', 'กลับหน้าซ้อม'); again.onclick = () => { ST.hr = null; save(); render(); };
  c.appendChild(again);
  m.appendChild(c);
  m.appendChild(el('div', 'section-label', 'เฉลยและสิ่งที่ควรทบทวน'));
  H.order.forEach(i => {
    const s = HR_SECTIONS[i], S = H.secs[s.id], d = el('details', 'fold');
    d.appendChild(el('summary', null, `${s.name} — ${S.grade.pct}%`));
    const inner = el('div', 'inner'); d.appendChild(inner);
    if (!s.kind) {
      S.items.forEach((q, k) => {
        const ok = hrMcqOk(q, S.ans[k]); if (ok) return;
        const w = el('div', 'q');
        w.appendChild(el('div', 'qt', `${k + 1}. ${q.q}`));
        const ans = Array.isArray(q.a) ? q.a : [q.a], mine = S.ans[k] == null ? [] : [].concat(S.ans[k]);
        q.o.forEach((o, j) => w.appendChild(el('div', 'opt' + (ans.includes(j) ? ' correct' : mine.includes(j) ? ' wrong' : ''), o)));
        if (q.e) w.appendChild(el('div', 'explain', q.e));
        const l = lessonById(q.lid); if (l) { const a = el('a', 'btn small', 'ทบทวนบท ' + (CHIP[q.lid] || shortTitle(l))); a.href = '#/lesson/' + q.lid; w.appendChild(a); }
        inner.appendChild(w);
      });
      if (S.grade.ok === S.grade.n) inner.appendChild(el('p', 'pass', 'ถูกทุกข้อ'));
    } else if (s.kind === 'sql') {
      const tk = HR_SQL.find(x => x.id === S.task);
      inner.appendChild(el('p', 'muted', tk.tip)); inner.appendChild(el('div', 'muted', 'เฉลย:')); inner.appendChild(el('pre', null, tk.ref));
    } else if (s.kind === 'prompt') {
      const tk = HR_PROMPT.find(x => x.id === S.task);
      inner.appendChild(el('div', 'muted', 'ตัวอย่าง prompt ที่ดี:')); inner.appendChild(el('pre', null, tk.sample));
    } else {
      const p = PROBLEMS.find(x => x.id === S.task);
      inner.appendChild(el('p', 'muted', p.hint)); inner.appendChild(reveal('เฉลย JavaScript', p.sol)); inner.appendChild(reveal('เฉลย C#', p.cs));
    }
    m.appendChild(d);
  });
}
