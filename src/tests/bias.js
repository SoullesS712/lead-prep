// ตรวจว่าความยาวตัวเลือกไม่บอกใบ้คำตอบ: ข้อถูกต้องไม่ใช่ข้อที่ยาวสุด/สั้นสุดบ่อยเกิน
// และไม่มีข้อไหนที่ข้อถูกยาวกว่าข้ออื่นแบบเห็นชัด (≥ 1.3 เท่า)
// รัน: node src/tests/bias.js   (exit code 1 ถ้าไม่ผ่าน)
const fs = require('fs'), path = require('path');
const SRC = path.join(__dirname, '..');
const src = ['lessons1.js', 'lessons2.js', 'prog.js', 'labs.js', 'posttests.js', 'bank.js']
  .filter(f => fs.existsSync(path.join(SRC, f))).map(f => fs.readFileSync(path.join(SRC, f), 'utf8')).join('\n');
const m = {}; new Function('m', src + ';m.L=LESSONS;m.P=POST;m.B=typeof BANK!=="undefined"?BANK:{}')(m);
const html = fs.readFileSync(path.join(SRC, '..', 'competency-2026-exam.html'), 'utf8');
const js = html.slice(html.indexOf('<script>') + 8, html.lastIndexOf('</script>'));
const e = {}; new Function('e', js.split('/* ---------- state ---------- */')[0] + ';e.V1=Q_V1;e.V2=Q_V2')(e);

const len = s => [...String(s)].length;
const LIMIT = 0.35, FLOOR = 0.15, RATIO = 1.3;  // ข้อถูกยาวสุดควรอยู่ราว 15–35% (เดาสุ่ม = 25%)
let fail = false;
function check(name, qs){
  qs = qs.filter(q => q.o);
  if (!qs.length) { console.log(`- ${name.padEnd(12)} (ยังไม่มีข้อ)`); return; }
  let longest = 0, shortest = 0; const blatant = [];
  for (const q of qs) {
    const L = q.o.map(len), c = L[q.a], others = L.filter((_, i) => i !== q.a);
    if (c > Math.max(...others)) longest++;
    if (c < Math.min(...others)) shortest++;
    if (c >= Math.max(...others) * RATIO) blatant.push(q.q.slice(0, 60));
    if (q.a < 0 || q.a >= q.o.length) { console.log('  ✗ bad answer index:', q.q.slice(0, 60)); fail = true; }
  }
  const pl = longest / qs.length, ps = shortest / qs.length;
  const ok = !qs.length || (pl <= LIMIT && pl >= FLOOR && ps <= LIMIT && !blatant.length);
  console.log(`${ok ? '✓' : '✗'} ${name.padEnd(12)} n=${String(qs.length).padStart(3)}  ถูก=ยาวสุด ${Math.round(pl * 100)}%  ถูก=สั้นสุด ${Math.round(ps * 100)}%  ยาวกว่าชัด ${blatant.length}`);
  blatant.forEach(t => console.log('    ', t));
  if (!ok) fail = true;
}
check('pre-test', m.L.flatMap(l => l.quiz));
check('post-test', Object.values(m.P).flat());
check('bank', Object.values(m.B).flat());
check('exam V1', e.V1);
check('exam V2', e.V2);
process.exit(fail ? 1 : 0);
