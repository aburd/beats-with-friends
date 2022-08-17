import zipObject from "lodash/zipObject";

export function idArrToFbMap(idArr: string[]) {
  const vals = idArr.map(() => true);
  return zipObject(idArr, vals);
}

export function fbMapToIdArr<T extends { [k: string]: any }>(fbMap: Record<string, T>) {
  return Object.entries(fbMap).map(([id, item]) => {
    return {
      id,
      ...item,
    }
  }); 
}
