import {createEngine} from './engine.mjs';
import {createConsole,createSequence,rabbitFrames} from './console-core-v2.mjs';
const shell=createConsole(createEngine()), output=document.querySelector('#output'), input=document.querySelector('#input'), soundButton=document.querySelector('#sound-toggle');
const sequence=createSequence(), history=[];let index=0, sound=false, audio=null, settle=null;
const reduced=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function append(item){
 const node=document.createElement(item.kind==='ascii'?'pre':'p');node.className=item.kind||'normal';
 if(item.url){const a=document.createElement('a');a.href=item.url;a.textContent=item.text;a.target='_blank';a.rel='noopener noreferrer';node.append(a)}else node.textContent=item.text;
 output.append(node);while(output.childElementCount>350)output.firstElementChild.remove();scroll();return node;
}
function scroll(){output.scrollTop=output.scrollHeight}
function finish(){sequence.cancel();const done=settle;settle=null;if(done)done()}
function setSound(value){sound=value;soundButton.textContent='Som: '+(sound?'on':'off');soundButton.setAttribute('aria-pressed',String(sound))}
function beep(){if(!sound)return;try{const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;audio ||= new AC();if(audio.state==='suspended')audio.resume().catch(()=>{});const o=audio.createOscillator(),g=audio.createGain();o.type='sine';o.frequency.value=620;g.gain.setValueAtTime(.025,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.075);o.connect(g);g.connect(audio.destination);o.start();o.stop(audio.currentTime+.08)}catch{}}
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
 if(result.sound){setSound(result.sound==='toggle'?!sound:result.sound==='on');append({text:'Som '+(sound?'ativado.':'desativado.'),kind:'muted'})}
 beep();if(result.effect==='rabbit'){append({text:'[*] Follow the white rabbit...','kind':'accent'});playRabbit(result.lines)}else result.lines.forEach(append);
 input.value='';input.focus();
}
document.querySelector('#command').addEventListener('submit',e=>{e.preventDefault();execute(input.value)});
document.querySelector('#quick').addEventListener('click',e=>{const btn=e.target.closest('button[data-cmd]');if(btn)execute(btn.dataset.cmd)});
soundButton.addEventListener('click',()=>execute('sound'));
input.addEventListener('keydown',e=>{if(e.key==='ArrowUp'||e.key==='ArrowDown'){e.preventDefault();index=Math.max(0,Math.min(history.length,index+(e.key==='ArrowUp'?-1:1)));input.value=history[index]||''}});
startBoot();
