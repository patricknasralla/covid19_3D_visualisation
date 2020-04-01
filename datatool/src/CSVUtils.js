import fs from "fs";
import csvParser from "csv-parser";

export async function parseCSV(path) {
  return new Promise((resolve, reject) => {
    const csvData = [];
    fs.createReadStream(path)
      .pipe(csvParser())
      .on("data", data => {
        // add Lat and Long coords for the US states because they kindly didn't put those in for some reason...
        if (data.Admin2 === "Unassigned") {
          addStateLatLong(data);
        }
        // remove currently unneeded fields
        if (data.UID) {
          delete data.UID;
          delete data.iso2;
          delete data.iso3;
          delete data.code3;
          delete data.FIPS;
          delete data.Admin2;
          delete data.Combined_Key;
        }
        const normalizedData = normalizeKeys(data);
        csvData.push(normalizedData);
      })
      .on("end", () => {
        console.log(`${path} read successfully.`);
        resolve(csvData);
      });
  });
}

export function normalizeKeys(obj) {
  let normalizedObject = {};
  Object.keys(obj).forEach(key => {
    if (key === "Long_") {
      let newPair = { Long: obj["Long_"] };
      normalizedObject = { ...normalizedObject, ...newPair };
      return;
    }
    if (key === "Province/State") {
      let newPair = { Province_State: obj["Province/State"] };
      normalizedObject = { ...normalizedObject, ...newPair };
      return;
    }
    if (key === "Country/Region") {
      let newPair = { Country_Region: obj["Country/Region"] };
      normalizedObject = { ...normalizedObject, ...newPair };
      return;
    }
    // sort out date issues
    if (key.match(/^\d{1,2}\/\d{1,2}\/\d{2}$/)) {
      // add in the thousands
      const newKey = key.slice(0, -2) + "20" + key.slice(-2);
      let newPair = { [newKey]: obj[key] };
      normalizedObject = { ...normalizedObject, ...newPair };
      return;
    }
    normalizedObject = { ...normalizedObject, [key]: obj[key] };
  });
  return normalizedObject;
}

export function createStateDataObject() {
  const stateData = [
    { Province_State: "Alabama" },
    { Province_State: "Alaska" },
    { Province_State: "Arizona" },
    { Province_State: "Arkansas" },
    { Province_State: "California" },
    { Province_State: "Colorado" },
    { Province_State: "Connecticut" },
    { Province_State: "Delaware" },
    { Province_State: "District of Columbia" },
    { Province_State: "Florida" },
    { Province_State: "Georgia" },
    { Province_State: "Hawaii" },
    { Province_State: "Idaho" },
    { Province_State: "Illinois" },
    { Province_State: "Indiana" },
    { Province_State: "Iowa" },
    { Province_State: "Kansas" },
    { Province_State: "Kentucky" },
    { Province_State: "Louisiana" },
    { Province_State: "Maine" },
    { Province_State: "Maryland" },
    { Province_State: "Massachusetts" },
    { Province_State: "Michigan" },
    { Province_State: "Minnesota" },
    { Province_State: "Mississippi" },
    { Province_State: "Missouri" },
    { Province_State: "Montana" },
    { Province_State: "Nebraska" },
    { Province_State: "Nevada" },
    { Province_State: "New Hampshire" },
    { Province_State: "New Jersey" },
    { Province_State: "New Mexico" },
    { Province_State: "New York" },
    { Province_State: "North Carolina" },
    { Province_State: "North Dakota" },
    { Province_State: "Ohio" },
    { Province_State: "Oklahoma" },
    { Province_State: "Oregon" },
    { Province_State: "Pennsylvania" },
    { Province_State: "Rhode Island" },
    { Province_State: "South Carolina" },
    { Province_State: "South Dakota" },
    { Province_State: "Tennessee" },
    { Province_State: "Texas" },
    { Province_State: "Utah" },
    { Province_State: "Vermont" },
    { Province_State: "Virginia" },
    { Province_State: "Washington" },
    { Province_State: "West Virginia" },
    { Province_State: "Wisconsin" },
    { Province_State: "Wyoming" }
  ];
  stateData.forEach(state => (state.Country_Region = "US"));
  stateData.forEach(state => addStateLatLong(state));
  return stateData;
}

export function aggregateUSDataToState(csvData) {
  const stateData = createStateDataObject();
  csvData.forEach(location => {
    let found = false;
    stateData.forEach(state => {
      if (state.Province_State !== location.Province_State) return;
      found = true;
      const dates = Object.keys(location).filter(key =>
        /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(key)
      );
      dates.forEach(date => {
        if (state[date]) state[date] += Number(location[date]);
        else state[date] = Number(location[date]);
      });
    });
    if (found) return;
    console.log(
      `${location.Province_State} not found in US state list, adding as new entry...`
    );
    stateData.push(location);
  });
  return stateData;
}

export function addStateLatLong(obj) {
  switch (obj.Province_State) {
    case "Alabama":
      obj.Lat = 32.31823;
      obj.Long = -86.902298;
      break;
    case "Alaska":
      obj.Lat = 66.160507;
      obj.Long = -153.369141;
      break;
    case "Arizona":
      obj.Lat = 34.048927;
      obj.Long = -111.093735;
      break;
    case "Arkansas":
      obj.Lat = 34.799999;
      obj.Long = -92.199997;
      break;
    case "California":
      obj.Lat = 36.778259;
      obj.Long = -119.417931;
      break;
    case "Colorado":
      obj.Lat = 39.113014;
      obj.Long = -105.358887;
      break;
    case "Connecticut":
      obj.Lat = 41.599998;
      obj.Long = -72.699997;
      break;
    case "Delaware":
      obj.Lat = 39.0;
      obj.Long = -75.5;
      break;
    case "District of Columbia":
      obj.Lat = 38.9072;
      obj.Long = -77.0369;
      break;
    case "Florida":
      obj.Lat = 27.994402;
      obj.Long = -81.760254;
      break;
    case "Georgia":
      obj.Lat = 33.247875;
      obj.Long = -83.441162;
      break;
    case "Hawaii":
      obj.Lat = 19.741755;
      obj.Long = -155.844437;
      break;
    case "Idaho":
      obj.Lat = 44.068203;
      obj.Long = -114.742043;
      break;
    case "Illinois":
      obj.Lat = 40.0;
      obj.Long = -89.0;
      break;
    case "Indiana":
      obj.Lat = 40.273502;
      obj.Long = -86.126976;
      break;
    case "Iowa":
      obj.Lat = 42.032974;
      obj.Long = -93.581543;
      break;
    case "Kansas":
      obj.Lat = 38.5;
      obj.Long = -98.0;
      break;
    case "Kentucky":
      obj.Lat = 37.839333;
      obj.Long = -84.27002;
      break;
    case "Louisiana":
      obj.Lat = 30.39183;
      obj.Long = -92.329102;
      break;
    case "Maine":
      obj.Lat = 45.367584;
      obj.Long = -68.972168;
      break;
    case "Maryland":
      obj.Lat = 39.045753;
      obj.Long = -76.641273;
      break;
    case "Massachusetts":
      obj.Lat = 42.407211;
      obj.Long = -71.382439;
      break;
    case "Michigan":
      obj.Lat = 44.182205;
      obj.Long = -84.506836;
      break;
    case "Minnesota":
      obj.Lat = 46.39241;
      obj.Long = -94.63623;
      break;
    case "Mississippi":
      obj.Lat = 33.0;
      obj.Long = -90.0;
      break;
    case "Missouri":
      obj.Lat = 38.573936;
      obj.Long = -92.60376;
      break;
    case "Montana":
      obj.Lat = 46.96526;
      obj.Long = -109.533691;
      break;
    case "Nebraska":
      obj.Lat = 41.5;
      obj.Long = -100.0;
      break;
    case "Nevada":
      obj.Lat = 39.876019;
      obj.Long = -117.224121;
      break;
    case "New Hampshire":
      obj.Lat = 44.0;
      obj.Long = -71.5;
      break;
    case "New Jersey":
      obj.Lat = 39.833851;
      obj.Long = -74.871826;
      break;
    case "New Mexico":
      obj.Lat = 34.307144;
      obj.Long = -106.018066;
      break;
    case "New York":
      obj.Lat = 43.0;
      obj.Long = -75.0;
      break;
    case "North Carolina":
      obj.Lat = 35.782169;
      obj.Long = -80.793457;
      break;
    case "North Dakota":
      obj.Lat = 47.650589;
      obj.Long = -100.437012;
      break;
    case "Ohio":
      obj.Lat = 40.367474;
      obj.Long = -82.996216;
      break;
    case "Oklahoma":
      obj.Lat = 36.084621;
      obj.Long = -96.921387;
      break;
    case "Oregon":
      obj.Lat = 44.0;
      obj.Long = -120.5;
      break;
    case "Pennsylvania":
      obj.Lat = 41.203323;
      obj.Long = -77.194527;
      break;
    case "Rhode Island":
      obj.Lat = 41.700001;
      obj.Long = -71.5;
      break;
    case "South Carolina":
      obj.Lat = 33.836082;
      obj.Long = -81.163727;
      break;
    case "South Dakota":
      obj.Lat = 44.5;
      obj.Long = -100.0;
      break;
    case "Tennessee":
      obj.Lat = 35.860119;
      obj.Long = -86.660156;
      break;
    case "Texas":
      obj.Lat = 31.0;
      obj.Long = -100.0;
      break;
    case "Utah":
      obj.Lat = 39.41922;
      obj.Long = -111.950684;
      break;
    case "Vermont":
      obj.Lat = 44.0;
      obj.Long = -72.699997;
      break;
    case "Virginia":
      obj.Lat = 37.926868;
      obj.Long = -78.024902;
      break;
    case "Washington":
      obj.Lat = 47.751076;
      obj.Long = -120.740135;
      break;
    case "West Virginia":
      obj.Lat = 39.0;
      obj.Long = -80.5;
      break;
    case "Wisconsin":
      obj.Lat = 44.5;
      obj.Long = -89.5;
      break;
    case "Wyoming":
      obj.Lat = 43.07597;
      obj.Long = -107.290283;
      break;
    default:
      console.log("not found");
  }
}

export function removeUSCountryValues(data) {
  data.forEach(entry => {
    if (!entry.Province_State && entry.Country_Region === "US") {
      console.log(
        `US county data found, setting all values to 0 for US global data to avoid data doubling...`
      );
      const keys = Object.keys(entry).slice(4);

      keys.forEach(key => {
        entry[key] = 0;
      });
    }
  });
}

export function createPlaceholderData(data) {
  data.forEach(entry => {
    const keys = Object.keys(entry).slice(4);

    keys.forEach(key => {
      entry[key] = 0;
    });
  });
}
