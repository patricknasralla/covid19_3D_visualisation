import fs from "fs";
import { deflate } from "pako";
import {
  parseCSV,
  removeUSCountryValues,
  aggregateUSDataToState
} from "./src/CSVUtils";
import { DataUtils } from "./src/DataUtils";
import { compressForFile } from "./src/Utils";

async function exportDataForApplication() {
  // read csv files and concat Global and US data (always do it in that order so that indices are correct for non-us sets)
  const confirmedGlobalRaw = await parseCSV(
    "/Users/patricknasralla/WebstormProjects/COVID-19_data/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv"
  );
  const confirmedUSRaw = aggregateUSDataToState(
    await parseCSV(
      "/Users/patricknasralla/WebstormProjects/COVID-19_data/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_US.csv"
    )
  );
  const confirmedRaw = confirmedGlobalRaw.concat(confirmedUSRaw);
  const deathsGlobalRaw = await parseCSV(
    "/Users/patricknasralla/WebstormProjects/COVID-19_data/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv"
  );
  const deathsUSRaw = aggregateUSDataToState(
    await parseCSV(
      "/Users/patricknasralla/WebstormProjects/COVID-19_data/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_US.csv"
    )
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

  const compressedPositions = compressForFile(positions); // Uint16
  const compressedIndices = compressForFile(locationIndices); // Uint32
  const compressedWeights = compressForFile(locationWeights); // Float32

  // output compressed static data to file
  fs.writeFile("../visualisation/src/staticData.json", staticOutput, err => {
    if (err) throw err;
    console.log("Static data successfully saved!");
  });

  fs.writeFile(
    "../visualisation/public/data/positionData.bin",
    compressedPositions,
    err => {
      if (err) throw err;
      console.log("Static position data successfully saved!");
    }
  );

  fs.writeFile(
    "../visualisation/public/data/locationIndexData.bin",
    compressedIndices,
    err => {
      if (err) throw err;
      console.log("Static index data successfully saved!");
    }
  );

  fs.writeFile(
    "../visualisation/public/data/locationWeightData.bin",
    compressedWeights,
    err => {
      if (err) throw err;
      console.log("Static weights data successfully saved!");
    }
  );

  // output texture data
  const confirmedTextureDataCompressed = deflate(confirmedTextureData);
  fs.writeFile(
    "../visualisation/public/data/confirmedTextureData.bin",
    confirmedTextureDataCompressed,
    err => {
      if (err) throw err;
      console.log("Confirmed cases texture data successfully saved!");
    }
  );
  const deathsTextureDataCompressed = deflate(deathsTextureData);
  fs.writeFile(
    "../visualisation/public/data/deathsTextureData.bin",
    deathsTextureDataCompressed,
    err => {
      if (err) throw err;
      console.log("Deaths texture data successfully saved!");
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
