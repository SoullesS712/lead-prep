"""แทนตัวเลือก (o:[...]) ของคำถามด้วยชุดใหม่ใน fixes_*.py
หาคำถามจากข้อความ q ในไฟล์ต้นฉบับ แล้วแทนเฉพาะ array ตัวเลือก — ไม่แตะ a (คำตอบ) และ e (คำอธิบาย)
ใช้: python src/tools/apply_fixes.py train   หรือ   python src/tools/apply_fixes.py exam
"""
import io, json, os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.dirname(HERE)
EXAM = os.path.join(SRC, '..', 'competency-2026-exam.html')  # ต้นฉบับหลักอยู่ในโฟลเดอร์เว็บ


def js_str(s):
    # ในไฟล์ HTML ข้อความ </script ต้องเขียนเป็น <\/script จึงแปลงให้ตรงกัน
    return "'" + s.replace('\\', '\\\\').replace("'", "\\'").replace('\n', '\\n').replace('</', '<\\/') + "'"


def find_array_end(text, start):
    """start = index ของ '[' — คืน index ของ ']' ที่ปิดคู่กัน โดยข้ามเนื้อใน string"""
    depth, i, quote = 0, start, None
    while i < len(text):
        c = text[i]
        if quote:
            if c == '\\':
                i += 2
                continue
            if c == quote:
                quote = None
        elif c in '\'"`':
            quote = c
        elif c == '[':
            depth += 1
        elif c == ']':
            depth -= 1
            if depth == 0:
                return i
        i += 1
    raise ValueError('unbalanced array')


def replace_options(text, qtext, new_opts, expect_len):
    key = 'q:' + js_str(qtext)
    pos = text.find(key)
    if pos < 0:
        key = 'q: ' + js_str(qtext)
        pos = text.find(key)
    if pos < 0:
        raise KeyError('question not found: ' + qtext[:60])
    if text.find(key, pos + 1) >= 0:
        raise KeyError('question appears twice: ' + qtext[:60])
    # ตัวเลือกอยู่หลังคำถาม (บางข้อมีบล็อก code คั่น) — ต้องเจอก่อนคำถามข้อถัดไป
    cands = [i for i in (text.find('o:[', pos), text.find('o: [', pos)) if i >= 0]
    nxt = text.find('q:', pos + len(key))
    o = min(cands) if cands else -1
    if o < 0 or (nxt >= 0 and o > nxt):
        raise KeyError('options not found for: ' + qtext[:60])
    s = text.index('[', o)
    e = find_array_end(text, s)
    old = text[s:e + 1]
    if old.count("','") + 1 != expect_len and len(new_opts) != expect_len:
        raise ValueError('option count mismatch: ' + qtext[:60])
    return text[:s] + '[' + ','.join(js_str(x) for x in new_opts) + ']' + text[e + 1:]


def load_questions(kind):
    """ดึงข้อความคำถามปัจจุบันผ่าน node — คืน {key: (qtext, n_options)}"""
    js = r"""
const fs=require('fs'), S=process.argv[1], kind=process.argv[2], out={};
if (kind==='train'){
  const src=['lessons1.js','lessons2.js','prog.js','labs.js','posttests.js'].map(f=>fs.readFileSync(S+'/'+f,'utf8')).join('\n');
  const m={}; new Function('m',src+';m.L=LESSONS;m.P=POST')(m);
  m.L.forEach(l=>l.quiz.forEach((q,i)=>out['Q|'+l.id+'|'+i]=[q.q,q.o.length,q.o]));
  Object.entries(m.P).forEach(([id,qs])=>qs.forEach((q,i)=>out['P|'+id+'|'+i]=[q.q,q.o.length,q.o]));
} else {
  const h=fs.readFileSync(process.argv[3],'utf8'), js=h.slice(h.indexOf('<script>')+8,h.lastIndexOf('</script>'));
  const e={}; new Function('e',js.split('/* ---------- state ---------- */')[0]+';e.V1=Q_V1;e.V2=Q_V2')(e);
  e.V1.forEach((q,i)=>{ if(q.o) out['V1|'+i]=[q.q,q.o.length,q.o]; });
  e.V2.forEach((q,i)=>{ if(q.o) out['V2|'+i]=[q.q,q.o.length,q.o]; });
}
process.stdout.write(JSON.stringify(out));
"""
    r = subprocess.run(['node', '-e', js, SRC, kind, EXAM], capture_output=True, text=True, encoding='utf8', check=True)
    return json.loads(r.stdout)


def main(kind, mod=None):
    sys.path.insert(0, HERE)
    if kind == 'train':
        FIX = __import__(mod or 'fixes_train').FIX
        files = ['lessons1.js', 'lessons2.js', 'prog.js', 'posttests.js']
        paths = [os.path.join(SRC, f) for f in files]
        keyf = lambda k: '|'.join(map(str, k))
    else:
        FIX = __import__(mod or 'fixes_exam').FIX
        paths = [EXAM]
        keyf = lambda k: '|'.join(map(str, k))
    qs = load_questions(kind)
    texts = {p: io.open(p, encoding='utf8').read() for p in paths}
    done = 0
    for k, opts in FIX.items():
        qtext, n, cur = qs[keyf(k)]
        if isinstance(opts, dict):  # แก้เฉพาะบางตัวเลือก {index: ข้อความใหม่}
            opts = [opts.get(i, o) for i, o in enumerate(cur)]
        if len(opts) != n:
            raise ValueError(f'{k}: expected {n} options, got {len(opts)}')
        for p in paths:
            if ('q:' + js_str(qtext)) in texts[p] or ('q: ' + js_str(qtext)) in texts[p]:
                texts[p] = replace_options(texts[p], qtext, opts, n)
                done += 1
                break
        else:
            raise KeyError(f'{k}: not found in any file: {qtext[:60]}')
    for p, t in texts.items():
        io.open(p, 'w', encoding='utf8', newline='\n').write(t)
    print(f'{kind}: replaced options of {done} questions')


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else 'train', sys.argv[2] if len(sys.argv) > 2 else None)
