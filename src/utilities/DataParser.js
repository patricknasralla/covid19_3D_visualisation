import neatCsv from 'neat-csv';
import { Vector3, DataTexture, RGBAFormat, UnsignedByteType } from 'three';

export class DataParser {
  static getPositionVectorsFromData(csvData, radius = 1) {
    const coordinateList = [];

    csvData.forEach(row => {
      const lat = Number(row.Lat);
      const long = Number(row.Long);
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (long + 180) * (Math.PI / 180);
      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);
      coordinateList.push(new Vector3(x, y, z));
    });

    return coordinateList;
  }

  static getConfirmedCases(csvData) {
    // get column names for data
    const keys = Object.keys(csvData[0]).slice(4);

    const casesByDay = [];
    // create arrays for all locations by day
    keys.forEach(key => {
      const casesByLocation = [];
      csvData.forEach(location => {
        const caseNumber = Number(location[key]);
        if (caseNumber === 0) casesByLocation.push(0);
        else casesByLocation.push(Math.log10(caseNumber + 1));
      });
      casesByDay.push(casesByLocation);
    });
    return casesByDay;
  }

  static getConfirmedCasesAsTextureData(data) {
    // get column names for data
    const keys = Object.keys(data[0]).slice(4);

    // get total days of data and total locations
    const days = keys.length + 1;
    const locations = data.length;

    // instantiate TypedArray
    const textureData = new Uint8Array(days * locations * 4);

    // fill the first entry of the texture with 0s so that you always start with a clean world
    for (let i = 0; i < locations * 4; i++) {
      textureData[i] = 0;
    }

    // create ArrayBuffer and DataView for bitwise operations.
    const buffer = new ArrayBuffer(4);
    const view = new DataView(buffer);

    // populate textureData
    keys.forEach((key, i) => {
      data.forEach((location, j) => {
        const caseNumber = Number(location[key]);
        let logFloatValue;
        let highPIntValue;
        if (caseNumber !== 0) {
          logFloatValue = Math.log10(caseNumber + 1);
          highPIntValue = Math.floor(logFloatValue * 100000000);
        }
        view.setUint32(0, highPIntValue);

        const stride = locations * 4 + i * data.length * 4 + j * 4;
        textureData[stride] = highPIntValue === 0 ? 0 : view.getUint8(0);
        textureData[stride + 1] = highPIntValue === 0 ? 0 : view.getUint8(1);
        textureData[stride + 3] = highPIntValue === 0 ? 0 : view.getUint8(2);
        textureData[stride + 4] = highPIntValue === 0 ? 0 : view.getUint8(3);
      });
    });

    // create texture
    const texture = new DataTexture(
      textureData,
      locations,
      days,
      RGBAFormat,
      UnsignedByteType,
    );

    return [texture, days, locations];
  }

  static async getDataFromCSV(path) {
    let response = await fetch(path, { mode: 'no-cors' });
    let data = await response.text();

    return await neatCsv(data);
  }
}
