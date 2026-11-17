const fs=require('fs');
const h=fs.readFileSync('D:/new/lead-prep-site/competency-2026-exam.html','utf8');
const src=h.slice(h.indexOf('<script>')+8,h.lastIndexOf('</script>'));
class CL{constructor(e){this.e=e}add(...c){c.forEach(x=>this.e._c.add(x))}remove(...c){c.forEach(x=>this.e._c.delete(x))}toggle(c,on){on===undefined?(this.e._c.has(c)?this.e._c.delete(c):this.e._c.add(c)):(on?this.e._c.add(c):this.e._c.delete(c))}contains(c){return this.e._c.has(c)}}
class El{constructor(tag){this.tagName=tag;this.children=[];this._c=new Set();this.classList=new CL(this);this.style={};this._text='';this.value='';this.dataset={}}
 set className(v){this._c=new Set(String(v).split(/\s+/).filter(Boolean))} get className(){return [...this._c].join(' ')}
 appendChild(c){this.children.push(c);c.parentNode=this;return c} remove(){}
 set textContent(v){this._text=String(v);this.children=[]} get textContent(){return this._text+this.children.map(c=>c.textContent).join('')}
 set innerHTML(v){this._text=String(v).replace(/<[^>]+>/g,' ');this.children=[]} get innerHTML(){return this._text}
 get childElementCount(){return this.children.length}
 querySelectorAll(sel){const cls=sel.split(' ').pop().replace('.','');const out=[];const walk=n=>{n.children.forEach(c=>{if(c._c.has(cls))out.push(c);walk(c)})};walk(this);return out}
 select(){} focus(){}}
const ids={};['modePick','resumeBox','histBox','rules','rulesList','modeLabel','versionPick','rolePick','weightTable','start','exam','result','timer','progress','flagBtn','qcard','grid','scoreBig','verdict','scoreSub','compTitle','compTable','summary','filters','review'].forEach(i=>ids[i]=new El('div'));
const root=new El('div');Object.values(ids).forEach(e=>root.appendChild(e));
global.document={getElementById:i=>ids[i],createElement:t=>new El(t),querySelectorAll:s=>ids.grid.querySelectorAll(s),head:{appendChild:s=>{setTimeout(()=>s.onerror&&s.onerror(),0)}},body:{appendChild(){}},execCommand(){}};
global.window={addEventListener(){},scrollTo(){}};global.confirm=()=>true;global.alert=m=>console.log('ALERT',m);Object.defineProperty(globalThis,"navigator",{value:{clipboard:{writeText:async t=>{global.CLIP=t}}},configurable:true});
global.URL={createObjectURL:()=>'blob:x'};global.Blob=function(){};global.location={hash:'',protocol:'file:'};global.localStorage={getItem:()=>null,setItem(){},removeItem(){}};document.addEventListener=()=>{};
const api=new Function(src+';return {get Q(){return Q},startExam,go,submitExam,isAnswered,codes,answers,langs,prompts,ticks,setVer:v=>VER=v,setRole:r=>ROLE=r,get graded(){return graded},renderResult,expandTests};')();
const find=(n,pred,acc=[])=>{if(pred(n))acc.push(n);n.children.forEach(c=>find(c,pred,acc));return acc};
(async()=>{
 for(const ver of ['v1','v2']){
  console.log('=====',ver); Object.values(ids).forEach(e=>{e.children=[];e._text='';e.value='';});
  // reset module state by re-evaluating
  const A=new Function(src+';return {get Q(){return Q},startExam,go,submitExam,isAnswered,codes,answers,langs,prompts,ticks,runs,setVer:v=>VER=v,setRole:r=>ROLE=r,get graded(){return graded}};')();
  A.setVer(ver); A.setRole('Lead'); A.startExam();
  const Q=A.Q; console.log('items',Q.length, 'progress:',ids.progress.textContent);
  // answer all MCQ correctly except first 3
  Q.forEach((q,i)=>{ if(!q.type) A.answers[i]= i<3 ? (q.a+1)%4 : q.a; });
  for(let i=0;i<Q.length;i++) A.go(i); // render every question
  // coding: js with solutions; first js item in C# mode
  let firstJs=true;
  for(const [i,q] of Q.entries()){
    if(q.type==='js'){ if(firstJs && ver==='v2'){ A.langs[i]='cs'; A.codes[i]=q.cs; firstJs=false; A.go(i);
        const btn=find(ids.qcard,n=>n.tagName==='button'&&/xUnit/.test(n.textContent))[0]; await btn.onclick(); console.log('C# clip starts:',global.CLIP.split('\n').slice(0,6).join(' | '),'... has Assert:',/Assert\.Equal\(4, Solution\.MinCableCost\(4, new int\[\]\[\]/.test(global.CLIP)); }
      else { A.codes[i]=q.sol; A.go(i); const run=find(ids.qcard,n=>n.tagName==='button'&&/Run/.test(n.textContent))[0]; await run.onclick(); console.log('run out:',find(ids.qcard,n=>n._c.has('out'))[0].textContent.slice(0,80)); } }
    if(q.type==='prompt'){ A.go(i); A.prompts[i]='return x => y'; console.log('bad prompt answered?',A.isAnswered(i));
      A.prompts[i]=q.samplePrompt; A.codes[i]='Here you go:\n```javascript\n'+q.sol+'\n```'; A.go(i);
      const cp=find(ids.qcard,n=>n.tagName==='button'&&/คัดลอก prompt/.test(n.textContent))[0]; await cp.onclick(); console.log('wrapped prompt ok:',global.CLIP.includes('maskSecrets(text)'));
      const run=find(ids.qcard,n=>n.tagName==='button'&&/Run/.test(n.textContent))[0]; await run.onclick(); console.log('prompt run:',find(ids.qcard,n=>n._c.has('out'))[0].textContent.slice(0,60),'| answered',A.isAnswered(i)); }
    if(q.type==='sql'){ A.codes[i]=q.ref; }
  }
  await A.submitExam();
  console.log('score:',ids.scoreBig.textContent,'|',ids.verdict.textContent);
  console.log('sub:',ids.scoreSub.textContent);
  console.log('summary head:',ids.summary.value.split('\n').slice(0,5).join(' / '));
  console.log('review cards:',ids.review.children.length,'filters:',ids.filters.children.length);
  const g=A.graded; console.log('graded coding:',Q.map((q,i)=>q.type?q.type+':'+g[i].got.toFixed(1)+'/'+g[i].max+(g[i].manual?'(manual)':''):null).filter(Boolean).join(' '));
  // tick all C# cases
  const ticksCb=find(ids.review,n=>n.tagName==='input'); if(ticksCb.length){ ticksCb.forEach(cb=>{cb.checked=true;cb.onchange()}); console.log('after ticking C#:',ids.scoreBig.textContent,'|',ids.verdict.textContent); }
  // filter wrong only
  ids.filters.children[1].onclick(); console.log('wrong-only cards:',ids.review.children.length);
 }
})().catch(e=>{console.error('ERR',e.stack)}).finally(()=>process.exit(0));
