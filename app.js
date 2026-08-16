// APP / FLOW MODULE — owns only render flow, camera controls and transitions.
(()=>{
 const c=document.getElementById('scene'),ctx=c.getContext('2d',{alpha:false}),start=document.getElementById('start'),begin=document.getElementById('begin'),again=document.getElementById('again'),state=document.getElementById('state');
 BirthdayAudio.init(document.getElementById('birthdayAudio'));
 let w=innerWidth,h=innerHeight,d=1,zoom=1,rx=0,ry=0,drag=false,lx=0,ly=0,phase='idle',phaseT=0,num=5,particles=[],cake=[],title=[],burst=[];
 const COLORS=['#fff8fc','#ffd8ea','#ff9fd4','#ffe8a6'];
 function resize(){w=innerWidth;h=innerHeight;d=Math.min(devicePixelRatio||1,1.5);c.width=w*d;c.height=h*d;ctx.setTransform(d,0,0,d,0,0)}
 addEventListener('resize',resize,{passive:true});resize();
 function ease(t){t=Math.max(0,Math.min(1,t));return t*t*(3-2*t)}
 function project(p){const cy=Math.cos(ry),sy=Math.sin(ry),cx=Math.cos(rx),sx=Math.sin(rx);const X=p.x*cy-p.z*sy,Z=p.x*sy+p.z*cy,Y=p.y*cx-Z*sx;const ZZ=p.y*sx+Z*cx,s=Math.min(w,h)*.18*zoom/(1+ZZ/10);return{x:w/2+X*s,y:h*.55-Y*s,z:ZZ}}
 function background(){const g=ctx.createRadialGradient(w*.5,h*.5,0,w*.5,h*.5,Math.max(w,h)*.8);g.addColorStop(0,'#1a091e');g.addColorStop(.5,'#08040d');g.addColorStop(1,'#020106');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);ctx.fillStyle='#ffc1df';for(let i=0;i<190;i++){ctx.globalAlpha=.055+.035*Math.sin(i+performance.now()*.0006);ctx.fillRect(((i*83)%1000)/1000*w,((i*47)%1000)/1000*h,1,1)}ctx.globalAlpha=1}
 function dot(p,a=1){const q=project(p);const s=Math.max(.65,(p.size||.03)*Math.min(w,h)*.34/(1+q.z/12));ctx.globalAlpha=Math.max(0,a*(1-q.z/18));ctx.fillStyle=p.color||'#fff';ctx.beginPath();ctx.arc(q.x,q.y,s,0,Math.PI*2);ctx.fill()}
 function drawCount(){const u=ease((performance.now()-phaseT)/900);for(const p of particles){dot({x:p.sx+(p.tx-p.sx)*u,y:p.sy+(p.ty-p.sy)*u,z:p.sz+(p.tz-p.sz)*u,size:p.size,color:p.color},.94+.05*Math.sin(performance.now()*.003+p.tw))}}
 function makeCount(n){return Countdown.build(n,6200)}
 function drawBurst(){const u=Math.min(1,(performance.now()-phaseT)/1000);for(const p of burst){const r=p.r*(1-u)+p.out*(.25+u*1.85),ang=p.a+Math.sin(p.a*5)*.05;dot({x:Math.cos(ang)*r,y:Math.sin(ang)*r*.74,z:Math.sin(ang*2+performance.now()*.001)*.8,size:p.size,color:p.color},.72)}for(let i=0;i<500;i++){const a=i*0.47+performance.now()*.002,r=.3+u*6*((i%17)/17);dot({x:Math.cos(a)*r,y:Math.sin(a)*r*.7,z:Math.sin(a*2)*.8,size:.02,color:COLORS[i%4]},.28)}}
 function buildBurst(){burst=Array.from({length:2600},(_,i)=>({a:Math.random()*Math.PI*2,r:.2+Math.random()*1.1,out:3.5+Math.random()*4.5,size:.02+Math.random()*.02,color:COLORS[i%4]}))}
 function drawCake(){const u=ease((performance.now()-phaseT)/1900);for(const p of cake){const a=(p.x===0&&p.z===0)?0:Math.atan2(p.z,p.x),r=Math.hypot(p.x,p.z),swirl=(1-u)*2.2;dot({x:p.x*u+Math.cos(a+swirl)*r*(1-u),y:p.y*u+Math.sin(a*3.3)*.9*(1-u),z:p.z*u+Math.sin(a+swirl)*r*(1-u),size:p.size,color:p.color},.86+.12*u)}
  // Front-facing title: z fixed, no perspective skew from varying depth.
  for(const p of title)dot(p,1)
 }
 function drawDone(){for(const p of cake)dot(p,.86);for(const p of title)dot(p,1)}
 function beginFlow(){if(phase!=='idle')return;BirthdayAudio.arm().catch(()=>{});start.classList.add('hide');num=5;particles=makeCount(num);buildBurst();cake=BirthdayDesign.buildCake();title=BirthdayDesign.titlePoints();phase='count';phaseT=performance.now();state.textContent='粒子倒数 · 5'}
 begin.onclick=beginFlow;again.onclick=()=>location.reload();
 c.addEventListener('wheel',e=>{e.preventDefault();zoom=Math.max(.62,Math.min(1.85,zoom*(e.deltaY>0?.92:1.08)))},{passive:false});
 c.addEventListener('pointerdown',e=>{drag=true;lx=e.clientX;ly=e.clientY;c.setPointerCapture(e.pointerId)});c.addEventListener('pointermove',e=>{if(!drag)return;ry+=(e.clientX-lx)*.004;rx+=(e.clientY-ly)*.002;rx=Math.max(-1.1,Math.min(1.1,rx));lx=e.clientX;ly=e.clientY});c.addEventListener('pointerup',()=>drag=false);c.addEventListener('pointercancel',()=>drag=false);
 function loop(now){background();if(phase==='count'){drawCount();if(now-phaseT>1250){if(num>1){num--;particles=makeCount(num);phaseT=now;state.textContent='粒子倒数 · '+num}else{phase='burst';phaseT=now;state.textContent='粒子爆散'}}}
  else if(phase==='burst'){drawBurst();if(now-phaseT>1150){phase='cake';phaseT=now;state.textContent='生日蛋糕 · 粒子聚合'}}
  else if(phase==='cake'){drawCake();if(now-phaseT>1950){phase='done';BirthdayAudio.revealFromBeginning();state.textContent='生日快乐 · 音乐播放'}}
  else if(phase==='done')drawDone();requestAnimationFrame(loop)}
 requestAnimationFrame(loop);
})();
