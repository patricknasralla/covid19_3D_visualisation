// language=GLSL
export const vertexShader = `
      uniform float tween;
      uniform float pixelRatio;
      uniform float containerHeight;
      uniform sampler2D caseData;
      uniform float day;
      uniform float totalDays;
      uniform float totalLocations;

      attribute float size;
      attribute vec4 locationIndices;
      attribute vec4 locationWeights;

      varying vec3 vColor;

      void setColor(float displacement) {
        // let's try and change the color based on the amplitude received for now...
        if ( displacement < 0.1 ) {
          vColor = vec3(0.0, 0.0, 0.0);
        } else {
          vColor = vec3(0.5 + (displacement * 0.5), 0.5 - (displacement * 0.5), 0.5 - (displacement * 0.5));
        }
      }

      float getCasesValueFromTexture(vec2 coords) {
        vec4 value = texture2D(caseData, coords);
        float combined = (value.w * 256. + value.z * 256. * 256. + value.y * 256. * 256. * 256. + value.x * 256. * 256. * 256. * 256.);
        return combined / 100000000.;
      }

      void main() {
        vec3 pNormal = normalize(position);

        // get current data coords
        vec2 dataCoordX = vec2(locationIndices.x/totalLocations, day/totalDays);
        vec2 dataCoordY = vec2(locationIndices.y/totalLocations, day/totalDays);
        vec2 dataCoordZ = vec2(locationIndices.z/totalLocations, day/totalDays);
        vec2 dataCoordW = vec2(locationIndices.w/totalLocations, day/totalDays);

        // get current dataValues
        float vx = getCasesValueFromTexture(dataCoordX);
        float vy = getCasesValueFromTexture(dataCoordY);
        float vz = getCasesValueFromTexture(dataCoordZ);
        float vw = getCasesValueFromTexture(dataCoordW);

        // for each of the 4 closest locations determine the amout of displacement
        float currentDisplacement = 0.0;

        currentDisplacement += vx * locationWeights.x;
        currentDisplacement += vy * locationWeights.y;
        currentDisplacement += vz * locationWeights.z;
        currentDisplacement += vw * locationWeights.w;

        // get next data coords
        vec2 dataCoordX2 = vec2(locationIndices.x/totalLocations, (day + 1.)/totalDays);
        vec2 dataCoordY2 = vec2(locationIndices.y/totalLocations, (day + 1.)/totalDays);
        vec2 dataCoordZ2 = vec2(locationIndices.z/totalLocations, (day + 1.)/totalDays);
        vec2 dataCoordW2 = vec2(locationIndices.w/totalLocations, (day + 1.)/totalDays);

        // get current dataValues
        float vx2 = getCasesValueFromTexture(dataCoordX2);
        float vy2 = getCasesValueFromTexture(dataCoordY2);
        float vz2 = getCasesValueFromTexture(dataCoordZ2);
        float vw2 = getCasesValueFromTexture(dataCoordW2);

        // for each of the 4 closest locations determine the amout of displacement
        float nextDisplacement = 0.0;

        nextDisplacement += vx2 * locationWeights.x;
        nextDisplacement += vy2 * locationWeights.y;
        nextDisplacement += vz2 * locationWeights.z;
        nextDisplacement += vw2 * locationWeights.w;

        float displacement = mix(currentDisplacement, nextDisplacement, tween);

        // displace the vertex by displacement in direction of normal
        vec3 displacedPosition = position + (pNormal * displacement * 0.05);

        setColor(displacement);

        vec4 mvPosition = modelViewMatrix * vec4( displacedPosition, 1.0 );
        float adjustedPointSize = (size * pixelRatio * containerHeight) * 0.005;
        gl_PointSize = adjustedPointSize * ( 1.0 / (-mvPosition.z));
        gl_Position = projectionMatrix * mvPosition;
        }
    `;
