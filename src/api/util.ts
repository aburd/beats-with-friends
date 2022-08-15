import zipObject from "lodash/zipObject";

export function idArrToFbMap(idArr: string[]) {
  const vals = idArr.map(() => true);
  return zipObject(idArr, vals);
}
