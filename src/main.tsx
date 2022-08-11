/* @refresh reload */
import { render } from 'solid-js/web'
import App from './App'
import './index.css'
// import audio from './audio';

// audio.init();
// const track = audio.tracks.create('1', '1', [
//   true, false, false, false,
//   true, false, false, false,
//   true, false, false, false,
//   true, false, false, false,
// ]);
// audio.setStore({ trackMap: { '1': track }});
// const pattern = audio.patterns.create('1', 'kick', ['1']);
// audio.setStore({ patternMap: {'1': pattern } });
// const instrument = audio.instruments.create('1', { samplerUrl: 'kick(2).wav' })
// audio.setStore({ instrumentMap: { '1': instrument }});

// window.addEventListener('keyup', function(e) {
//   if (e.key === " ") {
//     audio.play();
//   }
// })

render(() => <App />, document.getElementById('root') as HTMLElement);
