/* ================= VIEWS + ROUTER ================= */
const ICON = {
  today: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4.5" width="18" height="16" rx="3"/><path d="M3 9.5h18M8 3v3M16 3v3"/><path d="m9 15 2 2 4-4"/></svg>',
  learn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/></svg>',
  practice: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="m8 7-5 5 5 5M16 7l5 5-5 5M13.5 4l-3 16"/></svg>',
  exam: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9.5 2h5"/></svg>'
};
const NAV = [['today', 'วันนี้'], ['learn', 'บทเรียน'], ['practice', 'ฝึกโจทย์'], ['exam', 'สอบ']];
const LEGACY = {plan: '/today', prog: '/practice/code', sql: '/practice/sql', prompt: '/practice/prompt'};
function parseRoute(){
  const h = location.hash.slice(1);
  if (h.startsWith('tab=')) { const t = h.slice(4); return (LEGACY[t] || '/learn').split('/').slice(1); }
  const parts = h.replace(/^\//, '').split('/').filter(Boolean);
  return parts.length ? parts : ['today'];
}
function nav(r){ location.hash = r; }
function render(){
  const [view, arg] = parseRoute(), m = document.getElementById('main');
  m.innerHTML = '';
  const n = document.getElementById('nav'); n.innerHTML = '';
  const active = view === 'lesson' ? 'learn' : view;
  NAV.forEach(([id, label]) => {
    const b = el('button', id === active ? 'on' : ''); b.innerHTML = ICON[id]; b.appendChild(el('span', null, label));
    b.onclick = () => nav('/' + (id === 'practice' ? 'practice/' + (ST.practice || 'mcq') : id)); n.appendChild(b);
  });
  const left = daysLeft();
  document.getElementById('countChip').textContent = left > 0 ? `อีก ${left} วันสอบ` : left === 0 ? 'วันนี้สอบ' : 'สอบแล้ว';
  if (view === 'learn') viewLearn(m);
  else if (view === 'lesson' && lessonById(arg)) viewLesson(m, lessonById(arg));
  else if (view === 'practice') viewPractice(m, arg || ST.practice || 'mcq');
  else if (view === 'exam') viewExam(m);
  else viewToday(m);
}
window.addEventListener('hashchange', () => { render(); window.scrollTo(0, 0); });

/* ---------- วันนี้ ---------- */
function unitRow(x, cls){
  const done = unitDone(x.u), a = el('a', 'item' + (done ? ' ok' : '') + (cls ? ' ' + cls : ''));
  a.href = unitRoute(x.u);
  a.appendChild(el('span', 'dot' + (done ? ' full' : '')));
  const mm = el('div', 'main'); mm.appendChild(el('div', 'ttl', x.u.t + (x.cont ? ' (ต่อ)' : '')));
  if (x.u.exam) mm.appendChild(el('div', 'sub', 'เปิดข้อสอบ · ติ๊กว่าเสร็จในตารางด้านล่างหลังสอบ'));
  a.appendChild(mm); a.appendChild(el('span', 'chev', '›'));
  return a;
}
function viewToday(m){
  const sc = ST.sched, today = ymd(new Date()), left = daysLeft();
  const plan = buildPlan(), todayP = plan.find(p => p.date === today);
  const hero = el('div', 'card hero');
  hero.appendChild(html('div', 'big', left > 0 ? `${left}<small>วันก่อนสอบ</small>` : left === 0 ? 'วันนี้สอบ' : 'สอบแล้ว'));
  hero.appendChild(el('div', 'muted', 'วันสอบ ' + thDate(sc.examDate) + ' ' + (parseYmd(sc.examDate).getFullYear() + 543) + ' · เป้าหมาย ' + role()));
  const done = UNITS.filter(unitDone).length;
  const pr = el('div', 'progress'), f = el('div'); f.style.width = (done / UNITS.length * 100) + '%'; pr.appendChild(f);
  hero.appendChild(pr);
  const passed = LESSONS.filter(l => lessonPassed(l.id)).length;
  const both = LESSONS.filter(l => ST.pre[l.id] && !ST.pre[l.id].skip && ST.post[l.id]);
  const avg = fn => Math.round(both.reduce((s, l) => s + fn(l), 0) / both.length);
  hero.appendChild(el('div', 'muted', `เสร็จ ${done}/${UNITS.length} หน่วย · เข้าใจแล้ว ${passed}/${LESSONS.length} บท` +
    (both.length ? ` · pre ${avg(l => ST.pre[l.id].pct)}% → post ${avg(l => ST.post[l.id].best)}%` : '')));
  m.appendChild(hero);

  m.appendChild(el('div', 'section-label', 'วันนี้'));
  const c = el('div', 'card');
  if (!todayP) {
    const next = plan.find(p => p.date > today);
    c.appendChild(el('div', 'empty', next ? `วันนี้ไม่มีตารางเรียน · ครั้งถัดไป ${thDate(next.date)}` : 'ไม่มีตารางเรียนที่เหลือ'));
    const pending = UNITS.find(u => !unitDone(u));
    if (pending) { c.appendChild(el('div', 'muted', 'อยากเรียนต่อ:')); c.appendChild(unitRow({u: pending})); }
  } else todayP.items.forEach(x => c.appendChild(unitRow(x)));
  m.appendChild(c);

  const fold = (title, open) => { const d = el('details', 'fold'); if (open) d.open = true; d.appendChild(el('summary', null, title)); const i = el('div', 'inner'); d.appendChild(i); m.appendChild(d); return i; };
  const t1 = fold(`ตารางเรียนทั้งหมด (${plan.length} วัน)`);
  if (!plan.length) t1.appendChild(el('p', 'warn', 'ไม่มีวันเรียนเหลือ — ตรวจวันสอบและวันที่เลือกในการแจ้งเตือน'));
  plan.forEach(p => {
    const box = el('div'); box.style.margin = '10px 0 4px';
    box.appendChild(el('div', 'muted', thDate(p.date) + (p.date === today ? ' · วันนี้' : '')));
    p.items.forEach(x => {
      const r = unitRow(x, p.date < today ? 'past' : '');
      if (x.u.manual) {
        const cb = el('input'); cb.type = 'checkbox'; cb.checked = !!ST.units[x.u.id]; cb.title = 'ทำเครื่องหมายว่าเสร็จ';
        cb.onclick = e => e.stopPropagation();
        cb.onchange = () => { ST.units[x.u.id] = cb.checked; save(); render(); };
        r.insertBefore(cb, r.lastChild);
      }
      box.appendChild(r);
    });
    t1.appendChild(box);
  });
  const rb = el('button', 'btn small', 'จัดตารางใหม่จากวันนี้ (เฉพาะที่ยังไม่เสร็จ)');
  rb.onclick = async () => { if (!await uiConfirm('หน่วยที่ยังไม่เสร็จจะถูกกระจายลงวันที่เหลือ ตั้งแต่วันนี้ถึงวันก่อนสอบ', {title: 'จัดตารางใหม่?', ok: 'จัดตารางใหม่'})) return; sc.start = today; sc.units = UNITS.filter(u => !unitDone(u)).map(u => u.id); save(); sendSchedule(); render(); };
  t1.appendChild(el('p', 'muted', 'หน่วยบทเรียนจะเสร็จอัตโนมัติเมื่อผ่าน post-test และโจทย์ครบ · หน่วยสอบให้ติ๊กเอง'));
  t1.appendChild(rb);

  const t2 = fold('เวลาเรียนและแจ้งเตือน', !IN_APP ? false : false);
  const fm = el('div', 'form');
  const ex = el('input'); ex.type = 'date'; ex.value = sc.examDate;
  const tm = el('input'); tm.type = 'time'; tm.value = sc.time;
  fm.appendChild(labeled('วันสอบ', ex)); fm.appendChild(labeled('เวลาแจ้งเตือน', tm));
  t2.appendChild(fm);
  t2.appendChild(el('div', 'muted', 'วันที่เรียน'));
  const dr = el('div', 'row'), picked = new Set(sc.days);
  [1, 2, 3, 4, 5, 6, 0].forEach(d => { const b = el('button', 'day' + (picked.has(d) ? ' on' : ''), DOW[d]); b.onclick = () => { picked.has(d) ? picked.delete(d) : picked.add(d); b.classList.toggle('on'); }; dr.appendChild(b); });
  t2.appendChild(dr);
  const ar = el('div', 'row');
  const sv = el('button', 'btn primary', IN_APP ? 'บันทึกและตั้งแจ้งเตือน' : 'บันทึก');
  sv.onclick = () => {
    if (!ex.value || !tm.value || !picked.size) { uiAlert('เลือกวันสอบ เวลา และวันเรียนอย่างน้อย 1 วัน', {title: 'ข้อมูลยังไม่ครบ'}); return; }
    sc.examDate = ex.value; sc.time = tm.value; sc.days = [...picked].sort(); save();
    const n = sendSchedule(true); render();
    const st = document.getElementById('notifStatus'); if (st) st.textContent = IN_APP ? `กำลังตั้งแจ้งเตือน ${n} ครั้ง…` : 'บันทึกแล้ว';
  };
  ar.appendChild(sv);
  if (IN_APP) { const tb = el('button', 'btn', 'ทดสอบแจ้งเตือน'); tb.onclick = () => bridge({type: 'test'}); ar.appendChild(tb); }
  t2.appendChild(ar);
  const ns = el('div', 'muted'); ns.id = 'notifStatus';
  ns.textContent = IN_APP ? `เตือนทุกวันเรียนเวลา ${sc.time} จนถึงวันสอบ` : 'แจ้งเตือนใช้ได้ในแอป Android เท่านั้น';
  t2.appendChild(ns);
  if (IN_APP) t2.appendChild(el('p', 'muted', 'ถ้าแจ้งเตือนไม่ดัง (vivo/OPPO/Xiaomi): ตั้งแบตเตอรี่ของแอปเป็น "ไม่จำกัด" และเปิด "เริ่มอัตโนมัติ"'));

  const t3 = fold(`เป้าหมายและเกณฑ์ · ${role()} · ผ่าน ${passPct()}%`);
  const segOf = (opts, cur, fn, label) => {
    t3.appendChild(el('div', 'muted', label));
    const sg = el('div', 'seg');
    opts.forEach(o => { const b = el('button', String(o) === String(cur) ? 'on' : '', String(o) + (typeof o === 'number' ? '%' : '')); b.onclick = () => fn(o); sg.appendChild(b); });
    t3.appendChild(sg);
  };
  const keepOpen = () => { render(); const f = [...document.querySelectorAll('details.fold')].find(d => /เป้าหมายและเกณฑ์/.test(d.textContent)); if (f) f.open = true; };
  segOf(ROLES, role(), r => { ST.target.role = r; save(); keepOpen(); }, 'ระดับเป้าหมาย (ใช้กับหน้าข้อสอบด้วย)');
  segOf(PASS_OPTIONS, passPct(), v => { ST.target.pass = v; save(); keepOpen(); }, 'post-test ต้องได้เท่าไรจึงนับว่า "เข้าใจแล้ว"');
  const cnt = lv => COMPS.filter(c => need(c[2]) === lv).length;
  t3.appendChild(html('p', 'b', `ระดับ <b>${role()}</b> ต้องได้ Advance (≥ ${CUT.A}%) ${cnt('A')} ทักษะ · Intermediate (≥ ${CUT.I}%) ${cnt('I')} ทักษะ · Beginner (≥ ${CUT.B}%) ${cnt('B')} ทักษะ — ข้อ B/I/A ได้ 1/2/3 คะแนน`));
  const tw = el('div', 'tw'), t = el('table');
  t.innerHTML = '<tr><th>ทักษะ</th><th>น้ำหนัก</th><th>ต้องได้</th></tr>';
  COMPS.forEach(([n, w, k]) => { const tr = el('tr'); tr.appendChild(el('td', null, n.replace(' (Advance)', ''))); tr.appendChild(el('td', null, w.toFixed(2) + '%')); const lt = el('td'); lt.appendChild(lvTag(need(k))); tr.appendChild(lt); t.appendChild(tr); });
  tw.appendChild(t); t3.appendChild(tw);

  const rs = el('button', 'btn small', 'ล้างความคืบหน้า'); rs.style.marginTop = '22px'; rs.onclick = resetProgress; m.appendChild(rs);
}
function labeled(text, input){ const l = el('label', 'fld'); l.appendChild(el('span', 'muted', text)); l.appendChild(input); return l; }

/* ---------- บทเรียน (รายการ) ---------- */
function lessonDot(id){ return lessonPassed(id) ? 'dot full' : ST.pre[id] ? 'dot half' : 'dot'; }
function viewLearn(m){
  m.appendChild(el('h1', null, 'บทเรียน'));
  m.appendChild(el('p', 'muted', `ทุกบท: pre-test → เรียน → post-test (ผ่าน ≥ ${passPct()}% = เข้าใจแล้ว) · เป้าหมาย ${role()}`));
  GROUPS.forEach(([g, ids]) => {
    m.appendChild(el('div', 'section-label', g));
    const c = el('div', 'card'); c.style.padding = '2px 16px';
    ids.map(lessonById).filter(Boolean).forEach(l => {
      const a = el('a', 'item'); a.href = '#/lesson/' + l.id;
      a.appendChild(el('span', lessonDot(l.id)));
      const mm = el('div', 'main'); mm.appendChild(el('div', 'ttl', shortTitle(l)));
      const p = ST.post[l.id];
      mm.appendChild(el('div', 'sub', (p ? (lessonPassed(l.id) ? `เข้าใจแล้ว · ${p.best}%` : `post ${p.best}% · ยังไม่ผ่าน`) : ST.pre[l.id] ? 'กำลังเรียน' : `~${l.min} นาที`) + ' · ต้องได้ ' + LV[lessonNeed(l)]));
      a.appendChild(mm); a.appendChild(el('span', 'chev', '›'));
      c.appendChild(a);
    });
    m.appendChild(c);
  });
}

/* ---------- บทเรียน (หน้าบท): pre-test → บทเรียน → post-test ---------- */
const PRACTICE_AFTER = {algo: 'code', sqlt: 'sql', pc: 'prompt'};
function viewLesson(m, l){
  const b = el('a', 'back', '← บทเรียน'); b.href = '#/learn'; m.appendChild(b);
  m.appendChild(el('h1', null, shortTitle(l)));
  m.appendChild(el('div', 'muted', subTitle(l)));
  const meta = el('div', 'meta');
  meta.appendChild(el('span', 'tag', l.comp + ' · ' + l.w.toFixed(2) + '%'));
  meta.appendChild(lvTag(lessonNeed(l)));
  meta.appendChild(el('span', 'tag', '~' + l.min + ' นาที'));
  m.appendChild(meta);
  const body = el('div'); m.appendChild(body);
  fillLesson(l, body, meta);
}
function renderBlocks(box, blocks){
  blocks.forEach(b => {
    if (b.h) box.appendChild(el('h3', null, b.h));
    else if (b.p) box.appendChild(html('p', 'b', b.p));
    else if (b.ul || b.ol) { const l = el(b.ul ? 'ul' : 'ol', 'b'); (b.ul || b.ol).forEach(x => l.appendChild(html('li', null, x))); box.appendChild(l); }
    else if (b.table) {
      const tw = el('div', 'tw'), t = el('table');
      b.table.forEach((r, i) => { const tr = el('tr'); r.forEach(c => tr.appendChild(html(i ? 'td' : 'th', null, c))); t.appendChild(tr); });
      tw.appendChild(t); box.appendChild(tw);
    }
    else if (b.code) box.appendChild(el('pre', null, b.code));
    else if (b.traps) { const d = el('div', 'traps'); d.appendChild(el('b', null, 'กับดักในข้อสอบ')); const l = el('ul', 'b'); b.traps.forEach(x => l.appendChild(html('li', null, x))); d.appendChild(l); box.appendChild(d); }
  });
}
function shuffle(a){ a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
// สลับลำดับข้อและตัวเลือก (คืนสำเนา ไม่แก้ข้อมูลต้นฉบับ)
function shuffledQs(qs){ return shuffle(qs).map(q => { const idx = shuffle(q.o.map((_, i) => i)); return Object.assign({}, q, {o: idx.map(i => q.o[i]), a: idx.indexOf(q.a)}); }); }
const postQs = l => (POST[l.id] || []).concat(l.quiz);
function lessonTags(l, meta){
  meta.querySelectorAll('.tag.st').forEach(t => t.remove());
  const p = ST.pre[l.id], t = ST.post[l.id];
  if (p) meta.appendChild(el('span', 'tag st', p.skip ? (p.read ? 'อ่านก่อน' : 'pre: ข้าม') : `pre ${p.pct}%`));
  if (t) meta.appendChild(el('span', 'tag st' + (lessonPassed(l.id) ? ' done' : ''), lessonPassed(l.id) ? `เข้าใจแล้ว · ${t.best}%` : `post ${t.best}%`));
}
function fillLesson(l, body, meta, startPre){
  lessonTags(l, meta);
  const refill = () => { body.innerHTML = ''; fillLesson(l, body, meta); };
  const pre = ST.pre[l.id], post = ST.post[l.id];
  const sp = el('div', 'stepper'); [true, !!pre, !!pre && !!post].forEach(on => sp.appendChild(el('span', on ? 'on' : ''))); body.appendChild(sp);
  body.appendChild(stepHead(1, pre || startPre ? 'Pre-test' : 'เริ่มบทเรียน', pre ? (pre.skip ? 'ข้าม' : `${pre.ok}/${pre.n}`) : ''));
  if (!pre && !startPre) {
    // ให้เลือกเองว่าจะวัดผลก่อน หรืออ่านเนื้อหาเลย
    body.appendChild(el('p', 'muted', 'เลือกวิธีเริ่มบทนี้'));
    const pick = (title, desc, tag, primary, fn) => {
      const b = el('button', 'choice' + (primary ? ' rec' : ''));
      const top = el('div', 'ch-top'); top.appendChild(el('b', null, title)); if (tag) top.appendChild(el('span', 'tag lv-I', tag));
      b.appendChild(top); b.appendChild(el('div', 'muted', desc)); b.onclick = fn; body.appendChild(b);
    };
    pick('ทำ pre-test ก่อน', `${l.quiz.length} ข้อ ประมาณ 2 นาที · รู้ว่าตัวเองรู้อะไรแล้ว แล้วเทียบผลกับ post-test ได้`, 'แนะนำ', true,
      () => { body.innerHTML = ''; fillLesson(l, body, meta, true); });
    pick('อ่านเนื้อหาเลย', 'ข้ามการวัดผลก่อนเรียน ยังทำ post-test ท้ายบทได้ตามปกติ (แต่จะไม่มีคะแนนก่อน–หลังให้เทียบ)', '', false,
      () => { ST.pre[l.id] = {skip: true, read: true}; save(); refill(); window.scrollTo(0, 0); });
    return;
  }
  if (!pre) {
    body.appendChild(el('p', 'muted', `${l.quiz.length} ข้อ ตอบตามที่รู้จริง ไม่รู้ให้เลือก "ยังไม่รู้" — ใช้วัดว่าเรียนแล้วเข้าใจขึ้นเท่าไร ไม่มีผลต่อการผ่าน`));
    body.appendChild(renderTest(shuffledQs(l.quiz), {dontKnow: true, label: 'ส่ง pre-test', onDone: (ok, n, res) => {
      ST.pre[l.id] = {ok, n, pct: Math.round(ok / n * 100), at: Date.now()}; save(); lessonTags(l, meta);
      const go = el('button', 'btn primary', 'เริ่มเรียน →'); go.onclick = () => { refill(); window.scrollTo(0, 0); };
      res.parentNode.appendChild(go);
    }}));
    const back = el('button', 'btn small', 'เปลี่ยนใจ — อ่านเนื้อหาเลย');
    back.onclick = () => { ST.pre[l.id] = {skip: true, read: true}; save(); refill(); window.scrollTo(0, 0); };
    body.appendChild(back);
    return;
  }
  body.appendChild(stepHead(2, 'เรียน', ''));
  const content = el('div', 'content'); renderBlocks(content, l.blocks); body.appendChild(content);
  const qs = postQs(l);
  body.appendChild(stepHead(3, 'Post-test', post ? `ดีที่สุด ${post.best}% · ${post.tries} ครั้ง` : ''));
  body.appendChild(el('p', 'muted', `${qs.length} ข้อ มีข้อใหม่ที่ไม่เคยเห็น · ต้องได้ ≥ ${passPct()}% · ทำใหม่ได้ ข้อจะสลับทุกครั้ง`));
  body.appendChild(renderTest(shuffledQs(qs), {label: 'ส่ง post-test', onDone: (ok, n, res) => {
    const pct = Math.round(ok / n * 100), prev = ST.post[l.id] || {best: 0, tries: 0, pass: false};
    ST.post[l.id] = {best: Math.max(prev.best, pct), last: pct, tries: prev.tries + 1, pass: prev.pass || pct >= passPct(), at: Date.now()};
    if (ST.post[l.id].pass) ST.lessons[l.id] = true;
    save(); lessonTags(l, meta);
    const p = ST.pre[l.id];
    res.className = pct >= passPct() ? 'pass' : 'warn';
    res.textContent = pct >= passPct()
      ? `ผ่าน ${pct}%` + (p && !p.skip ? ` (pre ${p.pct}% → ${pct}%)` : '') + ' — เข้าใจบทนี้แล้ว'
      : `ได้ ${pct}% ยังไม่ถึง ${passPct()}% — อ่านคำอธิบายข้อที่ผิด ทบทวนหัวข้อนั้น แล้วทำใหม่`;
    const row = res.parentNode;
    const again = el('button', 'btn', 'ทำใหม่ (สลับข้อ)'); again.onclick = refill; row.appendChild(again);
    if (pct >= passPct()) {
      if (PRACTICE_AFTER[l.id]) { const a = el('a', 'btn primary', 'ไปฝึกโจทย์ →'); a.href = '#/practice/' + PRACTICE_AFTER[l.id]; row.appendChild(a); }
      else { const a = el('a', 'btn primary', 'กลับหน้าวันนี้'); a.href = '#/today'; row.appendChild(a); }
    }
  }}));
}
function stepHead(n, t, info){ const h = el('div', 'step'); h.appendChild(el('span', 'num', String(n))); h.appendChild(el('span', 'st', t)); if (info) h.appendChild(el('span', 'tag', info)); return h; }
// แบบทดสอบปรนัย: opts.dontKnow เพิ่มตัวเลือก "ยังไม่รู้" · ต้องตอบครบก่อนส่ง
function renderTest(qs, opts){
  const box = el('div'), picks = {};
  const ui = qs.map((q, i) => {
    const w = el('div', 'q'); w.appendChild(el('div', 'qt', `${i + 1}. ${q.q}`));
    const choices = q.o.slice(); if (opts.dontKnow) choices.push('ยังไม่รู้');
    const btns = choices.map((o, k) => {
      const idk = opts.dontKnow && k === q.o.length;
      const b = el('button', 'opt' + (idk ? ' idk' : ''), (idk ? '' : String.fromCharCode(65 + k) + '. ') + o);
      b.onclick = () => { if (box.dataset.checked) return; picks[i] = k; btns.forEach((x, j) => x.classList.toggle('sel', j === k)); };
      w.appendChild(b); return b;
    });
    const ex = el('div', 'explain hidden'); w.appendChild(ex);
    box.appendChild(w); return {btns, ex};
  });
  const row = el('div', 'row'), res = el('span', 'muted');
  const chk = el('button', 'btn primary', opts.label || 'ตรวจคำตอบ');
  chk.onclick = () => {
    if (box.dataset.checked) return;
    const missing = qs.findIndex((_, i) => picks[i] == null);
    if (missing >= 0) { res.className = 'warn'; res.textContent = `ยังไม่ได้ตอบข้อ ${missing + 1}`; ui[missing].btns[0].scrollIntoView({block: 'center'}); return; }
    box.dataset.checked = '1'; chk.disabled = true; let ok = 0;
    qs.forEach((q, i) => {
      const right = picks[i] === q.a; if (right) ok++;
      ui[i].btns.forEach((b, k) => { b.classList.remove('sel'); if (k === q.a) b.classList.add('correct'); else if (picks[i] === k) b.classList.add('wrong'); });
      ui[i].ex.textContent = (right ? '✓ ถูก' : '✗ คำตอบคือ ' + String.fromCharCode(65 + q.a)) + (q.e ? ' — ' + q.e : '');
      ui[i].ex.classList.remove('hidden');
    });
    res.className = 'muted'; res.textContent = `ได้ ${ok}/${qs.length}`;
    opts.onDone && opts.onDone(ok, qs.length, res, qs.map((q, i) => picks[i] === q.a));
  };
  row.appendChild(chk); row.appendChild(res); box.appendChild(row);
  return box;
}

/* ---------- ฝึกโจทย์ ---------- */
function viewPractice(m, kind){
  if (!['mcq', 'code', 'sql', 'prompt'].includes(kind)) kind = 'mcq';
  ST.practice = kind; save();
  m.appendChild(el('h1', null, 'ฝึกโจทย์'));
  const seg = el('div', 'seg');
  [['mcq', 'ปรนัย', `${allDrillQs(LESSONS.map(l => l.id)).length} ข้อ`], ['code', 'Coding', `${PROBLEMS.filter(p => ST.prob[p.id]).length}/${PROBLEMS.length}`],
   ['sql', 'SQL', `${SQL_EX.filter((_, i) => ST.sql[i]).length}/${SQL_EX.length}`], ['prompt', 'Prompt', `${PROMPT_TASKS.filter(t => ST.prompt[t.id]).length}/${PROMPT_TASKS.length}`]]
    .forEach(([k, label, cnt]) => { const b = el('button', k === kind ? 'on' : '', label); b.appendChild(el('small', null, cnt)); b.onclick = () => nav('/practice/' + k); seg.appendChild(b); });
  m.appendChild(seg);
  if (kind === 'mcq') return viewDrill(m);
  const lesson = {code: 'algo', sql: 'sqlt', prompt: 'pc'}[kind], l = lessonById(lesson);
  if (l && !lessonPassed(lesson)) {
    const a = el('a', 'item card'); a.href = '#/lesson/' + lesson; a.style.padding = '12px 16px';
    a.appendChild(el('span', lessonDot(lesson)));
    const mm = el('div', 'main'); mm.appendChild(el('div', 'ttl', 'แนะนำ: เรียนบท ' + shortTitle(l) + ' ก่อน')); mm.appendChild(el('div', 'sub', subTitle(l)));
    a.appendChild(mm); a.appendChild(el('span', 'chev', '›')); m.appendChild(a);
  }
  if (kind === 'code') renderProblems(m);
  else if (kind === 'sql') renderSqlLab(m);
  else renderPromptLab(m);
}

/* ---------- ฝึกปรนัย: สุ่มจากคลังทั้งหมด (pre-test + post-test + BANK) ตามบทที่เลือก ---------- */
let drillRun = null;  // ชุดที่กำลังทำ (ไม่บันทึก — รีเฟรชแล้วเริ่มใหม่)
const qKey = q => q.lid + '|' + q.q.slice(0, 48);
function allDrillQs(ids){
  return ids.flatMap(id => { const l = lessonById(id); return [].concat(l ? l.quiz : [], POST[id] || [], BANK[id] || []).map(q => Object.assign({lid: id}, q)); });
}
function drillStats(id){ const d = (ST.drill || {})[id]; return d && d.n ? {n: d.n, pct: Math.round(d.ok / d.n * 100)} : null; }
function viewDrill(m){
  ST.drill = ST.drill || {}; ST.wrongQs = ST.wrongQs || {}; ST.drillCfg = ST.drillCfg || {ids: LESSONS.map(l => l.id), n: 20, mode: 'all'};
  const cfg = ST.drillCfg;
  if (drillRun) {
    const c = el('div', 'card');
    c.appendChild(el('h2', null, `ชุดฝึก ${drillRun.length} ข้อ`));
    c.appendChild(el('p', 'muted', 'ตอบครบแล้วกดส่ง จะเห็นเฉลยพร้อมคำอธิบายทุกข้อ'));
    c.appendChild(renderTest(drillRun, {label: 'ส่งคำตอบ', onDone: (ok, n, res, results) => {
      drillRun.forEach((q, i) => {
        const d = ST.drill[q.lid] = ST.drill[q.lid] || {n: 0, ok: 0}; d.n++; if (results[i]) d.ok++;
        const k = qKey(q); if (results[i]) delete ST.wrongQs[k]; else ST.wrongQs[k] = 1;
      });
      save();
      const pct = Math.round(ok / n * 100);
      res.className = pct >= 80 ? 'pass' : pct >= 50 ? 'warn' : 'fail';
      res.textContent = `ได้ ${ok}/${n} (${pct}%)`;
      const again = el('button', 'btn primary', 'ทำชุดใหม่'); again.onclick = () => { drillRun = null; render(); window.scrollTo(0, 0); };
      res.parentNode.appendChild(again);
    }}));
    const quit = el('button', 'btn small', 'เลิกทำชุดนี้'); quit.onclick = () => { drillRun = null; render(); };
    m.appendChild(c); m.appendChild(quit);
    return;
  }
  const c = el('div', 'card');
  c.appendChild(el('h2', null, 'ตั้งค่าชุดฝึก'));
  c.appendChild(el('div', 'muted', 'บทที่ต้องการ'));
  const chips = el('div', 'row'), picked = new Set(cfg.ids);
  const allBtn = el('button', 'chipbtn' + (picked.size === LESSONS.length ? ' on' : ''), picked.size === LESSONS.length ? 'ล้างที่เลือก' : 'เลือกทุกบท');
  allBtn.onclick = () => { if (picked.size === LESSONS.length) picked.clear(); else LESSONS.forEach(l => picked.add(l.id)); cfg.ids = [...picked]; save(); render(); };
  chips.appendChild(allBtn);
  GROUPS.forEach(([, ids]) => ids.forEach(id => {
    const l = lessonById(id); if (!l) return;
    const b = el('button', 'chipbtn' + (picked.has(id) ? ' on' : ''), CHIP[id] || shortTitle(l));
    b.onclick = () => { picked.has(id) ? picked.delete(id) : picked.add(id); cfg.ids = [...picked]; save(); render(); };
    chips.appendChild(b);
  }));
  c.appendChild(chips);
  const segOf = (label, opts, cur, fn) => {
    c.appendChild(el('div', 'muted', label));
    const sg = el('div', 'seg');
    opts.forEach(([v, t]) => { const b = el('button', v === cur ? 'on' : '', t); b.onclick = () => { fn(v); save(); render(); }; sg.appendChild(b); });
    c.appendChild(sg);
  };
  const pool = allDrillQs(cfg.ids), wrongPool = pool.filter(q => ST.wrongQs[qKey(q)]);
  segOf('จำนวนข้อ', [[10, '10 ข้อ'], [20, '20 ข้อ'], [30, '30 ข้อ']], cfg.n, v => cfg.n = v);
  segOf('เลือกข้อจาก', [['all', `สุ่มทั้งหมด (${pool.length})`], ['wrong', `เคยตอบผิด (${wrongPool.length})`]], cfg.mode, v => cfg.mode = v);
  const src = cfg.mode === 'wrong' ? wrongPool : pool;
  const start = el('button', 'btn primary block', src.length ? `เริ่มฝึก ${Math.min(cfg.n, src.length)} ข้อ` : 'ยังไม่มีข้อให้ฝึก');
  start.disabled = !src.length;
  start.onclick = () => { drillRun = shuffledQs(shuffle(src).slice(0, cfg.n)); render(); window.scrollTo(0, 0); };
  c.appendChild(start);
  m.appendChild(c);
  // สถิติรายบท — เรียงจากแม่นน้อยสุด เพื่อชี้จุดอ่อน
  const rows = LESSONS.map(l => ({l, s: drillStats(l.id)})).filter(x => x.s).sort((a, b) => a.s.pct - b.s.pct);
  m.appendChild(el('div', 'section-label', 'ความแม่นรายบท (จากการฝึก)'));
  const st = el('div', 'card');
  if (!rows.length) st.appendChild(el('div', 'empty', 'ยังไม่มีสถิติ — ลองฝึกสักชุด'));
  rows.forEach(({l, s}) => {
    const r = el('a', 'item'); r.href = '#/lesson/' + l.id;
    const mm = el('div', 'main'); mm.appendChild(el('div', 'ttl', shortTitle(l)));
    mm.appendChild(el('div', 'sub', `ตอบไป ${s.n} ข้อ · ถูก ${s.pct}%` + (s.pct < 70 ? ' · ควรทบทวน' : '')));
    const bar = el('div', 'progress'), f = el('div'); f.style.width = s.pct + '%'; if (s.pct < 70) f.style.background = 'var(--yellow)'; bar.appendChild(f); mm.appendChild(bar);
    r.appendChild(mm); r.appendChild(el('span', 'chev', '›')); st.appendChild(r);
  });
  m.appendChild(st);
}

/* ---------- สอบ ---------- */
function viewExam(m){
  m.appendChild(el('h1', null, 'ข้อสอบจำลอง'));
  m.appendChild(el('p', 'muted', `V1 61 ข้อ · V2 46 ข้อ · ให้คะแนนถ่วงน้ำหนักและเทียบเกณฑ์ระดับ ${role()} รายทักษะ (เปลี่ยนเป้าหมายได้ที่หน้าวันนี้)`));
  [['final', 'Final — จับเวลาเหมือนสอบจริง', 'นับถอยหลัง หมดเวลาส่งอัตโนมัติ · ปิดแอปแล้วเวลายังเดิน · เตือนเมื่อเหลือ 10/5/1 นาที'],
   ['practice', 'ฝึกซ้อม — ไม่จับเวลา', 'ทำสบาย ๆ ส่งเมื่อพร้อม ดูเฉลยละเอียดหลังส่ง']].forEach(([k, t, d]) => {
    const a = el('a', 'card exam-card'); a.href = 'competency-2026-exam.html#' + k;
    a.appendChild(el('b', null, t)); a.appendChild(el('div', 'muted', d)); m.appendChild(a);
  });
  let h = []; try { h = JSON.parse(localStorage.getItem(HIST_KEY) || '[]'); } catch (e) {}
  m.appendChild(el('div', 'section-label', 'ประวัติการสอบ'));
  const c = el('div', 'card');
  if (!h.length) c.appendChild(el('div', 'empty', 'ยังไม่เคยสอบ — เริ่มจาก V2 แบบ Final เพื่อวัดระดับ'));
  else {
    const t = el('table'); t.innerHTML = '<tr><th>วันที่</th><th>ชุด</th><th>โหมด</th><th>คะแนน</th><th>ถึงเกณฑ์</th></tr>';
    h.slice().reverse().forEach(x => {
      const tr = el('tr'), d = new Date(x.at);
      [`${d.getDate()} ${MON[d.getMonth()]}`, x.ver.toUpperCase(), x.mode === 'final' ? 'Final' : 'ฝึก', x.pct.toFixed(1) + '%', `${x.meet}/${x.covered}`].forEach(v => tr.appendChild(el('td', null, v)));
      t.appendChild(tr);
    });
    const tw = el('div', 'tw'); tw.appendChild(t); c.appendChild(tw);
  }
  m.appendChild(c);
}
