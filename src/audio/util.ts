import {Song} from './types'
import * as stores from './store'; 
import * as instruments from './instruments'; 
import * as patterns from './patterns'; 


export function sixteethToBeat(n: number, top: number) {
  return Math.floor(n / top);
}

export function sampleBaseUrl(): string {
  return `${location.origin}/samples/`; 
}
