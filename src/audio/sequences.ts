export type Pattern = boolean[];

export type Sequence = {
  id: string;
  pattern: Pattern;
};

export function create(id: string, pattern: Pattern = []) {
  return {
    id,
    pattern,
  }
}

export function updatePattern(sequence: Sequence, idx: number, on: boolean) {
  if ((sequence.pattern.length - 1) < idx) throw Error(`Invalid update of sequence with index [${idx}]`);
  sequence.pattern[idx] = on;
}
