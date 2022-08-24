/* @refresh reload */
import log from "loglevel";
import * as Tone from "tone";

const output = document.createElement("div") as HTMLDivElement;
const outputQuarter = document.createElement("div") as HTMLDivElement;
const btn = document.createElement("button") as HTMLButtonElement;
btn.innerText = "Play";
output.id = "output";
const root = document.getElementById("root") as HTMLDivElement;

root.appendChild(output);
root.appendChild(outputQuarter);
root.appendChild(btn);

Tone.Transport.setLoopPoints("0:0:0", "1:0:0");
Tone.Transport.loop = true;

let playing = false;
let quarterNote = -1;

function outputTxt(text: any) {
  output.innerText = text;
}

function loadDrumLoop() {
  const player = new Tone.Player("/samples/kick(2).wav").toMaster();
  const clap = new Tone.Player("/samples/clap.wav").toMaster();
  const _loop = new Tone.Loop(time => {
    quarterNote = (quarterNote + 1) % 4;
    player.start(time);
  }, "4n").start(0);
  Tone.Transport.scheduleRepeat(time => {
    clap.start(time);
  }, "2n");
}

function loop(time: number) {
  output.innerText = Tone.Transport.position as string;
  outputQuarter.innerText = quarterNote.toString(); 

  if (playing) {
    requestAnimationFrame(loop);
  }
}

btn.addEventListener("click", async () => {
  playing = true;
  await Tone.start();
  loadDrumLoop();
  await Tone.loaded();
  Tone.Transport.start();
  log.debug("Playing...");
  requestAnimationFrame(loop);
});
