// ==================== BIRTHDAY SCENE MODULE ====================
// Cake + HAPPY BIRTHDAY JIXUANHANG. Countdown is isolated in countdown.js.
const BirthdayDesign=(()=>{
 const TAU=Math.PI*2;
 function layer(radius,y,height,count,body){const a=[];for(let i=0;i<count;i++){const ang=Math.random()*TAU,rr=radius*Math.sqrt(Math.random());a.push({x:Math.cos(ang)*rr,y:y+(Math.random()-.5)*height,z:Math.sin(ang)*rr,size:.045+Math.random()*.06,color:body});}for(let i=0;i<Math.floor(count*.25);i++){const ang=Math.random()*TAU,rr=radius+.015;a.push({x:Math.cos(ang)*rr,y:y+height*.5+.04*Math.sin(ang*14),z:Math.sin(ang)*rr,size:.04+Math.random()*.045,color:'#fff8fc'});}return a;}
 function buildCake(){return [...layer(2.08,-1.12,.66,4300,'#fff4f8'),...layer(1.55,-.47,.60,3700,'#ffdce9'),...layer(1.08,.16,.54,3100,'#fff9fc')];}
 function titlePoints(){const c=document.createElement('canvas');c.width=1400;c.height=180;const g=c.getContext('2d');g.fillStyle='#fff';g.font='900 68px Arial Black,Arial,sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('HAPPY BIRTHDAY JIXUANHANG',700,90);const d=g.getImageData(0,0,1400,180).data,a=[];for(let y=0;y<180;y+=3)for(let x=0;x<1400;x+=3)if(d[(y*1400+x)*4+3]>100)a.push({x:(x-700)/180,y:-.82,z:(y-90)/55-2.65,size:.05,color:'#ffe9a8',type:'text'});return a;}
 return {buildCake,titlePoints};
})();
