import {useEffect, useState} from 'react'
import Sequencer from './components/Sequencer'
import {Bar} from './audio/types'
import api from './api'
import * as audio from './audio'
import './App.css'
import './audio'

const timeSignature = [4, 4];

function sixteethToBeat(n: number, top: number) {
  return Math.floor(n / top);
}

function barToSequence(timeSignature: [number, number], bar: Bar) {
  const [top, bottom] = timeSignature;
  const activeSixteenths = bar.map(({startTime}) => (startTime[0] * top) * startTime[1]);
  return Array(top * bottom).fill(null).map((_, i) => {
    return activeSixteenths.includes(i);
  });
}

function App() {
  const [song, setSong] = useState<any>(null);
  const [pattern, setPattern] = useState(null);

  function fetchSong() {
    api.song
      .get('dummy-id')
      .then((song) => {
        setSong(song);
      })
  }

  useEffect(() => {
    
  }, [pattern]);

  function handlePlayClick(playing: boolean) {
    audio.play();
    if (!playing) audio.pause();
  }

  return (
    <div className="App">
      <h1>
        Beats With Friends
      </h1>
      <div className="card">
        Play
      </div>
      <Sequencer
        sequences={[]}
        onPlayClick={handlePlayClick}
        onStopClick={audio.stop}
      />
    </div>
  )
}

export default App
