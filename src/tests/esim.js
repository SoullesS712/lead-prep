// ทดสอบโหมด Final/ฝึกซ้อม: rules dialog, จับเวลา, เตือน, บันทึก/ทำต่อ, หมดเวลาส่งอัตโนมัติ, ประวัติ
const fs=require('fs');
const h=fs.readFileSync('D:/new/competency-2026-exam.html','utf8');
const src=h.slice(h.indexOf('<script>')+8,h.lastIndexOf('</script>'));
class CL{constructor(e){this.e=e}add(...c){c.forEach(x=>this.e._c.add(x))}remove(...c){c.forEach(x=>this.e._c.delete(x))}toggle(c,on){on===undefined?(this.e._c.has(c)?this.e._c.delete(c):this.e._c.add(c)):(on?this.e._c.add(c):this.e._c.delete(c))}contains(c){return this.e._c.has(c)}}
class El{constructor(tag){this.tagName=tag;this.children=[];this._c=new Set();this.classList=new CL(this);this.style={};this._text='';this.value='';this.dataset={}}
 set className(v){this._c=new Set(String(v).split(/\s+/).filter(Boolean))} get className(){return [...this._c].join(' ')}
 appendChild(c){this.children.push(c);c.parentNode=this;return c} remove(){}
 set textContent(v){this._text=String(v);this.children=[]} get textContent(){return this._text+this.children.map(c=>c.textContent).join('')}
 set innerHTML(v){this._text=String(v).replace(/<[^>]+>/g,' ');this.children=[]} get innerHTML(){return this._text}
 get childElementCount(){return this.children.length}
 querySelectorAll(sel){const cls=sel.split(' ').pop().replace('.','');const out=[];const walk=n=>{n.children.forEach(c=>{if(c._c.has(cls))out.push(c);walk(c)})};walk(this);return out}
 showModal(){this.open=true} close(){this.open=false}
 select(){} focus(){}}
const find=(n,pred,acc=[])=>{if(pred(n))acc.push(n);n.children.forEach(c=>find(c,pred,acc));return acc};
let store={}, toasts=[], intervals=[];
const mkIds=()=>{const ids={};['modePick','versionPick','rolePick','weightTable','start','exam','result','timer','progress','flagBtn','qcard','grid','scoreBig','verdict','scoreSub','compTitle','compTable','summary','filters','review','resumeBox','histBox','rules','rulesList','modeLabel'].forEach(i=>ids[i]=new El('div'));return ids};
let ids;
global.localStorage={getItem:k=>store[k]??null,setItem:(k,v)=>store[k]=String(v),removeItem:k=>delete store[k]};
global.document={getElementById:i=>ids[i],createElement:t=>new El(t),querySelectorAll:s=>ids.grid.querySelectorAll(s),head:{appendChild:s=>{setTimeout(()=>s.onerror&&s.onerror(),0)}},body:{appendChild:t=>{if(t._c&&t._c.has('toast'))toasts.push(t._text)}},execCommand(){},addEventListener(){},hidden:false};
global.window={addEventListener(){},scrollTo(){}};global.addEventListener=()=>{};
global.location={hash:'#final',protocol:'file:'};
global.confirm=()=>true;global.alert=m=>console.log('ALERT',m);
global.setInterval=(f)=>{intervals.push(f);return intervals.length};global.clearInterval=()=>{};
global.URL={createObjectURL:()=>'blob:x'};global.Blob=function(){};
let NOW=Date.parse('2026-11-04T20:00:00'); const realNow=Date.now; Date.now=()=>NOW;
const load=()=>{ids=mkIds(); intervals=[]; return new Function(src+';return {get Q(){return Q},get MODE(){return MODE},get deadline(){return deadline},get answers(){return answers},beginExam,startExam,submitExam,tick,saveRun,go,get submitted(){return submitted}};')();};
(async()=>{
 let A=load();
 console.log('default mode from #final:',A.MODE,'| mode cards',ids.modePick.children.length,'| resume hidden',ids.resumeBox._c.has('hidden'));
 A.startExam(); console.log('rules dialog open:',ids.rules.open,'| rules:',ids.rulesList.children.length,'|',ids.rulesList.children[0].textContent);
 A.beginExam(); console.log('exam visible:',!ids.exam._c.has('hidden'),'timer',ids.timer.textContent,'label',ids.modeLabel.textContent);
 // answer 5 MCQ then "close app"
 A.Q.forEach((q,i)=>{ if(!q.type && i<5){ A.answers[i]=q.a; A.go(i);} });
 NOW+=30*60000; A.tick(); A.saveRun();
 console.log('after 30 min timer',ids.timer.textContent,'| saved',!!store['comp2026-exam-inprogress']);
 // reopen app 40 min later
 NOW+=40*60000; A=load();
 console.log('reopen: resume box visible',!ids.resumeBox._c.has('hidden'),'|',ids.resumeBox.textContent.slice(0,90));
 const resumeBtn=find(ids.resumeBox,n=>n.tagName==='button'&&/ทำต่อ/.test(n.textContent))[0]; resumeBtn.onclick();
 console.log('resumed answers kept:',Object.keys(A.answers).length,'timer',ids.timer.textContent);
 // warnings
 NOW=A.deadline-9.5*60000; A.tick(); NOW=A.deadline-4*60000; A.tick(); NOW=A.deadline-30000; A.tick();
 console.log('toasts:',toasts.join(' / '),'| timer class',ids.timer.className);
 // app closed and reopened after deadline -> auto submit on resume
 A.saveRun(); NOW=A.deadline+5*60000; A=load();
 console.log('reopen after deadline:',ids.resumeBox.textContent.slice(0,120));
 find(ids.resumeBox,n=>n.tagName==='button'&&/ส่งและดูผล/.test(n.textContent))[0].onclick();
 await new Promise(r=>setTimeout(r,50));
 console.log('auto-submitted:',A.submitted,'| score',ids.scoreBig.textContent,'| inprogress cleared',!store['comp2026-exam-inprogress']);
 const hist=JSON.parse(store['comp2026-exam-history']); console.log('history:',JSON.stringify(hist));
 // practice mode
 global.location.hash='#practice'; A=load(); console.log('practice default:',A.MODE,'| history table rows',find(ids.histBox,n=>n.tagName==='tr').length);
 A.startExam(); console.log('practice starts directly (no dialog):',!ids.rules.open&&!ids.exam._c.has('hidden'),'timer',ids.timer.textContent,ids.timer.className);
 NOW+=12*60000+5000; A.tick(); console.log('practice elapsed:',ids.timer.textContent);
})().catch(e=>console.error('ERR',e.stack)).finally(()=>process.exit(0));
