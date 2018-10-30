#pragma glslify: noiseFunction = require(./noise.glsl);

uniform float time;
uniform vec3 light;

varying vec3 positionVec;
varying vec3 normalVec;
varying float noise;
varying float lightNoise;

void main() {
  float n = noiseFunction(time, position);

  vec4 modelSpaceCoordinates = vec4(position.xy, position.z + n, 1.0);
  vec4 worldSpaceCoordinates = modelViewMatrix * modelSpaceCoordinates;
  vec4 screenSpaceCoordinate = projectionMatrix * worldSpaceCoordinates;

  positionVec = position;
  normalVec = normal;
  noise = n;
  lightNoise = max(0.0, noiseFunction(time, vec3(light.xy, 0)));

  gl_Position = screenSpaceCoordinate;
}
