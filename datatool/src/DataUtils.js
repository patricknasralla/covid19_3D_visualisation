import { Vector3, IcosahedronGeometry } from "three";

export class DataUtils {
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

  static parseDataToTextureData(data) {
    // get column names for rawData
    const keys = Object.keys(data[0]).slice(4);

    // get total days of rawData and total locations
    const totalDays = keys.length + 1;
    const totalLocations = data.length;

    // instantiate TypedArray
    const textureData = new Uint8Array(totalDays * totalLocations * 4);

    // fill the first entry of the texture with 0s so that you always start with a clean world
    for (let i = 0; i < totalLocations * 4; i++) {
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

        const stride = totalLocations * 4 + i * data.length * 4 + j * 4;
        textureData[stride] = highPIntValue === 0 ? 0 : view.getUint8(0);
        textureData[stride + 1] = highPIntValue === 0 ? 0 : view.getUint8(1);
        textureData[stride + 3] = highPIntValue === 0 ? 0 : view.getUint8(2);
        textureData[stride + 4] = highPIntValue === 0 ? 0 : view.getUint8(3);
      });
    });

    return [textureData, totalDays, totalLocations];
  }

  static getVertexData(locations) {
    const placementGeometry = new IcosahedronGeometry(1, 7);
    const positions = [];
    const locationIndices = [];
    const locationWeights = [];

    for (let i = 0; i < placementGeometry.vertices.length; i++) {
      const positionWeights = calculateBoneWeights(
        placementGeometry.vertices[i],
        locations
      );

      if (!!positionWeights) {
        positions.push(
          placementGeometry.vertices[i].x,
          placementGeometry.vertices[i].y,
          placementGeometry.vertices[i].z
        );
        positionWeights.forEach(position => {
          locationIndices.push(position.index);
          locationWeights.push(position.weight);
        });
      }
    }

    function calculateBoneWeights(vertex, countryVectors) {
      // find closest 4 positions
      const distanceList = [];
      countryVectors.forEach((position, index) => {
        // consider using distanceToSquared...
        const distance = vertex.distanceTo(position);
        distanceList.push({
          index,
          distance
        });
      });
      distanceList.sort((a, b) => a.distance - b.distance);

      const activePositions = distanceList.slice(0, 4);

      // calculate weights (note, you're gonna want to play with the cutoff...
      activePositions.forEach(position => {
        // set a cutoff for far away values (to stop values passing through sphere)
        if (position.distance > 0.4) position.weight = 0.0;
        else {
          // normalise remaining distances to value between 0 and 50
          const calcDistance = (position.distance / 0.4) * 50;
          // weight = normalised inverse square of normalised distance
          position.weight = 1 / (calcDistance * calcDistance + 1);
        }
      });

      if (activePositions.every(position => position.weight === 0)) return null;

      return activePositions;
    }

    console.log(placementGeometry.vertices.length * 3);
    console.log(positions.length);

    return [positions, locationIndices, locationWeights];
  }
}
