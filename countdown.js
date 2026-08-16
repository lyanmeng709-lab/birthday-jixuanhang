// ==================== COUNTDOWN MODULE ====================
// Clean seven-segment particle digits. Each segment has a dense, even particle field.
const Countdown=(()=>{
 const SEG={a:[[-1.35,1.8],[1.35,1.8]],b:[[1.35,1.8],[1.35,0]],c:[[1.35,0],[1.35,-1.8]],d:[[-1.35,-1.8],[1.35,-1.8]],e:[[-1.35,0],[-1.35,-1.8]],f:[[-1.35,1.8],[-1.35,0]],g:[[-1.35,0],[1.35,0]]};
 const MAP={0:'abcdef',1:'bc',2:'abged',3:'abgcd',4:'fgbc',5:'afgcd',6:'afgecd',7:'abc',8:'abfgcde',9:'abfgcd'};
 function points(n){const out=[];for(const key of MAP[n]){const s=SEG[key];for(let i=0;i<600;i++){const t=i/599;out.push({x:s[0][0]+(s[1][0]-s[0][0])*t+(Math.random()-.5)*.018,y:s[0][1]+(s[1][1]-s[0][1])*t+(Math.random()-.5)*.018});}}return out;}
 function build(n,count=4200){const t=points(String(n));return Array.from({length:count},(_,i)=>{const q=t[i%t.length],a=Math.random()*Math.PI*2,r=5+Math.random()*2;return{sx:Math.cos(a)*r,sy:Math.sin(a)*r*.72,sz:(Math.random()-.5)*1.2,tx:q.x,ty:q.y,tz:(Math.random()-.5)*.08,p:Math.random()*Math.PI*2,size:.032+Math.random()*.018,color:['#fff','#ffd5e9','#ff9bd3','#ffe9a8'][i%4]};});}
 return{points,build};
})();
