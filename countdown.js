// COUNTDOWN MODULE — crisp Arabic numerals made from tiny particles.
const Countdown=(()=>{
 const canvas=document.createElement('canvas'),g=canvas.getContext('2d');canvas.width=900;canvas.height=1100;
 function points(n){g.clearRect(0,0,900,1100);g.fillStyle='#fff';g.textAlign='center';g.textBaseline='middle';g.font='900 920px Arial Black,Arial,sans-serif';g.fillText(String(n),450,560);const d=g.getImageData(0,0,900,1100).data,out=[];for(let y=70;y<1030;y+=4)for(let x=70;x<830;x+=4)if(d[(y*900+x)*4+3]>160)out.push({x:(x-450)/155,y:(550-y)/155});return out;}
 function build(n,count=6200){const t=points(n);return Array.from({length:count},(_,i)=>{const p=t[(i*31+Math.floor(i/53))%t.length],a=Math.random()*Math.PI*2,r=4.6+Math.random()*2.5;return{sx:Math.cos(a)*r,sy:Math.sin(a)*r*.68,sz:(Math.random()-.5)*.6,tx:p.x+(Math.random()-.5)*.012,ty:p.y+(Math.random()-.5)*.012,tz:(Math.random()-.5)*.045,size:.028+Math.random()*.018,color:i%11===0?'#ffe8a7':i%4===0?'#ff9fd3':'#fff6fb',tw:Math.random()*6.28};});}
 return{build};})();
