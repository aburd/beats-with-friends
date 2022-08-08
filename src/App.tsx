import {useEffect, useState} from 'react'
import * as Tone from 'tone'
import Sequencer from './components/Sequencer'
import api from './api'
import * as util from './util'
import * as audio from './audio'
import './App.css'
import './audio'

function App() {
  const [song, setSong] = useState<audio.Song | null>(null);
  const [patternId, setPatternId] = useState<string | number>('1');
  const [timeSignature, setTimeSignature] = useState<audio.TimeSignature>([4, 4]);
  function fetchSong() {
    api.song
      .get('dummy-id')
      .then((song) => {
        setSong(song);
      })
  }

  useEffect(() => {
    fetchSong();
  }, []);

  function handlePlayClick() {
    if (audio.state() === 'playing') {
      audio.pause();
      return
    }
    audio.play();
  }

  function handleSequencerInit() {
    if (song) {
      console.log(audio.state());
      audio.setPattern(song.patterns[patternId].bars[0]);
    }
  }

  const initialSequence = song ? util.barToSequence(timeSignature, song.patterns[patternId].bars[0]) : null;

  return (
    <div className="App">
      <h1>
        Beats With Friends
      </h1>
      <div className="card">
        {song?.name}
      </div>
      <div className="card">
        Pattern: {patternId}
      </div>
      {initialSequence && (
        <Sequencer
          sequences={[
            initialSequence
          ]}
          onPlayClick={handlePlayClick}
          onStopClick={audio.stop}
          onInit={handleSequencerInit}
          onSequenceChange={(id, sequence) => console.log({id, sequence})}
        />
      )}
    </div>
  )
}

export default App
