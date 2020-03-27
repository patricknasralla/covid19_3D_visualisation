/*
 *   Data Parser for COVID-19 visualiser
 *
 *   - turns csv into usable object.
 *   - calculates global locations of dataPoints
 *   - returns {
 *     totalDays: number,
 *     totalLocations: number,
 *     locationIndices: number[],
 *     locationWeights: number[],
 *     vertexPositions: Vector3[],
 *     textureData: Uint8Array,
 *   }
 * */

import fs from "fs";
import { inflate, deflate } from "pako";
import csvParser from "csv-parser";
import { DataUtils } from "./src/DataUtils";

const rawData = [];
let parsedData = {};

fs.createReadStream("./rawData/data.csv")
  .pipe(csvParser())
  .on("data", data => {
    rawData.push(data);
  })
  .on("end", () => {
    // do all the things here
    const locationPositions = DataUtils.getPositionVectorsFromData(rawData);
    const [
      textureData,
      totalDays,
      totalLocations
    ] = DataUtils.parseDataToTextureData(rawData);
    const [
      positions,
      locationIndices,
      locationWeights
    ] = DataUtils.getVertexData(locationPositions);

    parsedData = {
      totalDays,
      totalLocations,
      positions,
      locationIndices,
      locationWeights
    };
    const output = deflate(JSON.stringify(parsedData), { to: "string" });

    fs.writeFile("./output/textureData.bin", textureData, err => {
      if (err) throw err;
      console.log("textureData successfully parsed!");
    });
    fs.writeFile("./output/data.bin", output, err => {
      if (err) throw err;
      console.log("Data successfully parsed!");
    });
  });
