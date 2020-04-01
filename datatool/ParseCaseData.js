import fs from "fs";
import { deflate } from "pako";
import { parseCSV, removeUSCountryValues } from "./src/CSVUtils";
import { DataUtils } from "./src/DataUtils";

async function exportDataForApplication() {
  // read csv files and concat Global and US data (always do it in that order so that indices are correct for non-us sets)
  const confirmedGlobalRaw = await parseCSV(
    "./rawData/time_series_covid19_confirmed_global.csv"
  );
  const confirmedUSRaw = await parseCSV(
    "./rawData/time_series_covid19_confirmed_US.csv"
  );
  const confirmedRaw = confirmedGlobalRaw.concat(confirmedUSRaw);
  const deathsGlobalRaw = await parseCSV(
    "./rawData/time_series_covid19_deaths_global.csv"
  );
  const deathsUSRaw = await parseCSV(
    "./rawData/time_series_covid19_deaths_US.csv"
  );
  const deathsRaw = deathsGlobalRaw.concat(deathsUSRaw);
  const recoveredRaw = await parseCSV(
    "./rawData/time_series_covid19_recovered_global.csv"
  );

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
  const [recoveredTextureData, ,] = DataUtils.parseDataToTextureData(
    recoveredRaw
  );

  const staticData = {
    totalDays,
    totalLocations,
    positions,
    locationIndices,
    locationWeights
  };
  const staticOutput = deflate(JSON.stringify(staticData), { to: "string" });

  // output compressed static data to file
  fs.writeFile(
    "../visualisation/public/data/staticData.bin",
    staticOutput,
    err => {
      if (err) throw err;
      console.log("Static data successfully parsed!");
    }
  );

  // output texture data
  fs.writeFile(
    "../visualisation/public/data/confirmedTextureData.bin",
    confirmedTextureData,
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
  fs.writeFile(
    "../visualisation/public/data/recoveredTextureData.bin",
    recoveredTextureData,
    err => {
      if (err) throw err;
      console.log("Recovered cases texture data successfully parsed!");
    }
  );
}

exportDataForApplication();
