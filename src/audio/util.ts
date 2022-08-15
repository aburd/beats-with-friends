export function sixteethToBeat(n: number, top: number) {
  return Math.floor(n / top);
}

export function sampleBaseUrl(): string {
  return `${location.origin}/samples/`; 
}
