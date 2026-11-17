// ตรวจโจทย์ Prompt Lab: เฉลยผ่านทุก test และตัวอย่าง prompt ผ่านกติกา "ห้ามมีโค้ด" ของหน้าเว็บจริง
// รัน: node src/tests/prompt_check.js
const fs = require('fs'), path = require('path');
const SRC = path.join(__dirname, '..');
const src = ['labs.js', 'prompt2.js', 'runner.js'].map(f => fs.readFileSync(path.join(SRC, f), 'utf8')).join('\n');
const m = {}; new Function('m', src + ';m.T=PROMPT_TASKS;m.issue=promptIssue')(m);
let bad = 0;
for (const t of m.T) {
  const f = new Function(t.sol + ';return ' + t.fn)();
  let pass = 0;
  for (const x of t.tests) {
    const o = f(...x.args);
    if (JSON.stringify(o) === JSON.stringify(x.expected)) pass++;
    else { bad++; console.log('  ✗', t.id, x.n, JSON.stringify(x.args), 'got', JSON.stringify(o), 'expected', JSON.stringify(x.expected)); }
  }
  const issue = m.issue(t.sample);
  if (issue) bad++;
  console.log(`${pass === t.tests.length && !issue ? '✓' : '✗'} ${t.id} ${t.title}: tests ${pass}/${t.tests.length}, sample prompt ${issue ? 'ผิดกติกา: ' + issue : 'ผ่านกติกา'}`);
}
process.exit(bad ? 1 : 0);
