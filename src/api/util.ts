import zipObject from "lodash/zipObject";

export function idArrToFbMap(idArr: string[]) {
  const vals = idArr.map(() => true);
  return zipObject(idArr, vals);
}

export function fbMapToIdArr<T extends {}>(fbMap: Record<string, T>) {
  return Object.entries(fbMap).map(([id, item]) => {
    return {
      id,
      ...item,
    }
  }); 
}
