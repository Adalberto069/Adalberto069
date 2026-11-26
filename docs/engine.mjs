export function createEngine(){
 const files={"about.txt":"HIDDENWARE404 — Adalberto Carlos\nDesenvolvimento, jogos, automação e segurança de aplicações.","manifesto.txt":"404: Limits not found.\nThink beyond the system.\nFollow the white rabbit.","rabbit.txt":"O coelho deixou uma mensagem codificada. Digite rabbit."};
 const link=(text,url)=>({text,url,kind:"link"});
 const line=(text,kind="normal")=>({text,kind});
 let unlocked=false;
 function decode(s){
   if(!s||s.length>1024||!/^[A-Za-z0-9+/]+={0,2}$/.test(s)||s.length%4===1||(s.includes("=")&&s.length%4!==0))throw Error("invalid");
   const alphabet="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
   let bits=0,buffer=0,encoded="";
   for(const c of s.replace(/=+$/,"")){
     buffer=(buffer<<6)|alphabet.indexOf(c);bits+=6;
     if(bits>=8){bits-=8;encoded+="%"+((buffer>>bits)&255).toString(16).padStart(2,"0");buffer&=(1<<bits)-1}
   }
   if(buffer!==0)throw Error("invalid padding");
   return decodeURIComponent(encoded);
 }
 const commands={
 help:()=>[line("COMANDOS","accent"),line("whoami · projects · skills · certificates · lab"),line("ls · cat <arquivo> · echo <texto> · date · clear"),line("rabbit · decode <base64> · answer <resposta> · reset")],
 whoami:()=>[line("HIDDENWARE404","accent"),line("Adalberto Carlos // dev, gamer e explorador de sistemas.")],
 projects:()=>[link("AIScan","https://github.com/Adalberto069/Aiscan"),link("Modder's Hub","https://github.com/Adalberto069/modder-s-hub"),link("HIDDENIA","https://github.com/Adalberto069/HIDDENIA")],
 skills:()=>[line("Python · TypeScript · JavaScript · Lua"),line("React · Node.js · SQL · Linux"),line("Segurança de aplicações · automação · laboratórios")],
 certificates:()=>[link("Central de formação","https://github.com/Adalberto069/Adalberto069/tree/main/certificados")],
 lab:()=>[link("HiddenLab","https://github.com/Adalberto069/Adalberto069/tree/main/labs")],
 ls:()=>Object.keys(files).map(x=>line(x)),
 cat:arg=>[line(Object.hasOwn(files,arg)?files[arg]:"Arquivo não encontrado.",Object.hasOwn(files,arg)?"normal":"error")],
 echo:arg=>[line(arg)],date:()=>[line(new Date().toLocaleString("pt-BR"))],
 rabbit:()=>unlocked?[line("LEVEL 01 COMPLETO — siga explorando.","accent")]:[line("LEVEL 01 // ENCODING","accent"),line("Mensagem: d2hpdGUgcmFiYml0"),line("Dica: Base64 é codificação, não criptografia."),line("Use decode <mensagem> e depois answer <resposta>.")],
 decode:arg=>{try{return [line(decode(arg))]}catch{return [line("Base64 inválido ou texto não UTF-8.","error")]}},
 answer:arg=>{if(arg.toLowerCase().trim().replace(/\s+/g," ")==="white rabbit"){unlocked=true;return [line("ACCESS GRANTED // LEVEL 01 COMPLETE","accent"),line("Você decodificou a mensagem. 404: Limits not found.")]}return [line("Resposta incorreta. Digite rabbit para ver a pista.","error")]},
 reset:()=>{unlocked=false;return [line("Progresso reiniciado.")]},clear:()=>[]
 };
 return {run(raw){const input=String(raw).trim();if(!input)return {lines:[]};const m=input.match(/^(\S+)(?:\s+([\s\S]*))?$/);const cmd=m[1].toLowerCase(),arg=m[2]||"";return Object.hasOwn(commands,cmd)?{clear:cmd==="clear",lines:commands[cmd](arg)}:{lines:[line("Comando desconhecido. Digite help.","error")]}}};
}
