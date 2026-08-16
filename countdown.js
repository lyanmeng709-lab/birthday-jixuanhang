// ==================== COUNTDOWN MODULE ====================
// Stable particle digits. Each digit is rendered independently to avoid distortion.
const Countdown = (() => {
  const TAU=Math.PI*2;
  function points(n){
    const c=document.createElement('canvas'); c.width=360; c.height=480;
    const g=c.getContext('2d'); g.fillStyle='#fff';
    g.font='900 400px Arial Black,Arial,sans-serif'; g.textAlign='center'; g.textBaseline='middle';
    g.fillText(String(n),180,240);
    const d=g.getImageData(0,0,c.width,c.height).data, out=[];
    for(let y=0;y<c.height;y+=3) for(let x=0;x<c.width;x+=3)
      if(d[(y*c.width+x)*4+3]>100) out.push({x:(x-180)/72,y:(240-y)/72});
    return out;
  }
  function build(n,count=3600){
    const t=points(n); return Array.from({length:count},(_,i)=>{const q=t[i%t.length],a=Math.random()*TAU,r=3.8+Math.random()*2.2;return{sx:Math.cos(a)*r,sy:Math.sin(a)*r*.72,tx:q.x,ty:q.y,p:Math.random()*TAU}});
  }
  return {points,build};
})();
