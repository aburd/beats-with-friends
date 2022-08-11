import {Song} from './types'
import * as stores from './store'; 
import * as instruments from './instruments'; 
import * as patterns from './patterns'; 

export function importSongToAudioStore(song: Song, store: stores.AudioStore) {
  song.instruments.forEach(ins => {
    const clientIns = instruments.instrumentToClientInstrument(ins); 
    stores.registerInstrument(store, clientIns);
  });
  song.patterns.forEach(pat => {
    const [clientPat, clientTracks] = patterns.patternToClientPattern(pat, song.timeSignature)  
    stores.registerPattern(store, clientPat);
    clientTracks.forEach(t => {
      stores.registerTrack(store, t)
    });
  });
}

export function sixteethToBeat(n: number, top: number) {
  return Math.floor(n / top);
}

export function sampleBaseUrl(): string {
  return `${location.origin}/samples/`; 
}
