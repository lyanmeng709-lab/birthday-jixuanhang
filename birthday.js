// ==================== BIRTHDAY SCENE MODULE ====================
// ONLY: cake geometry, cake decorations, and HAPPY BIRTHDAY JIXUANHANG.
// Countdown, audio, camera and page flow are intentionally NOT here.
const BirthdayDesign=(()=>{
 const TAU=Math.PI*2;
 const layer=(radius,y,height,count,body)=>{const a=[];for(let i=0;i<count;i++){const ang=Math.random()*TAU,rr=radius*Math.sqrt(Math.random());a.push({x:Math.cos(ang)*rr,y:y+(Math.random()-.5)*height,z:Math.sin(ang)*rr,size:.035+Math.random()*.045,color:body,type:'cake'});}for(let i=0;i<count*.28;i++){const ang=Math.random()*TAU,rr=radius*(.985+Math.random()*.025);a.push({x:Math.cos(ang)*rr,y:y+height*.49+.045*Math.sin(ang*16),z:Math.sin(ang)*rr,size:.032+Math.random()*.035,color:'#fff9fc',type:'frosting'});}return a;};
 function buildCake(){
   const a=[...layer(2.12,-1.14,.68,4400,'#fff3f8'),...layer(1.58,-.48,.62,3800,'#ffd8e8'),...layer(1.10,.18,.56,3200,'#fff8fb')];
   // chocolate bands
   for(let tier=0;tier<3;tier++){const r=[2.13,1.59,1.11][tier],y=[-1.03,-.39,.27][tier];for(let i=0;i<900;i++){const q=Math.random()*TAU,rr=r*(.97+Math.random()*.03);a.push({x:Math.cos(q)*rr,y:y+.01*Math.sin(q*12),z:Math.sin(q)*rr,size:.04+Math.random()*.035,color:'#6b382d',type:'chocolate'});}}
   // strawberries on the upper two tiers
   for(let i=0;i<34;i++){const tier=i%2,r=tier?1.0:1.43,y=tier?.53:.03,ang=Math.random()*TAU;a.push({x:Math.cos(ang)*r,y:y+Math.random()*.12,z:Math.sin(ang)*r,size:.11,color:'#ff6fae',type:'strawberry'});for(let k=0;k<4;k++)a.push({x:Math.cos(ang)*r+(Math.random()-.5)*.05,y:y+.08,z:Math.sin(ang)*r+(Math.random()-.5)*.05,size:.018,color:'#ffe9a8',type:'seed'});}
   // candles and flames
   for(let i=0;i<7;i++){const ang=i*TAU/7,r=.62;a.push({x:Math.cos(ang)*r,y:1.02,z:Math.sin(ang)*r,size:.075,color:'#f5c76c',type:'candle'});for(let k=0;k<55;k++)a.push({x:Math.cos(ang)*r+(Math.random()-.5)*.05,y:1.15+Math.random()*.24,z:Math.sin(ang)*r+(Math.random()-.5)*.05,size:.025+Math.random()*.04,color:'#ffd86b',type:'flame'});}
   return a;
 }
 function titlePoints(){
   const c=document.createElement('canvas');c.width=1500;c.height=190;const g=c.getContext('2d');g.fillStyle='#fff';g.font='900 70px Arial Black,Arial,sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('HAPPY BIRTHDAY JIXUANHANG',750,95);
   const d=g.getImageData(0,0,1500,190).data,a=[];for(let y=0;y<190;y+=3)for(let x=0;x<1500;x+=3)if(d[(y*1500+x)*4+3]>100)a.push({x:(x-750)/185,y:-.82,z:(y-95)/58-2.72,size:.055,color:'#ffe7a1',type:'text'});return a;
 }
 return {buildCake,titlePoints};
})();
