import fs from "fs";
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

exportDataForApplication();
