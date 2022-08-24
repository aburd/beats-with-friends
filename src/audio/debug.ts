import * as Tone from "tone";
import "./debug.css";

const debugContainer = document.createElement("div");
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

let paused = true;

function debug(_time: number) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "gray";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.font = "20px monospace";
  ctx.fillText("DEBUG", 10, 20);
  ctx.fillText("Audio Position: " + Tone.Transport.position.toString(), 10, 50);
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

function controls() {
  const controlPanel = document.createElement("div");
  controlPanel.id = "control-panel";
  const hideShowBtn = document.createElement("button");
  hideShowBtn.innerText = "hide";
  hideShowBtn.addEventListener("click", hideShowDebug);
  hideShowBtn.classList.add("minimize-btn");
  controlPanel.appendChild(hideShowBtn);
  debugContainer.appendChild(controlPanel);
}

function debugLoop(time: number) {
  debug(time);

  if (paused) return;
  window.requestAnimationFrame(debugLoop);
}

function mountDebug() {
  // Give identifiers to important debug elements
  debugContainer.id = "debug-container";
  canvas.id = "debug-canvas";
  // Add the debug elements to the page
  debugContainer.appendChild(canvas);
  document.body.appendChild(debugContainer);
  controls();
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
