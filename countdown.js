// ==================== COUNTDOWN MODULE ====================
// Arabic numeral particle templates. These are hand-shaped contours, not Chinese numerals or seven-segment digits.
const Countdown=(()=>{
 const W=3.0,H=4.8,th=.34;
 const paths={
  '5':[[1.15,2.25],[-1.15,2.25],[-1.15,.15],[.72,.15],[1.12,-.15],[1.12,-1.35],[.72,-2.15],[-1.15,-2.15]],
  '4':[[.92,-2.2],[.92,2.25],[-1.18,-.15],[1.18,-.15]],
  '3':[[ -1.0,2.25],[.72,2.25],[1.12,1.82],[1.12,.45],[.62,.05],[1.12,-.35],[1.12,-1.75],[.65,-2.2],[-1.05,-2.2]],
  '2':[[ -1.05,1.85],[-.55,2.25],[.65,2.25],[1.1,1.78],[1.1,.65],[-1.1,-1.55],[-1.1,-2.2],[1.15,-2.2]],
  '1':[[ -1.0,1.35],[-.15,2.25],[.55,2.25],[.55,-2.2],[-.25,-2.2]]
 };
 function segment(a,b,out){const dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy),steps=Math.max(2,Math.ceil(len/.035));for(let i=0;i<=steps;i++){const t=i/steps;const x=a[0]+dx*t,y=a[1]+dy*t;for(let k=0;k<Math.max(3,Math.ceil(th/.035));k++){const r=Math.sqrt(Math.random())*th/2,ang=Math.random()*Math.PI*2;out.push({x:x+Math.cos(ang)*r,y:y+Math.sin(ang)*r});}}}
 function points(n){const p=paths[String(n)],out=[];for(let i=0;i<p.length-1;i++)segment(p[i],p[i+1],out);return out;}
 function build(n,count=4800){const t=points(n);return Array.from({length:count},(_,i)=>{const q=t[i%t.length],a=Math.random()*Math.PI*2,r=5+Math.random()*2;return{sx:Math.cos(a)*r,sy:Math.sin(a)*r*.72,sz:(Math.random()-.5)*1.2,tx:q.x,ty:q.y,tz:(Math.random()-.5)*.08,p:Math.random()*Math.PI*2,size:.028+Math.random()*.022,color:['#fff','#ffd5e9','#ff9bd3','#ffe9a8'][i%4]};});}
 return{points,build};
})();
