import { DataTexture, RGBAFormat, UnsignedByteType } from 'three';
import { inflate } from 'pako';

export class DataParser {
  static getTextureFromFile(buffer, staticData) {
    const recoveredBuffer = inflate(buffer);
    const tData = new Uint8Array(recoveredBuffer.buffer);
    return new DataTexture(
      tData,
      staticData.totalLocations,
      staticData.totalDays,
      RGBAFormat,
      UnsignedByteType,
    );
  }
}
