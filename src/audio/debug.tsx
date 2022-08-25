import * as Tone from "tone";
import log from "loglevel";
import "./debug.css";

const debugContainer = (
  <div id="debug-container"> 
    <div id="control-panel">
      <button onclick={hideShowDebug} class="minimize-btn">Test</button> 
    </div>
  </div>
) as HTMLDivElement;
const canvas = <canvas id="debug-canvas" /> as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const w = new Tone.Analyser('waveform', 16);

let paused = true;
let fpsT = 0;

function fps(t: number) {
  const d = t - fpsT;
  const fps = (1000 / d).toFixed(1);
  ctx.fillText(`FPS: ${fps}`, 10, 70);
  fpsT = t;
}

function masterWaveform() {
  function barHeights(waves: Float32Array, maxHeight: number) {
    return waves.map(wave => {
      const amplitude = Math.abs(wave / 1);
      return maxHeight * amplitude * 8; 
    });
  }
  const waves = w.getValue();
  const barWidth = (canvas.width - 10) / waves.length; 
  ctx.strokeStyle = 'green';
  barHeights(waves as Float32Array, 30).forEach((barHeight, i) => {
    ctx.fillRect(i * barWidth, 125, barWidth, -barHeight);
  })
}

function debug(time: number) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "gray";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.font = "20px monospace";
  ctx.fillText("DEBUG", 10, 20);
  ctx.fillText("Audio Position: " + Tone.Transport.position.toString(), 10, 50);
  fps(time);
  masterWaveform();
}

function hideShowDebug(e: MouseEvent) {
  if (!e.currentTarget) return;
  const btn = e.currentTarget as HTMLButtonElement;
  if (canvas.classList.contains("hide")) {
    canvas.classList.remove("hide");
    btn.innerText = "Hide";
    return;
  }
  canvas.classList.add("hide");
  btn.innerText = "Show";
}

function debugLoop(time: number) {
  debug(time);

  if (paused) return;
  window.requestAnimationFrame(debugLoop);
}

function mountDebug() {
  // Add the debug elements to the page
  debugContainer.appendChild(canvas);
  document.body.appendChild(debugContainer);
  // Add eaveform to master channel
  Tone.getDestination().connect(w);
}

export default {
  init() {
    paused = false;
    mountDebug();
    window.requestAnimationFrame(debugLoop);
  },
  stop() {
    paused = true;
  },
  start() {
    paused = false;
    requestAnimationFrame(debugLoop);
  },
  /**
   * Hide the debug area
   */
  hide() {
    debugContainer.classList.add("hidden");
  },
  /**
   * Show the debug area
   */
  show() {
    debugContainer.classList.add("hidden");
  },
};
