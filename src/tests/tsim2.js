const fs=require('fs');
const h=fs.readFileSync('D:/new/lead-prep-site/competency-2026-train.html','utf8');
const src=h.slice(h.indexOf('<script>')+8,h.lastIndexOf('</script>'));
class CL{constructor(e){this.e=e}add(...c){c.forEach(x=>this.e._c.add(x))}remove(...c){c.forEach(x=>this.e._c.delete(x))}toggle(c,on){(on===undefined?!this.e._c.has(c):on)?this.e._c.add(c):this.e._c.delete(c)}contains(c){return this.e._c.has(c)}}
class El{constructor(tag){this.tagName=tag;this.children=[];this._c=new Set();this.classList=new CL(this);this.style={};this._text='';this.value='';this.dataset={};this.parentNode=null}
 set className(v){this._c=new Set(String(v).split(/\s+/).filter(Boolean))} get className(){return [...this._c].join(' ')}
 appendChild(c){c.parentNode=this;this.children.push(c);return c} insertBefore(c,ref){c.parentNode=this;const i=this.children.indexOf(ref);this.children.splice(i<0?this.children.length:i,0,c);return c}
 get lastChild(){return this.children[this.children.length-1]}
 remove(){if(this.parentNode){const a=this.parentNode.children;a.splice(a.indexOf(this),1)}}
 querySelectorAll(sel){const cls=sel.split('.').filter(Boolean).slice(sel.startsWith('.')?0:1);return find(this,n=>n!==this&&cls.every(c=>n._c.has(c)))}
 scrollIntoView(){} addEventListener(t,f){(this._ev=this._ev||{})[t]=f} showModal(){this.open=true} close(){this.open=false} focus(){}
 set textContent(v){this._text=String(v);this.children=[]} get textContent(){return this._text+this.children.map(c=>c.textContent).join('')}
 set innerHTML(v){this._text=String(v).replace(/<[^>]+>/g,' ');this.children=[]} get innerHTML(){return this._text}
 select(){}}
const find=(n,p,a=[])=>{if(p(n))a.push(n);n.children.forEach(c=>find(c,p,a));return a};
const BODY=new El('body');
const ids={main:new El('main'),nav:new El('nav'),countChip:new El('div')};
let store={}, hashHandler=null, bridgeMsgs=[];
global.localStorage={getItem:k=>store[k]??null,setItem:(k,v)=>store[k]=String(v)};
global.location={_h:'',get hash(){return this._h},set hash(v){this._h=v.startsWith('#')?v:'#'+v;hashHandler&&hashHandler()},protocol:'file:'};
global.document={querySelectorAll:q=>ids.main.querySelectorAll(q),documentElement:{classList:{add(){}}},getElementById:i=>ids[i]||find(ids.main,n=>n.id===i)[0],createElement:t=>new El(t),createTextNode:t=>{const e=new El('#text');e._text=t;return e},head:{appendChild:s=>setTimeout(()=>s.onerror&&s.onerror(),0)},body:BODY,execCommand(){}};
global.window={scrollTo(){},addEventListener:(e,f)=>{if(e==='hashchange')hashHandler=f}};
global.addEventListener=global.window.addEventListener;
global.confirm=()=>true;global.alert=m=>console.log('ALERT',m);
Object.defineProperty(globalThis,'navigator',{value:{clipboard:{writeText:async t=>{global.CLIP=t}}},configurable:true});
global.URL={createObjectURL:()=>'x'};global.Blob=function(){};
global.AppBridge={postMessage:m=>bridgeMsgs.push(JSON.parse(m))};
const txt=()=>ids.main.textContent;
const btn=(root,re)=>find(root,n=>n.tagName==='button'&&re.test(n.textContent))[0];
(async()=>{
 const A=new Function(src.replace("render();\nif (IN_APP)","/*boot*/render();\nif (IN_APP)")+';return {get ST(){return ST},render,hrClose,hrStart,HR_SECTIONS,HR_PROMPT,PROBLEMS,LESSONS,POST,BANK,UNITS,buildPlan,unitDone,PROBLEMS,SQL_EX,PROMPT_TASKS};')();
 const sched=bridgeMsgs.find(m=>m.type==='schedule');
 console.log('boot: nav',ids.nav.children.length,'chip',ids.countChip.textContent,'| schedule msg items',sched&&sched.items.length);
 console.log('  first notif:',new Date(sched.items[0].at).toString().slice(0,21),'|',sched.items[0].title,'|',sched.items[0].body,'|',sched.items[0].hash);
 console.log('  last notif:',new Date(sched.items.at(-1).at).toString().slice(0,21),'|',sched.items.at(-1).title);
 const plan=A.buildPlan(); console.log('plan days',plan.length,'| day1',plan[0].date,plan[0].items.map(x=>x.u.id+(x.cont?'+':'')).join(','),'| last',plan.at(-1).date,plan.at(-1).items.map(x=>x.u.id).join(','));
 const used=new Set(plan.flatMap(p=>p.items.map(x=>x.u.id))); console.log('all units scheduled:',used.size===A.UNITS.length);
 console.log('today view has hero:',/วันก่อนสอบ/.test(txt()),'| today section:',/วันนี้/.test(txt()));
 for (const r of ['/learn','/practice/code','/practice/sql','/practice/prompt','/exam','/lesson/sysd','tab=sql']) { location.hash=r; console.log('route',r.padEnd(16),'text',txt().length,'navOn',find(ids.nav,n=>n._c.has('on'))[0].textContent); }
 // lesson flow
 location.hash='/lesson/db';
 const ch=find(ids.main,n=>n._c.has('choice')); console.log('choices',ch.length,ch.map(c=>c.textContent.slice(0,22)).join(' | '));
 ch[1].onclick(); console.log('read-first: content visible',/Normalization/.test(txt()),'| pre',JSON.stringify(A.ST.pre.db),'| post-test present',!!btn(ids.main,/ส่ง post-test/));
 location.hash='/lesson/sysd';
 find(ids.main,n=>n._c.has('choice'))[0].onclick();
 const L=A.LESSONS.find(l=>l.id==='sysd');
 let opts=find(ids.main,n=>n._c.has('opt'));
 console.log('pre-test options (4 q x 5 incl idk):',opts.length, 'lesson content hidden:',!/กรอบคิด 6 ขั้น/.test(txt()));
 btn(ids.main,/ส่ง pre-test/).onclick(); console.log('submit w/o answers ->',find(ids.main,n=>n._c.has('warn'))[0]?.textContent);
 // answer: first two correct, rest "ยังไม่รู้"
 const qs=find(ids.main,n=>n._c.has('q'));
 qs.forEach((q,i)=>{const bs=find(q,n=>n._c.has('opt')); const corr=i<2? bs.findIndex((b,k)=>{const t=b.textContent.slice(3);return t===L.quiz.find(x=>x.q===q.children[0].textContent.replace(/^\d+\. /,''))?.o[L.quiz.find(x=>x.q===q.children[0].textContent.replace(/^\d+\. /,'')).a]}) : bs.length-1; bs[corr].onclick();});
 btn(ids.main,/ส่ง pre-test/).onclick(); console.log('pre stored',JSON.stringify(A.ST.pre.sysd));
 btn(ids.main,/เริ่มเรียน/).onclick(); console.log('lesson visible:',/กรอบคิด 6 ขั้น/.test(txt()),'| post questions:',find(ids.main,n=>n._c.has('q')).length,'(expect',L.quiz.length+A.POST.sysd.length+')');
 // answer post all correct using answer key lookup
 const all=A.POST.sysd.concat(L.quiz);
 const answerAll=(wrongN)=>{ find(ids.main,n=>n._c.has('q')).forEach((q,i)=>{ const qt=q.children[0].textContent.replace(/^\d+\. /,''); const src=all.find(x=>x.q===qt); const bs=find(q,n=>n._c.has('opt')); const right=bs.findIndex(b=>b.textContent.slice(3)===src.o[src.a]); bs[i<wrongN?(right+1)%bs.length:right].onclick(); }); btn(ids.main,/ส่ง post-test/).onclick(); };
 answerAll(3); console.log('post (3 wrong):',find(ids.main,n=>n._c.has('warn'))[0]?.textContent.slice(0,40),'| stored',JSON.stringify(A.ST.post.sysd));
 btn(ids.main,/ทำใหม่/).onclick(); answerAll(0); console.log('post (all right):',find(ids.main,n=>n._c.has('pass')&&/ผ่าน/.test(n.textContent))[0]?.textContent,'| unit u6 done',A.unitDone(A.UNITS.find(u=>u.id==='u6')));
 location.hash='/learn'; console.log('learn shows passed:',/เข้าใจแล้ว · 100%/.test(txt()));
 // practice code run solution
 location.hash='/practice/code';
 const d=find(ids.main,n=>n.tagName==='details'&&n._c.has('lesson'))[0]; const ta=find(d,n=>n.tagName==='textarea')[0]; ta.value=A.PROBLEMS[0].sol; ta.oninput();
 await btn(d,/Run tests/).onclick(); console.log('prob1:',find(d,n=>n._c.has('out'))[0].textContent.slice(0,30),'| seg',find(ids.main,n=>n._c.has('seg'))[0].textContent);
 // reminder settings save -> bridge
 location.hash='/today'; bridgeMsgs=[];
 const days=find(ids.main,n=>n._c.has('day')); days[5].onclick(); days[6].onclick(); // ยกเลิก ส, อา
 btn(ids.main,/บันทึกและตั้งแจ้งเตือน/).onclick();
 const m2=bridgeMsgs.find(m=>m.type==='schedule'); console.log('after weekdays-only: notifs',m2.items.length,'days',JSON.stringify(A.ST.sched.days),'| plan days',A.buildPlan().length);
 global.window.appMsg({type:'scheduled',count:m2.items.length,exact:true,perm:true}); console.log('status:',document.getElementById('notifStatus').textContent);
 btn(ids.main,/ทดสอบแจ้งเตือน/).onclick(); console.log('test msg sent:',bridgeMsgs.at(-1).type);
 // exam history display
 store['comp2026-exam-history']=JSON.stringify([{at:Date.now(),ver:'v2',mode:'final',role:'Lead',pct:61.2,meet:12,covered:17,min:95}]);
 location.hash='/exam'; console.log('exam history row:',/61.2%/.test(txt()),/12\/17/.test(txt()));
 // ---- เลือกเกณฑ์ ----
 location.hash='/today';
 const segs=find(ids.main,n=>n._c.has('seg'));
 console.log('target segs',segs.length,'| role buttons',segs[0].children.map(b=>b.textContent).join(','),'| pass',segs[1].children.map(b=>b.textContent).join(','));
 const tblBefore=txt().match(/ระดับ\s+Lead\s+ต้องได้[^—]*/)[0];
 btn(segs[1],/^90%$/).onclick(); console.log('pass 90 -> sysd passed (best 100)',A.ST.post.sysd.best, 'lessonPassed u6',A.unitDone(A.UNITS.find(u=>u.id==='u6')));
 const s2=find(ids.main,n=>n._c.has('seg')); btn(s2[0],/^Senior$/).onclick();
 console.log('Lead:',tblBefore,'| Senior:',txt().match(/ระดับ\s+Senior\s+ต้องได้[^—]*/)[0]);
 location.hash='/lesson/fe'; console.log('fe need tag under Senior:',find(ids.main,n=>n._c.has('lv-A')||n._c.has('lv-I')||n._c.has('lv-B'))[0].textContent);
 const s3=(location.hash='/today',find(ids.main,n=>n._c.has('seg'))); btn(s3[0],/^Lead$/).onclick(); location.hash='/lesson/fe'; console.log('fe need tag under Lead:',find(ids.main,n=>n._c.has('lv-A')||n._c.has('lv-I'))[0].textContent);
 btn(find((location.hash='/today',ids.main),n=>n._c.has('seg'))[1],/^60%$/).onclick(); console.log('stored target',JSON.stringify(A.ST.target));
 // ---- modal ตาม theme: ล้างความคืบหน้า ----
 location.hash='/today';
 btn(ids.main,/ล้างความคืบหน้า/).onclick(); let dlg=BODY.children.at(-1);
 console.log('reset modal:',dlg.tagName,dlg.className,'open',dlg.open,'|',dlg.textContent.slice(0,60));
 btn(dlg,/ยกเลิก/).onclick(); await new Promise(r=>setTimeout(r,0)); console.log('after cancel post kept:',!!A.ST.post.sysd);
 btn(ids.main,/ล้างความคืบหน้า/).onclick(); dlg=BODY.children.at(-1); btn(dlg,/ล้างข้อมูล/).onclick(); await new Promise(r=>setTimeout(r,0));
 console.log('after confirm post cleared:',!A.ST.post.sysd,'| target kept',JSON.stringify(A.ST.target),'| sched kept',A.ST.sched.examDate);
 // ---- ฝึกปรนัย ----
 location.hash='/practice/mcq';
 const segD=find(ids.main,n=>n._c.has('seg'))[0];
 console.log('drill tab:',segD.children.map(b=>b.textContent).join(' | '));
 btn(ids.main,/^เริ่มฝึก/).onclick();
 const dq=find(ids.main,n=>n._c.has('q'));
 console.log('drill questions shown:',dq.length);
 // ตอบ: 5 ข้อแรกผิด ที่เหลือถูก (หาเฉลยจากคลังด้วยข้อความคำถาม)
 const lib=A.LESSONS.flatMap(l=>l.quiz.concat(A.POST[l.id]||[],A.BANK[l.id]||[]));
 dq.forEach((q,i)=>{const qt=q.children[0].textContent.replace(/^\d+\. /,'');const src=lib.find(x=>x.q===qt);const bs=find(q,n=>n._c.has('opt'));const right=bs.findIndex(b=>b.textContent.slice(3)===src.o[src.a]);bs[i<5?(right+1)%bs.length:right].onclick();});
 btn(ids.main,/ส่งคำตอบ/).onclick();
 console.log('drill result:',find(ids.main,n=>/ได้ \d+\/\d+ \(/.test(n._text||''))[0]?._text,'| wrong saved',Object.keys(A.ST.wrongQs).length,'| stats topics',Object.keys(A.ST.drill).length);
 btn(ids.main,/ทำชุดใหม่/).onclick();
 btn(find(ids.main,n=>n._c.has('seg'))[2],/เคยตอบผิด/).onclick();
 console.log('wrong-only mode start button:',btn(ids.main,/^เริ่มฝึก/)?.textContent,'| weak list rows',find(ids.main,n=>n._c.has('item')&&/ตอบไป/.test(n.textContent)).length);
 // ---- จำลอง HackerRank ----
 location.hash='/exam'; console.log('exam has HR card:',/จำลอง HackerRank/.test(txt()));
 location.hash='/hr';
 const practiceBtns=find(ids.main,n=>n.tagName==='button'&&n.textContent==='ซ้อม');
 console.log('hr intro sections:',practiceBtns.length,'| full button:',!!btn(ids.main,/สอบครบ 8 section/));
 practiceBtns[3].onclick();   // Security 4 ข้อ 10 นาที
 let H=A.ST.hr, S=H.secs.s4;
 console.log('single Security: items',S.items.length,'| multi included',S.items.some(q=>q.multi),'| deadline min',Math.round((H.deadline-Date.now())/60000));
 S.items.forEach((q,i)=>{ S.ans[i]= i===0 ? (Array.isArray(q.a)?[]:(q.a+1)%q.o.length) : q.a; });
 await A.hrClose(false); H=A.ST.hr;
 console.log('security graded:',JSON.stringify(H.secs.s4.grade),'| results',H.results,'| hist',A.ST.hrHist.length,'| result text',/ผลการจำลอง HackerRank/.test(txt()));
 btn(ids.main,/กลับหน้าซ้อม/).onclick();
 // Coding section เดี่ยว ใส่เฉลย
 find(ids.main,n=>n.tagName==='button'&&n.textContent==='ซ้อม')[7].onclick();
 H=A.ST.hr; S=H.secs.s8; const P=A.PROBLEMS.find(p=>p.id===S.task); S.code=P.sol;
 await A.hrClose(false);
 console.log('coding',S.task,'graded:',JSON.stringify(A.ST.hr.secs.s8.grade));
 A.ST.hr=null; A.render();
 // Prompt section เดี่ยว ตอบตรงทุกเคส
 find(ids.main,n=>n.tagName==='button'&&n.textContent==='ซ้อม')[6].onclick();
 H=A.ST.hr; S=H.secs.s7; const T=A.HR_PROMPT.find(t=>t.id===S.task); S.prompt=T.sample; T.cases.forEach((c,i)=>S.caseOut[i]=c.output);
 await A.hrClose(false);
 console.log('prompt',S.task,'graded:',JSON.stringify(A.ST.hr.secs.s7.grade));
 A.ST.hr=null; A.render();
 // สอบเต็ม: ปิดทีละ section
 A.hrStart([0,1,2,3,4,5,6,7]); H=A.ST.hr;
 console.log('full: s1 items',H.secs.s1.items.length,'s1 multi',H.secs.s1.items.filter(q=>q.multi).length);
 for(let k=0;k<8;k++){ const sec=A.HR_SECTIONS[H.order[H.pos]]; if(k===1) console.log('  s2 items',H.secs.s2.items.length); await A.hrClose(false); }
 console.log('full finished:',A.ST.hr.results,'| sections graded',Object.values(A.ST.hr.secs).filter(x=>x.grade).length,'| hist mode',A.ST.hrHist.at(-1).mode);
 // หมดเวลา: ปิด section อัตโนมัติ
 A.ST.hr=null; A.hrStart([4]); A.ST.hr.deadline=Date.now()-1000; A.render(); await new Promise(r=>setTimeout(r,50));
 console.log('timeout auto-close:',A.ST.hr.results===true);
 const B=new Function(src.replace(/render\(\);\nif \(IN_APP\) sendSchedule\(\);/,'')+';return {get ST(){return ST}};')(); console.log('persist: post',JSON.stringify(B.ST.post.sysd),'prob',Object.keys(B.ST.prob).join(','));
})().catch(e=>console.error('ERR',e.stack)).finally(()=>process.exit(0));
