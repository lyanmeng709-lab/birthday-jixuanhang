(() => {
  const canvas = document.getElementById('scene');
  const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
  const audio = document.getElementById('birthdayAudio');
  const start = document.getElementById('start');
  const state = document.getElementById('state');

  audio.src = 'audio/birthday.mp3';
  audio.preload = 'auto';

  let W=0,H=0,D=1,time=0,mode='idle',rot=0,targetRot=0,progress=0,runId=0;
  const TAU=Math.PI*2;
  const colors=['#fffafc','#ffe0ed','#ff9dcc','#f3d7ff','#ffd982','#fff2c4'];
  const photos=[];
  const countdownParticles=[];

  function resize(){ D=Math.min(devicePixelRatio||1,1.5); W=innerWidth; H=innerHeight; canvas.width=W*D; canvas.height=H*D; ctx.setTransform(D,0,0,D,0,0); }
  addEventListener('resize',resize,{passive:true}); resize();
  const clamp=v=>Math.max(0,Math.min(1,v));
  const ease=v=>v*v*(3-2*v);
  const rnd=(a,b)=>a+Math.random()*(b-a);

  function project(x,y,z){
    const c=Math.cos(rot),s=Math.sin(rot),X=x*c-z*s,Z=x*s+z*c,scale=H*.105,cam=10;
    return {x:W/2+X*scale/(1+Z/cam),y:H*.56-y*scale/(1+Z/cam)};
  }

  function glow(q,size,alpha,color){
    ctx.globalAlpha=alpha;
    const g=ctx.createRadialGradient(q.x,q.y,0,q.x,q.y,size*8);
    g.addColorStop(0,'#ffffff'); g.addColorStop(.18,color); g.addColorStop(1,'transparent');
    ctx.fillStyle=g; ctx.beginPath(); ctx.arc(q.x,q.y,size*8,0,TAU); ctx.fill();
  }

  function background(){
    const g=ctx.createRadialGradient(W*.5,H*.48,0,W*.5,H*.5,Math.max(W,H)*.8);
    g.addColorStop(0,'#19091d');g.addColorStop(.45,'#09040f');g.addColorStop(1,'#020106');
    ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    for(let i=0;i<190;i++){ctx.globalAlpha=.06+.05*Math.sin(time*.7+i);ctx.fillStyle='#ffb8dc';ctx.fillRect((i*83%1000)/1000*W,(i*47%1000)/1000*H,1,1)}
    ctx.globalAlpha=1;
  }

  function numberPoints(n){
    const c=document.createElement('canvas');c.width=360;c.height=440;const g=c.getContext('2d');
    g.fillStyle='#fff';g.font='bold 370px Arial';g.textAlign='center';g.textBaseline='middle';g.fillText(String(n),180,220);
    const d=g.getImageData(0,0,360,440).data,a=[];
    for(let y=0;y<440;y+=3)for(let x=0;x<360;x+=3)if(d[(y*360+x)*4+3]>100)a.push({x:(x-180)/68,y:(220-y)/68});
    return a;
  }

  function buildNumber(n,fromOutside=true){
    const t=numberPoints(n);
    countdownParticles.length=0;
    for(let i=0;i<3600;i++){
      const q=t[i%t.length],a=rnd(0,TAU),r=fromOutside?rnd(3.4,6):rnd(.05,.3);
      countdownParticles.push({x:Math.cos(a)*r,y:Math.sin(a)*r*.72,z:rnd(-.3,.3),tx:q.x,ty:q.y,tz:rnd(-.08,.08),p:rnd(0,TAU),s:rnd(.8,1.15)});
    }
  }

  function drawCountdown(){
    const e=ease(progress);
    countdownParticles.forEach((p,i)=>{
      const q=project(p.x+(p.tx-p.x)*e,p.y+(p.ty-p.y)*e,p.z+(p.tz-p.z)*e);
      glow(q,.48+.08*p.s,.68+.15*Math.sin(time*2+p.p),colors[i%colors.length]);
    });
  }

  // ==================== CAKE MODULE ====================
  // Only this section should be edited when changing the cake design.
  const cake=[];
  function addCakeParticle(x,y,z,size,color,type='body'){cake.push({x,y,z,size,color,type,p:rnd(0,TAU)});}
  function buildCake(){
    cake.length=0;
    // Three tight tiers: wide bottom, narrower middle, narrow top.
    const tiers=[
      {r:1.78,y:-1.12,h:.62,count:3600,base:'#fff6fb'},
      {r:1.38,y:-.48,h:.56,count:3000,base:'#ffe8f3'},
      {r:1.02,y:.10,h:.50,count:2500,base:'#fff9fc'}
    ];
    tiers.forEach((t,ti)=>{
      for(let i=0;i<t.count;i++){
        const a=rnd(0,TAU),rr=t.r*Math.sqrt(Math.random()),y=t.y+rnd(-t.h/2,t.h/2);
        addCakeParticle(Math.cos(a)*rr,y,Math.sin(a)*rr,rnd(.055,.115),t.base,'body');
      }
      // Dense smooth cream rims.
      for(let ring=0;ring<3;ring++){
        for(let i=0;i<900;i++){
          const a=i*TAU/900,rr=t.r+.018*ring,y=t.y+t.h/2-.035*ring+Math.sin(a*7+ring)*.035;
          addCakeParticle(Math.cos(a)*rr,y,Math.sin(a)*rr,rnd(.045,.09),ring===1?'#fff':'#ffd7e9','cream');
        }
      }
      // Chocolate drip / decorative band.
      for(let i=0;i<520;i++){
        const a=i*TAU/520,rr=t.r+.012,y=t.y+t.h/2-.06+Math.abs(Math.sin(a*5))*.04;
        addCakeParticle(Math.cos(a)*rr,y,Math.sin(a)*rr,rnd(.045,.085),'#6f382d','chocolate');
      }
    });
    // Strawberries around the top edge.
    for(let i=0;i<14;i++){
      const a=i*TAU/14,rr=.86;
      for(let j=0;j<75;j++){
        const yy=.35+rnd(-.16,.18),aa=a+rnd(-.10,.10),rad=.13*Math.sqrt(Math.random());
        addCakeParticle(Math.cos(aa)*(rr+rad),yy,Math.sin(aa)*(rr+rad),rnd(.045,.085),'#ff628f','strawberry');
      }
      for(let j=0;j<18;j++)addCakeParticle(Math.cos(a)*.86+rnd(-.04,.04),.50+rnd(-.03,.08),Math.sin(a)*.86+rnd(-.04,.04),.045,'#fff2b9','seed');
    }
    // Seven candles and warm flames.
    for(let i=0;i<7;i++){
      const a=i*TAU/7+.2,rr=.62;
      for(let j=0;j<150;j++)addCakeParticle(Math.cos(a)*rr+rnd(-.025,.025),.45+j*.004,Math.sin(a)*rr+rnd(-.025,.025),.055,j%2?'#f8b8d9':'#fff1c9','candle');
      for(let j=0;j<110;j++){const aa=rnd(0,TAU),rad=rnd(0,.13);addCakeParticle(Math.cos(a)*rr+Math.cos(aa)*rad,1.18+rnd(-.12,.22),Math.sin(a)*rr+Math.sin(aa)*rad,.055,'#ffd76d','flame');}
    }
    buildBirthdayText();
  }
  function buildBirthdayText(){
    const c=document.createElement('canvas');c.width=1400;c.height=180;const g=c.getContext('2d');
    g.fillStyle='#fff';g.font='bold 68px Arial';g.textAlign='center';g.textBaseline='middle';g.fillText('HAPPY BIRTHDAY JIXUANHANG',700,90);
    const d=g.getImageData(0,0,1400,180).data;
    for(let y=0;y<180;y+=3)for(let x=0;x<1400;x+=3)if(d[(y*1400+x)*4+3]>120){
      addCakeParticle((x-700)/180,-.82,(y-90)/55-2.65,.045,'#ffe9a8','text');
    }
  }
  buildCake();

  function drawCake(){
    ctx.globalCompositeOperation='lighter';
    cake.forEach((p,i)=>{
      const q=project(p.x,p.y,p.z);
      const shimmer=p.type==='text'?1.0:.72+.18*Math.sin(time*1.3+p.p);
      glow(q,p.size,shimmer,p.color);
    });
    ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;
  }
  // ================== END CAKE MODULE ==================

  function drawBurst(){
    ctx.globalCompositeOperation='lighter';
    for(let i=0;i<1500;i++){const a=i*TAU/1500+time*.5,r=1+((i*17)%100)/100*6.5,q=project(Math.cos(a)*r,Math.sin(a)*r*.72,Math.sin(a*2+time)*1.6);glow(q,.35,.5,colors[i%colors.length]);}
    ctx.globalCompositeOperation='source-over';
  }

  async function wait(ms){return new Promise(r=>setTimeout(r,ms));}
  async function countdown(){
    const id=++runId; mode='count';state.textContent='粒子倒数';
    for(let n=5;n>=1;n--){
      if(id!==runId)return;
      buildNumber(n,true);progress=0;
      const start=performance.now();
      while(performance.now()-start<1050){progress=clamp((performance.now()-start)/850);await new Promise(r=>requestAnimationFrame(r));}
      // brief clean gap prevents the next digit from overlapping the previous one.
      mode='gap';progress=1;await wait(150);
    }
    mode='burst';state.textContent='粒子爆散';await wait(900);
    mode='cake';state.textContent='生日星云 · 蛋糕形成';progress=0;
    const t=performance.now();while(performance.now()-t<1800){progress=clamp((performance.now()-t)/1800);await new Promise(r=>requestAnimationFrame(r));}
    audio.muted=false;audio.currentTime=0; // one and only one audio play call happened from the button gesture
  }

  document.getElementById('begin').addEventListener('click',async()=>{
    audio.currentTime=0;audio.muted=true;
    try{await audio.play();}catch(e){console.warn('audio start blocked',e)}
    start.classList.add('hide');
    countdown();
  });
  document.getElementById('again').addEventListener('click',()=>location.reload());
  canvas.addEventListener('pointerdown',e=>{canvas.setPointerCapture(e.pointerId);canvas._x=e.clientX;});
  canvas.addEventListener('pointermove',e=>{if(canvas.hasPointerCapture(e.pointerId)){targetRot+=(e.clientX-canvas._x)*.004;canvas._x=e.clientX;}});
  canvas.addEventListener('pointerup',e=>canvas.releasePointerCapture(e.pointerId));
  document.getElementById('files').addEventListener('change',e=>{for(const f of e.target.files){const im=new Image();im.src=URL.createObjectURL(f);photos.push(im);}e.target.value='';});

  function frame(){time+=.016;rot+=(targetRot-rot)*.055;background();if(mode==='count')drawCountdown();else if(mode==='burst')drawBurst();else if(mode==='cake'||mode==='gap')drawCake();requestAnimationFrame(frame);}
  frame();
})();
