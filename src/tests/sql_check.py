"""รันเฉลย SQL Lab ทุกข้อด้วย sqlite3 ตรวจว่าไม่ error และมีผลลัพธ์ (ฐานข้อมูลเดียวกับในเว็บ)
รัน: python src/tests/sql_check.py
"""
import io, json, os, re, sqlite3, subprocess, sys
sys.stdout.reconfigure(encoding="utf-8")

SRC = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
js = r"""
const fs=require('fs'),p=require('path'),S=process.argv[1];
const src=['labs.js','sql2.js'].filter(f=>fs.existsSync(p.join(S,f))).map(f=>fs.readFileSync(p.join(S,f),'utf8')).join('\n');
const m={}; new Function('m',src+';m.db=SHOP_DB;m.ex=SQL_EX')(m);
process.stdout.write(JSON.stringify({db:m.db,ex:m.ex}));
"""
data = json.loads(subprocess.run(['node', '-e', js, SRC], capture_output=True, text=True, encoding='utf8', check=True).stdout)
con = sqlite3.connect(':memory:')
con.executescript(data['db'])
bad = 0
for i, x in enumerate(data['ex'], 1):
    try:
        cur = con.execute(x['ref'])
        cols = [d[0] for d in cur.description]
        rows = cur.fetchall()
        print(f"{'✓' if rows else '✗'} {i:2}. {x['t']} — {len(rows)} แถว {cols}")
        for r in rows[:6]:
            print('      ', r)
        if not rows:
            bad += 1
    except Exception as e:
        bad += 1
        print(f'✗ {i:2}. {x["t"]}: {e}')
print('SQL exercises', len(data['ex']), 'bad', bad)
sys.exit(1 if bad else 0)
