import {listAll, ref, getDownloadURL} from "firebase/storage";
import fb from "../firebase";

const { storage } = fb.init();

export type Sample = {
  path: string;
  name?: string;
  url?: string;
}

export type Directory = {
  path: string;
  name: string;
  directories?: Directory[];
  samples?: Sample[]; 
}

async function getDirectory(path: string): Promise<Directory> {
    const dirRef = ref(storage, path);
    const res = await listAll(dirRef);
    return {
      path,
      name: path,
      directories: res.prefixes.map(p => ({ path: p.fullPath, name: p.name })),
      samples: res.items.map(i => ({ path: i.fullPath, name: i.name })) 
    };
}

// Storage will be abstracted to a crude filesystem
// directories will end with slash, all else will be ordinary samples 
export default {
  /**
   * Will just get root of all samples dir at first
   * Pass in paths to other directories to progressively go deeper
   */ 
  async list(path = '/'): Promise<Directory> {
    return getDirectory(path);
  },
  /**
   * gets full sample information
   */ 
  async getSample(path: string): Promise<Sample> {
    const fileRef = ref(storage, path);
    const url = await getDownloadURL(fileRef);
    return {
      path,
      url,
    }
  }
}
