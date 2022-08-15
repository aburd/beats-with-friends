import zipObject from "lodash/zipObject";

export function idArrToFbMap(idArr: string[]) {
  const vals = idArr.map(() => true);
  return zipObject(idArr, vals);
}

export function fbMapToIdArr(fbMap: Record<string, unknown>) {
  return Object.entries(fbMap).map(([id, item]) => {
    return {
      id,
      ...item,
    }
  }); 
}
