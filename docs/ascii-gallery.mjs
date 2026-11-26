export function createAsciiRenderer(){
 const W=64,H=30, shades=" .:-=+*#%@";
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 const shade=v=>shades[clamp(Math.floor(v*(shades.length-1)),1,shades.length-1)];
 const rot=(x,z,a)=>[x*Math.cos(a)+z*Math.sin(a),-x*Math.sin(a)+z*Math.cos(a)];
 const grid=()=>Array.from({length:H},()=>Array(W).fill(" "));
 const string=g=>g.map(row=>row.join("")).join("\n");
 const shape=[
 // x, y, z, radii x/y/z, material: 1 fur, 2 inner ear, 3 eyes/nose
 [0,-.57,-.08,.66,.75,.66,1], [0,.42,.18,.57,.56,.51,1],
 [-.31,1.24,.08,.18,.68,.20,1],[.31,1.24,.08,.18,.68,.20,1],
 [-.31,1.27,.235,.105,.51,.066,2],[.31,1.27,.235,.105,.51,.066,2],
 [-.43,-.92,.42,.28,.23,.42,1],[.43,-.92,.42,.28,.23,.42,1],
 [-.25,-.47,.49,.19,.40,.22,1],[.25,-.47,.49,.19,.40,.22,1],
 [0,-.79,-.73,.30,.31,.29,1],
 [-.28,.52,.606,.104,.115,.072,3],[.28,.52,.606,.104,.115,.072,3],
 [-.14,.25,.63,.19,.15,.16,1],[.14,.25,.63,.19,.15,.16,1],
 [0,.32,.773,.10,.065,.045,3]
 ];
 const landPolygons=[
 [[-168,66],[-140,72],[-98,73],[-57,50],[-62,42],[-81,25],[-98,17],[-115,31],[-129,50]],
 [[-99,21],[-86,18],[-77,9],[-82,8],[-91,14]],
 [[-81,10],[-62,12],[-35,-6],[-47,-25],[-64,-55],[-75,-45],[-79,-12]],
 [[-72,60],[-52,82],[-20,78],[-29,60]],
 [[-11,36],[0,47],[20,59],[35,71],[65,74],[108,77],[177,66],[166,51],[136,45],[123,27],[107,10],[96,5],[79,23],[66,26],[50,13],[43,29],[28,42],[12,43]],
 [[-17,36],[12,37],[34,30],[51,10],[40,-13],[21,-35],[10,-34],[-1,-5],[-17,14]],
 [[112,-12],[130,-10],[153,-24],[147,-40],[116,-35]],
 [[95,6],[108,-8],[142,-9],[135,2],[115,7]],
 [[-180,-70],[180,-70],[180,-90],[-180,-90]]
 ];
 function inside(x,y,p){let b=false;for(let i=0,j=p.length-1;i<p.length;j=i++){const a=p[i],c=p[j];if((a[1]>y)!==(c[1]>y)&&x<(c[0]-a[0])*(y-a[1])/(c[1]-a[1])+a[0])b=!b}return b}
 function globe(t){
  const g=grid(),a=t*.65;
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){
   const X=(x-(W-1)/2)/26,Y=((H-1)/2-y)/13.2;
   const q=1-X*X-Y*Y;if(q<0)continue;
   const z=Math.sqrt(q),[u,v]=rot(X,z,-a);
   const lon=Math.atan2(u,v)*180/Math.PI,lat=Math.asin(Y)*180/Math.PI;
   const land=landPolygons.some(p=>inside(lon,lat,p));
   const light=clamp(.30+.68*(.45*X+.48*Y+.75*z),.08,1);
   g[y][x]=land?shade(.35+.65*light):light>.64?"-":light>.30?".":":";
  }
  return string(g);
 }
 function rabbit(t){
  const g=grid(),a=t*.72,c=Math.cos(a),s=Math.sin(a);
  const dx=-s,dz=c;
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){
   const X=(x-(W-1)/2)/15,Y=((H-1)/2-y)/8.5+.31;
   const ox=X*c,oz=X*s;let hit=-Infinity,mat=0,nx=0,ny=0,nz=0;
   for(const [cx,cy,cz,rx,ry,rz,m] of shape){
    const u=(ox-cx)/rx,v=(Y-cy)/ry,w=(oz-cz)/rz,du=dx/rx,dw=dz/rz;
    const A=du*du+dw*dw,B=u*du+w*dw,C=u*u+v*v+w*w-1,D=B*B-A*C;
    if(D<0)continue;
    const z=(-B+Math.sqrt(D))/A;if(z<=hit)continue;
    hit=z;mat=m;
    const nX=(ox+dx*z-cx)/(rx*rx),nY=(Y-cy)/(ry*ry),nZ=(oz+dz*z-cz)/(rz*rz);
    const len=Math.hypot(nX,nY,nZ)||1;nx=(nX*c+nZ*s)/len;ny=nY/len;nz=(-nX*s+nZ*c)/len;
   }
   if(mat){const l=clamp(.34+.66*(-.42*nx+.55*ny+.72*nz),.10,1);g[y][x]=mat===3?"o":mat===2?shade(.17+.35*l):shade(.22+.78*l)}
  }
  return string(g);
 }
 function cube(t){
  const g=grid(),zbuf=Array.from({length:H},()=>Array(W).fill(-Infinity));
  const a=t*.8,b=t*.51;
  const rotate=(x,y,z)=>{const [X,Z]=rot(x,z,a);return [X,y*Math.cos(b)-Z*Math.sin(b),y*Math.sin(b)+Z*Math.cos(b)]};
  for(let axis=0;axis<3;axis++)for(const sign of [-1,1]){
   const normal=[0,0,0];normal[axis]=sign;const [nx,ny,nz]=rotate(...normal);if(nz<0)continue;
   for(let i=0;i<=44;i++)for(let j=0;j<=44;j++){
    const p=[0,0,0];p[axis]=sign;p[(axis+1)%3]=i/22-1;p[(axis+2)%3]=j/22-1;
    const [X,Y,Z]=rotate(...p),scale=4/(4-Z);
    const x=Math.round((W-1)/2+X*scale*10),y=Math.round((H-1)/2-Y*scale*5.2);
    if(x<0||x>=W||y<0||y>=H||Z<=zbuf[y][x])continue;zbuf[y][x]=Z;
    g[y][x]=i===0||i===44||j===0||j===44?"@":shade(clamp(.27+.65*(-.4*nx+.4*ny+.8*nz),.12,1));
   }
  }
  return string(g);
 }
 const hash=(n)=>{const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v)};
 function matrix(t){
  const g=grid(),chars="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&";
  for(let x=0;x<W;x++){const speed=5+hash(x+91)*15,tail=5+Math.floor(hash(x+9)*17),head=Math.floor(t*speed+hash(x)*80);
   for(let y=0;y<H;y++){const d=((head-y)%44+44)%44;if(d>tail)continue;g[y][x]=d===0?"@":d>tail*.72?".":chars[Math.floor(hash(x*91+y*13+Math.floor(t*3))*chars.length)]}}
  return string(g);
 }
 function wormhole(t){
  const g=grid();
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const X=(x-(W-1)/2)/2,Y=y-(H-1)/2,r=Math.hypot(X,Y);if(r<1.4)continue;const a=Math.atan2(Y,X),v=(Math.sin(19/r-t*3+a*3)+Math.cos(a*8+t*.7))/2;g[y][x]=v<-.4?" ":shade(.2+.65*(v+1)/2)}
  return string(g);
 }
 function radar(t){
  const g=grid(),a=t*1.35;const targets=[[-.35,.45],[.52,.15],[.2,-.68],[-.7,-.18]];
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const X=(x-(W-1)/2)/26,Y=((H-1)/2-y)/13,r=Math.hypot(X,Y);if(r>1.02)continue;const angle=Math.atan2(Y,X),d=((a-angle)%(Math.PI*2)+Math.PI*2)%(Math.PI*2);
   if(Math.abs(r-1)<.055||Math.abs(r-.65)<.032||Math.abs(r-.33)<.032||Math.abs(X)<.02||Math.abs(Y)<.03)g[y][x]=".";
   if(d<.85)g[y][x]=d<.12?"#":shade(.18+.48*(1-d/.85));
   if(targets.some(([u,v])=>Math.hypot(X-u,Y-v)<.06))g[y][x]="@";
  }return string(g);
 }
 const renders={earth:globe,rabbit,cube,matrix,wormhole,radar};
 return {names:Object.keys(renders),frame(name,t=0){if(!Object.hasOwn(renders,name))throw Error("Unknown ASCII animation");return renders[name](Number.isFinite(t)?t:0)}};
}
