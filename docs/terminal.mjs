import {createEngine} from './engine.mjs';
const engine=createEngine(),output=document.querySelector('#output'),input=document.querySelector('#input');
const history=[];let index=0;
function append(item){const p=document.createElement('p');p.className=item.kind||'normal';if(item.url){const a=document.createElement('a');a.href=item.url;a.textContent=item.text;a.target='_blank';a.rel='noopener noreferrer';p.append(a)}else p.textContent=item.text;output.append(p);while(output.childElementCount>350)output.firstElementChild.remove();output.scrollTop=output.scrollHeight}
function execute(raw){const cmd=raw.trim();if(!cmd)return;history.push(cmd);if(history.length>100)history.shift();index=history.length;append({text:'visitor@hiddenware:~$ '+cmd,kind:'prompt'});const result=engine.run(cmd);if(result.clear)output.replaceChildren();result.lines.forEach(append);input.value='';input.focus()}
document.querySelector('#command').addEventListener('submit',e=>{e.preventDefault();execute(input.value)});
document.querySelector('#quick').addEventListener('click',e=>{const btn=e.target.closest('button[data-cmd]');if(btn)execute(btn.dataset.cmd)});
input.addEventListener('keydown',e=>{if(e.key==='ArrowUp'||e.key==='ArrowDown'){e.preventDefault();index=Math.max(0,Math.min(history.length,index+(e.key==='ArrowUp'?-1:1)));input.value=history[index]||''}});
append({text:'HIDDENWARE404 [v1.0] // ACCESS GRANTED',kind:'accent'});append({text:'Digite help para explorar. Ou siga o coelho branco.'});append({text:'Este terminal é uma simulação: nenhum comando é executado no sistema operacional.'});
