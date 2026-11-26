import {createEngine} from './engine.mjs?v=showcase1';
import {createConsole,createSequence,rabbitFrames} from './console-core-v2.mjs?v=2.1';
import {createAsciiRenderer} from './ascii-gallery.mjs?v=2.1';
const gallery=createAsciiRenderer();
let live=null;
const stopButton=document.querySelector('#stop-animation');
function stopLive(){
 if(!live)return false;
 if(live.timer!==null)clearInterval(live.timer);
 live.pre.remove();live=null;stopButton.hidden=true;return true;
}
function playLive(name){
 append({text:'ASCII // '+name.toUpperCase()+' — Ctrl+C ou stop para sair',kind:'accent'});
 const pre=append({text:gallery.frame(name,0),kind:'ascii'});
 pre.classList.add('live-ascii');pre.setAttribute('aria-hidden','true');
 const start=performance.now();
 live={pre,timer:null};stopButton.hidden=false;scroll();
 if(!reduced())live.timer=setInterval(()=>{if(!document.hidden)pre.textContent=gallery.frame(name,(performance.now()-start)/1000)},100);
 else append({text:'Movimento reduzido: quadro estático.',kind:'muted'});
}
const shell=createConsole(createEngine()), output=document.querySelector('#output'), input=document.querySelector('#input');
const sequence=createSequence(), history=[];let index=0, settle=null;
const reduced=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function append(item){
 const node=document.createElement(item.kind==='ascii'?'pre':'p');node.className=item.kind||'normal';
 if(item.url){const a=document.createElement('a');a.href=item.url;a.textContent=item.text;a.target='_blank';a.rel='noopener noreferrer';node.append(a)}else node.textContent=item.text;
 output.append(node);while(output.childElementCount>350)output.firstElementChild.remove();scroll();return node;
}
function scroll(){output.scrollTop=output.scrollHeight}
function finish(){stopLive();sequence.cancel();const done=settle;settle=null;if(done)done()}
function startBoot(){const lines=shell.boot();if(reduced()){lines.forEach(append);return}let displayed=0;const rest=()=>{while(displayed<lines.length)append(lines[displayed++])};settle=rest;sequence.play(lines,115,item=>{append(item);displayed++},()=>{settle=null})}
function playRabbit(lines){
 if(reduced()){append({text:rabbitFrames().at(-2),kind:'ascii'});lines.forEach(append);return}
 const pre=append({text:'',kind:'ascii'});pre.classList.add('rabbit-motion');pre.setAttribute('aria-hidden','true');
 const done=()=>{pre.remove();lines.forEach(append)};settle=done;
 sequence.play(rabbitFrames(),145,frame=>{pre.textContent=frame;scroll()},()=>{settle=null;done()});
}
function execute(raw){
 const cmd=raw.trim();if(!cmd)return;finish();history.push(cmd);if(history.length>100)history.shift();index=history.length;
 append({text:'hiddenware > '+cmd,kind:'prompt'});
 const result=shell.run(cmd);if(result.clear)output.replaceChildren();
 if(result.animation){playLive(result.animation)}else if(result.effect==='rabbit'){append({text:'[*] Follow the white rabbit...','kind':'accent'});playRabbit(result.lines)}else result.lines.forEach(append);
 input.value='';input.focus();
}
document.querySelector('#command').addEventListener('submit',e=>{e.preventDefault();execute(input.value)});
document.querySelector('#quick').addEventListener('click',e=>{const btn=e.target.closest('button[data-cmd]');if(btn)execute(btn.dataset.cmd)});
input.addEventListener('keydown',e=>{if(e.key==='ArrowUp'||e.key==='ArrowDown'){e.preventDefault();index=Math.max(0,Math.min(history.length,index+(e.key==='ArrowUp'?-1:1)));input.value=history[index]||''}});
stopButton.addEventListener('click',()=>execute('stop'));
document.addEventListener('keydown',e=>{if(e.ctrlKey&&e.key.toLowerCase()==='c'&&live&&!window.getSelection()?.toString()){e.preventDefault();execute('stop')}});
startBoot();
