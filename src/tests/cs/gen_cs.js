// สร้าง Solution.cs (เฉลย C# ทุกข้อ) + tests.json (ทุก test รวม performance) สำหรับรันตรวจด้วย .NET
const fs = require('fs'), path = require('path');
const S = path.join(__dirname, '..', '..') + '/', OUT = __dirname;
const src = ['prog.js', 'prog2.js', 'prog3.js'].map(f => fs.readFileSync(S + f, 'utf8')).join('\n');
const LESSONS = []; const m = {}; new Function('LESSONS', 'm', src + ';m.P=PROBLEMS;m.G=GEN')(LESSONS, m);
const pascal = s => s[0].toUpperCase() + s.slice(1);
const indent = t => t.split('\n').map(l => '    ' + l).join('\n');
const cs = `using System;\nusing System.Linq;\nusing System.Collections.Generic;\n\npublic static class Solution\n{\n${m.P.map(p => indent(p.cs)).join('\n\n')}\n}\n`;
fs.writeFileSync(path.join(OUT, 'Solution.cs'), cs);
const tests = [];
for (const p of m.P) {
  const f = new Function(p.sol + ';return ' + p.fn)();
  for (const t of p.tests) {
    const args = t.gen ? m.G[t.gen]() : t.args;
    const expected = t.gen ? f(...JSON.parse(JSON.stringify(args))) : t.expected;
    tests.push({id: p.id, method: pascal(p.fn), name: t.n || JSON.stringify(t.args).slice(0, 60), args, expected, maxMs: t.maxMs || 0});
  }
}
fs.writeFileSync(path.join(OUT, 'tests.json'), JSON.stringify(tests));
console.log('problems', m.P.length, 'tests', tests.length);
