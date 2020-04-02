import fs from "fs";
import { inflate } from "pako";
import {
  parseCSV,
  createPlaceholderData,
  createStateDataObject,
  aggregateUSDataToState
} from "./src/CSVUtils";
import { DataUtils } from "./src/DataUtils";
import { compareArrays, compressForFile } from "./src/Utils";

async function exportDataForApplication() {
  // read csv US data and aggregate to state data test
  const confirmedUSRaw = await parseCSV(
    "./rawData/time_series_covid19_confirmed_US.csv"
  );
  console.log(aggregateUSDataToState(confirmedUSRaw));
}

async function compressionTest() {
  // get some real data into the system
  const confirmedGlobalRaw = await parseCSV(
    "./rawData/time_series_covid19_confirmed_global.csv"
  );
  const confirmedUSRaw = aggregateUSDataToState(
    await parseCSV("./rawData/time_series_covid19_confirmed_US.csv")
  );
  const confirmedRaw = confirmedGlobalRaw.concat(confirmedUSRaw);

  // do the calculations
  const locationPositions = DataUtils.getPositionVectorsFromData(confirmedRaw);
  const [positions, locationIndices, locationWeights] = DataUtils.getVertexData(
    locationPositions
  );

  const [
    confirmedTextureData,
    totalDays,
    totalLocations
  ] = DataUtils.parseDataToTextureData(confirmedRaw);

  // test decompressed position data vs current
  const compressedPositions = compressForFile(positions); // Uint16
  const compressedIndices = compressForFile(locationIndices); // Uint16
  const compressedWeights = compressForFile(locationWeights); // Float32

  /*
  await fs.writeFile(
    "./tests/testCompressedPositions.bin",
    compressedPositions,
    err => {
      if (err) throw err;
      console.log("Compressed positions successfully written!");
    }
  );
  // save the uncompressed file for comparison
  fs.writeFile("./tests/testPositions.bin", positions, err => {
    if (err) throw err;
    console.log("Uncompressed positions successfully written!");
  });

  await fs.writeFile(
    "./tests/testCompressedIndices.bin",
    compressedIndices,
    err => {
      if (err) throw err;
      console.log("Compressed indices successfully written!");
    }
  );

  // save the uncompressed file for comparison
  fs.writeFile("./tests/testIndices.bin", locationIndices, err => {
    if (err) throw err;
    console.log("Uncompressed indices successfully written!");
  });

  await fs.writeFile(
    "./tests/testCompressedWeights.bin",
    compressedWeights,
    err => {
      if (err) throw err;
      console.log("Compressed weights successfully written!");
    }
  );

  // save the uncompressed file for comparison
  fs.writeFile("./tests/testWeights.bin", locationWeights, err => {
    if (err) throw err;
    console.log("Uncompressed weights successfully written!");
  });

  */

  fs.readFile("./tests/testCompressedPositions.bin", (err, data) => {
    if (err) throw err;

    const recoveredBuffer = inflate(data);
    const recovered = new Uint16Array(recoveredBuffer.buffer);
    console.log(
      `compressedPositions successfully recovered: ${compareArrays(
        recovered,
        positions
      )}`
    );
  });

  fs.readFile("./tests/testCompressedIndices.bin", (err, data) => {
    if (err) throw err;

    const recoveredBuffer = inflate(data);
    const recovered = new Uint16Array(recoveredBuffer.buffer);
    console.log(
      `compressedIndices successfully recovered: ${compareArrays(
        recovered,
        locationIndices
      )}`
    );
  });

  fs.readFile("./tests/testCompressedWeights.bin", (err, data) => {
    if (err) throw err;

    const recoveredBuffer = inflate(data);
    const recovered = new Float32Array(recoveredBuffer.buffer);
    console.log(
      `compressedWeights successfully recovered: ${compareArrays(
        recovered,
        locationWeights
      )}`
    );
  });
}

compressionTest();
