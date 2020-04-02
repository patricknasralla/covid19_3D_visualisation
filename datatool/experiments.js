import fs from "fs";
import { deflate, inflate } from "pako";
import {
  parseCSV,
  createPlaceholderData,
  createStateDataObject,
  aggregateUSDataToState
} from "./src/CSVUtils";

async function exportDataForApplication() {
  // read csv US data and aggregate to state data test
  const confirmedUSRaw = await parseCSV(
    "./rawData/time_series_covid19_confirmed_US.csv"
  );
  console.log(aggregateUSDataToState(confirmedUSRaw));
}

function compressionTest() {
  const testData = new Float32Array([12.3, 123456789.5, 123.456, -123.456]);
  console.log(testData);
  const compressedTestData = deflate(testData.buffer);
  console.log(compressedTestData.byteLength);
  const recoveredBuffer = inflate(compressedTestData);
  const recoveredData = new Float32Array(recoveredBuffer.buffer);
  console.log(recoveredData);

  fs.writeFile("./testFile.bin", compressedTestData, err => {
    if (err) throw err;
    console.log("Static weights data successfully parsed!");
  });

  fs.readFile("./testFile.bin", (err, data) => {
    if (err) throw err;
    const recoveredBuffer = inflate(data);
    const dataFromFile = new Float32Array(recoveredBuffer.buffer);
    console.log(dataFromFile);
  });
}

compressionTest();
