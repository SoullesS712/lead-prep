"""ประกอบหน้าเรียน competency-2026-train.html จากไฟล์ใน src/
รัน: python src/build.py   (เขียนทับ ../competency-2026-train.html)
ลำดับ JS สำคัญ: ข้อมูล (lessons/prog/labs/posttests) → core → runner → views → boot
"""
import io, os, sys

here = os.path.dirname(os.path.abspath(__file__))


def rd(p):
    return io.open(os.path.join(here, p), encoding='utf8').read()


DATA = ['lessons1.js', 'lessons2.js', 'prog.js', 'lessons_extra.js', 'prog2.js', 'labs.js', 'sql2.js', 'prompt2.js', 'posttests.js', 'bank.js']
CODE = ['core.js', 'runner.js', 'views.js']
BOOT = """
render();
if (IN_APP) sendSchedule();
if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
"""

js = '\n'.join([rd(p) for p in DATA + CODE] + [BOOT])
assert '</script' not in js.lower(), 'found </script in js'
shell = rd('shell2.html').replace('/*THEME*/', rd('theme.css')).replace('/*APP*/', rd('app.css'))
out = shell + js + '\n</script>\n</body>\n</html>\n'
dst = sys.argv[1] if len(sys.argv) > 1 else os.path.join(here, '..', 'competency-2026-train.html')
io.open(dst, 'w', encoding='utf8', newline='\n').write(out)
print('wrote', os.path.abspath(dst), len(out.encode('utf8')), 'bytes')
