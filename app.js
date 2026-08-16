// ==================== APP / FLOW MODULE ====================
// Connects the independent countdown, cake/title and audio modules.
(()=>{
 const c=document.getElementById('scene'),ctx=c.getContext('2d'),start=document.getElementById('start'),begin=document.getElementById('begin'),again=document.getElementById('again'),state=document.getElementById('state');
 BirthdayAudio.init(document.getElementById('birthdayAudio'));
 let w=innerWidth,h=innerHeight,d=1,zoom=1,rx=0,ry=0,drag=false,lx=0,ly=0,phase='idle',phaseT=0,particles=[],cake=[],title=[],burst=[];
 function resize(){w=innerWidth;h=innerHeight;d=Math.min(devicePixelRatio||1,1.5);c.width=w*d;c.height=h*d;ctx.setTransform(d,0,0,d,0,0)} addEventListener('resize',resize);resize();
 function project(p){let cy=Math.cos(ry),sy=Math.sin(ry),cx=Math.cos(rx),sx=Math.sin(rx),X=p.x*cy-p.z*sy,Z=p.x*sy+p.z*cy,Y=p.y*cx-Z*sx;Z=p.y*sx+Z*cx;const s=Math.min(w,h)*.19*zoom/(1+Z/10);return{x:w/2+X*s,y:h*.54-Y*s,z:Z,s};}
 function dot(p,a=1){const q=project(p),s=Math.max(.8,(p.size||.045)*Math.min(w,h)*.8/(1+q.z/12));ctx.globalAlpha=Math.max(0,a*(1-q.z/18));ctx.fillStyle=p.color||'#fff';ctx.shadowBlur=s*5;ctx.shadowColor=p.color||'#fff';ctx.beginPath();ctx.arc(q.x,q.y,s,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;}
 function clear(){ctx.globalAlpha=1;const g=ctx.createRadialGradient(w/2,h*.52,0,w/2,h*.52,Math.max(w,h)*.72);g.addColorStop(0,'#1b091d');g.addColorStop(.45,'#08030d');g.addColorStop(1,'#020106');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);for(let i=0;i<160;i++){ctx.globalAlpha=.12;ctx.fillStyle='#ffd0e7';ctx.fillRect((i*83%997)/997*w,(i*47%991)/991*h,1,1)}}
 function makeCount(n){return Countdown.build(n,4200).map(p=>({sx:p.sx,sy:p.sy,sz:p.sz||((Math.random()-.5)*.7),tx:p.tx,ty:p.ty,tz:(Math.random()-.5)*.08,size:.026+Math.random()*.022,color:['#fff','#ffd5e9','#ff9bd3','#ffe9a8'][Math.floor(Math.random()*4)]}))}
 function startCountdown(){particles=makeCount(5);phase='count';phaseT=performance.now();state.textContent='粒子倒数 · 5';}
 function nextDigit(n){particles=makeCount(n);phaseT=performance.now();state.textContent='粒子倒数 · '+n;}
 function render(t){clear();
   if(phase==='count'){
     const u=Math.min(1,(t-phaseT)/420);particles.forEach(p=>{const e=u*u*(3-2*u);dot({x:p.sx+(p.tx-p.sx)*e,y:p.sy+(p.ty-p.sy)*e,z:p.sz+(p.tz-p.sz)*e,size:p.size,color:p.color},1)});
     if(t-phaseT>980){const current=Number(state.textContent.split('·')[1]);if(current>1)nextDigit(current-1);else{phase='burst';phaseT=t;state.textContent='粒子爆散';}}
   } else if(phase==='burst'){
     const u=Math.min(1,(t-phaseT)/900);burst.forEach((p,i)=>{const a=i*.71,r=1.8+u*5.2;dot({x:p.x*(1-u)+Math.cos(a)*r*u,y:p.y*(1-u)+Math.sin(a)*r*u,z:p.z*(1-u)+Math.sin(a*1.7)*r*u,size:p.size,color:p.color},1-u*.1)});
     if(t-phaseT>930){phase='cake';phaseT=t;BirthdayAudio.revealFromBeginning();state.textContent='生日蛋糕 · 音乐播放';}
   } else if(phase==='cake'){
     const u=Math.min(1,(t-phaseT)/1700);cake.forEach(p=>{const a=Math.atan2(p.z,p.x)+u*3,r=Math.hypot(p.x,p.z),rr=r*(u)+(3.4*(1-u));dot({x:Math.cos(a)*rr,y:p.y*u+Math.sin(a*1.7)*1.6*(1-u),z:Math.sin(a)*rr,size:p.size,color:p.color},1)});title.forEach(p=>dot(p,.98));if(t-phaseT>1750)phase='cakeDone';
   } else if(phase==='cakeDone'){cake.forEach(p=>dot(p));title.forEach(p=>dot(p,.98));}
   requestAnimationFrame(render);
 }
 cake=BirthdayDesign.buildCake();title=BirthdayDesign.titlePoints();burst=[...cake,...title].map(p=>({x:p.x,y:p.y,z:p.z,size:p.size||.04,color:p.color||'#fff'}));requestAnimationFrame(render);
 begin.onclick=async()=>{if(phase!=='idle')return;try{await BirthdayAudio.arm();}catch(e){}start.classList.add('hide');startCountdown();};again.onclick=()=>location.reload();
 c.addEventListener('wheel',e=>{e.preventDefault();zoom=Math.max(.55,Math.min(1.9,zoom*(e.deltaY>0?.91:1.1)));},{passive:false});
 c.addEventListener('pointerdown',e=>{drag=true;lx=e.clientX;ly=e.clientY;c.setPointerCapture(e.pointerId)});c.addEventListener('pointermove',e=>{if(!drag)return;ry+=(e.clientX-lx)*.004;rx+=(e.clientY-ly)*.004;rx=Math.max(-1.2,Math.min(1.2,rx));lx=e.clientX;ly=e.clientY});c.addEventListener('pointerup',()=>drag=false);c.addEventListener('pointercancel',()=>drag=false);
})();
