import assert from 'node:assert/strict';
import {createEngine} from './engine.mjs';
import {getBanners,rabbitFrames,createConsole,createSequence} from './console-core-v2.mjs';
const e=createConsole(createEngine(),()=>.5);
assert.equal(getBanners().length,3);
assert.equal(e.boot()[0].text,getBanners()[1]);
assert.equal(e.run('banner').lines[0].kind,'ascii');
assert.match(e.run('version').lines[0].text,/v2\.1/);
assert.match(e.run('help').lines.at(-2).text,/show modules/);
assert.equal(e.run('show modules').lines.length,6);
assert.equal(e.run('use portfolio').lines.length,3);
assert.equal(e.run('use rabbit/encoding').effect,'rabbit');
assert.equal(e.run('use __proto__').lines[0].kind,'error');
assert.equal(e.run('sound on').lines[0].kind,'error');
assert.equal(e.run('sound off').lines[0].kind,'error');
assert.equal(e.run('clear').clear,true);
assert.match(e.run('answer white rabbit').lines[0].text,/ACCESS GRANTED/);
assert.match(e.run('rabbit').lines[0].text,/COMPLETO/);
assert.ok(rabbitFrames().every(f=>f.split('\n').length===9&&f.split('\n').every(l=>l.length<=36)));
const timers=new Map();let id=0;const clock={setTimeout(fn){timers.set(++id,fn);return id},clearTimeout(id){timers.delete(id)}};
const s=createSequence(clock), seen=[];let finished=0;
function tick(){const [key,fn]=timers.entries().next().value;timers.delete(key);fn()}
s.play(['a','b'],10,x=>seen.push(x),()=>finished++);assert.deepEqual(seen,['a']);tick();assert.deepEqual(seen,['a','b']);assert.equal(finished,1);
s.play(['c','d'],10,x=>seen.push(x));s.cancel();assert.equal(timers.size,0);assert.equal(seen.at(-1),'c');
console.log('HiddenTerminal v2: testes aprovados.');

import {createAsciiRenderer} from './ascii-gallery.mjs';
const gallery=createAsciiRenderer();
for(const name of gallery.names){
 assert.equal(e.run('ascii '+name).animation,name);
 const a=gallery.frame(name,0),b=gallery.frame(name,1.3);
 assert.equal(a.split('\n').length,30);
 assert.ok(a.split('\n').every(row=>row.length===64));
 assert.notEqual(a,b);
 assert.ok(a.replace(/\s/g,'').length>70);
}
assert.equal(e.run('ascii __proto__').lines[0].kind,'error');
assert.equal(e.run('ascii list').lines.length,8);
assert.match(e.run('stop').lines[0].text,/ready/);
assert.throws(()=>gallery.frame('__proto__'));
