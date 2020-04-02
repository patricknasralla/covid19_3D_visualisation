import fs from "fs";
import { deflate } from "pako";
import {
  parseCSV,
  removeUSCountryValues,
  createPlaceholderData,
  aggregateUSDataToState
} from "./src/CSVUtils";
import { DataUtils } from "./src/DataUtils";

async function exportDataForApplication() {
  // read csv files and concat Global and US data (always do it in that order so that indices are correct for non-us sets)
  const confirmedGlobalRaw = await parseCSV(
    "./rawData/time_series_covid19_confirmed_global.csv"
  );
  const confirmedUSRaw = aggregateUSDataToState(
    await parseCSV("./rawData/time_series_covid19_confirmed_US.csv")
  );
  const confirmedRaw = confirmedGlobalRaw.concat(confirmedUSRaw);
  const deathsGlobalRaw = await parseCSV(
    "./rawData/time_series_covid19_deaths_global.csv"
  );
  const deathsUSRaw = aggregateUSDataToState(
    await parseCSV("./rawData/time_series_covid19_deaths_US.csv")
  );
  const deathsRaw = deathsGlobalRaw.concat(deathsUSRaw);

  // TODO: Add recovered data when available.
  // const recoveredGlobalRaw = await parseCSV(
  //   "./rawData/time_series_covid19_recovered_global.csv"
  // );
  //
  // const recoveredPlaceholder = await parseCSV(
  //   "./rawData/time_series_covid19_confirmed_US.csv"
  // );
  // createPlaceholderData(recoveredPlaceholder);
  // const recoveredRaw = recoveredGlobalRaw.concat(recoveredPlaceholder);

  // remove US case/death values as State/County level data available (but keep the entry for data without)
  removeUSCountryValues(confirmedRaw);
  removeUSCountryValues(deathsRaw);

  console.log(
    "Performing vector and weight calculations. This can take up to 3 mins with large data sets, please be patient!"
  );

  const locationPositions = DataUtils.getPositionVectorsFromData(confirmedRaw);
  const [positions, locationIndices, locationWeights] = DataUtils.getVertexData(
    locationPositions
  );

  const [
    confirmedTextureData,
    totalDays,
    totalLocations
  ] = DataUtils.parseDataToTextureData(confirmedRaw);
  const [deathsTextureData, ,] = DataUtils.parseDataToTextureData(deathsRaw);
  // const [recoveredTextureData, ,] = DataUtils.parseDataToTextureData(recoveredRaw)

  const staticData = {
    totalDays,
    totalLocations
  };
  const staticOutput = JSON.stringify(staticData);

  // output compressed static data to file
  fs.writeFile("../visualisation/src/staticData.json", staticOutput, err => {
    if (err) throw err;
    console.log("Static data successfully parsed!");
  });

  // output other static data to files to see raw size...
  const positionsCompressed = deflate(positions);
  fs.writeFile(
    "../visualisation/public/data/positionData.bin",
    positionsCompressed,
    err => {
      if (err) throw err;
      console.log("Static position data successfully parsed!");
    }
  );

  const locationIndicesCompressed = deflate(locationIndices);
  fs.writeFile(
    "../visualisation/public/data/locationIndexData.bin",
    locationIndicesCompressed,
    err => {
      if (err) throw err;
      console.log("Static index data successfully parsed!");
    }
  );

  const locationWeightsCompressed = deflate(locationWeights);
  fs.writeFile(
    "../visualisation/public/data/locationWeightData.bin",
    locationWeightsCompressed,
    err => {
      if (err) throw err;
      console.log("Static weights data successfully parsed!");
    }
  );

  // output texture data
  const confirmedTextureDataCompressed = deflate(confirmedTextureData);
  fs.writeFile(
    "../visualisation/public/data/confirmedTextureData.bin",
    confirmedTextureDataCompressed,
    err => {
      if (err) throw err;
      console.log("Confirmed cases texture data successfully parsed!");
    }
  );
  fs.writeFile(
    "../visualisation/public/data/deathsTextureData.bin",
    deathsTextureData,
    err => {
      if (err) throw err;
      console.log("Deaths texture data successfully parsed!");
    }
  );
  // Todo: Add recovered data when available
  // fs.writeFile(
  //   "../visualisation/public/data/recoveredTextureData.bin",
  //   recoveredTextureData,
  //   err => {
  //     if (err) throw err;
  //     console.log("Recovered cases texture data successfully parsed!");
  //   }
  // );
}

exportDataForApplication();
