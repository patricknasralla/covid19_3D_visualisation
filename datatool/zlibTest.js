import fs from "fs";
import pako from "pako";

const testArr = new ArrayBuffer([1.234, -2.345, 3.456, -4.567, 5.678, -6.789]);

console.log(testArr);
const compressed = pako.deflate(testArr);
console.log(compressed);

const recovered = pako.inflate(compressed);
console.log(recovered);

fs.writeFile("testfile.bin", compressed, err => {
  if (err) throw err;
  console.log("testfile.bin saved!");
});

const compressedFromFile = fs.readFile("testfile.bin", (err, data) => {
  console.log(data);
  console.log(pako.inflate(data));
});
