// Replayable animation controller. It never changes the challenge state.
export function createRabbitAnimation(scene, clock = globalThis) {
  let timer = null;
  function stop() {
    if (timer !== null) clock.clearTimeout(timer);
    timer = null;
    scene.classList.remove('is-running');
  }
  function play() {
    stop();
    // Flush the removed class so a repeated command restarts the CSS animation.
    scene.getBoundingClientRect();
    scene.classList.add('is-running');
    timer = clock.setTimeout(stop, 3450);
  }
  return {play, stop};
}
