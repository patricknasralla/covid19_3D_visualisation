import { deflate } from "pako";

export function compressForFile(typedArray) {
  const dataView = new DataView(typedArray.buffer);
  const dataToCompress = new Uint8Array(dataView.buffer);
  return deflate(dataToCompress);
}

export function compareArrays(arr1, arr2) {
  return arr1.every((value, index) => value === arr2[index]);
}
