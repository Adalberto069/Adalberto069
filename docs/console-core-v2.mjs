export function getBanners(){
return [
String.raw`          /\   /\
         /  \ /  \
         |  | |  |
         |  |_|  |
        /         \
       |  o     o  |
        \    Y    /
         '-------'
       .-----------.
       |    404    |
       |===========|
   ____|___________|____
   \___________________/`,
String.raw`         (\__/)
         (o  o)
         /|  |\
        (_|__|_)
         /    \
   .------------------.
   \                  /
    \   RABBIT HOLE  /
     \              /
      '------------'`,
String.raw`     _  _    ___    _  _
    | || |  / _ \  | || |
    | || |_| | | |_| || |_
    |__   _| |_| |__   _|
       |_|  \___/   |_|

     SYSTEM / LIMITS
        NOT FOUND

       (\_/)
       (o.o)
       (> <)`
];
}

export function rabbitFrames(){
 const hat=[" .-------."," |  404  |","_|_______|_","\\_________/"];
 const frames=[];
 const width=36,height=9;
 function draw(sprite,x,y,withHat=true){
   const grid=Array.from({length:height},()=>Array(width).fill(" "));
   const put=(s,col,row)=>{if(row<0||row>=height)return;[...s].forEach((c,i)=>{if(c!==" "&&col+i>=0&&col+i<width)grid[row][col+i]=c})};
   put("____________________",12,7);put("  (________) ",24,7);
   if(withHat)hat.forEach((s,i)=>put(s,0,4+i));
   sprite.forEach((s,i)=>put(s,x,y+i));
   return grid.map(r=>r.join("").trimEnd()).join("\n");
 }
 frames.push(draw([],0,0),draw(["(\\ /)"],3,3),draw(["(\\ /)","(o.o)"],3,2),draw(["(\\ /)","(o.o)","(> <)"],3,0));
 const hop=["(\\_/)","(o.o)"," / > "];
 for(const [x,y] of [[10,1],[15,3],[20,1],[25,3],[28,4],[28,5],[28,6]])frames.push(draw(hop,x,y));
 frames.push(draw([],0,0),draw(["   *"],26,4),draw([],0,0));
 return frames;
}

export function createConsole(base,random=Math.random){
 const line=(text,kind="normal")=>({text,kind});
 const banner=()=>line(getBanners()[Math.min(2,Math.max(0,Math.floor(random()*3)))],"ascii");
 const boot=()=>[banner(),line("H I D D E N W A R E 4 0 4","accent"),line("HiddenTerminal Framework v2.0"),line("404: Limits not found.","accent"),line("[*] Initializing local console...","muted"),line("[+] Portfolio and Rabbit Hole ready","accent"),line("Digite help ou show modules. Follow the white rabbit.","muted")];
 function run(raw){
  const cmd=String(raw).trim().toLowerCase().replace(/\s+/g," ");
  if(cmd==="banner")return {lines:[banner(),line("404: Limits not found.","accent")]};
  if(cmd==="version")return {lines:[line("HiddenTerminal Framework v2.0 // Rabbit Hole Edition","accent"),line("HTML · CSS · JavaScript | Local simulated shell")]};
  if(cmd==="show modules")return {lines:[line("AVAILABLE MODULES","accent"),line("rabbit/encoding   [challenge]"),line("portfolio         [projects]"),line("hiddenlab         [source code]"),line("certificates      [learning]"),line("Use: use <module>","muted")]};
  if(cmd.startsWith("use ")){
   const aliases={"rabbit/encoding":"rabbit","portfolio":"projects","hiddenlab":"lab","certificates":"certificates"};
   const name=cmd.slice(4);
   return Object.hasOwn(aliases,name)?run(aliases[name]):{lines:[line("Módulo desconhecido. Digite show modules.","error")]};
  }
  if(cmd==="sound"||cmd==="sound on"||cmd==="sound off")return {sound:cmd==="sound"?"toggle":cmd.slice(6),lines:[]};
  if(cmd==="help"){const r=base.run(raw);return {...r,lines:[...r.lines,line("banner · version · show modules · use <module>"),line("sound on / sound off · sound (alternar)")]}}
  const result=base.run(raw);
  if(cmd==="rabbit")return {...result,effect:"rabbit"};
  return result;
 }
 return {boot,run};
}

export function createSequence(clock=globalThis){
 let timer=null,generation=0;
 function cancel(){generation++;if(timer!==null)clock.clearTimeout(timer);timer=null}
 function play(frames,delay,draw,done=()=>{}){
   cancel();const ticket=generation;let i=0;
   function next(){if(ticket!==generation)return;timer=null;draw(frames[i++]);if(ticket!==generation)return;if(i<frames.length)timer=clock.setTimeout(next,delay);else done()}
   if(frames.length)next();else done();
 }
 return {play,cancel};
}
