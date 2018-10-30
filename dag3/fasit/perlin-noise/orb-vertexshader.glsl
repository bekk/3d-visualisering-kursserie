#pragma glslify: noiseFunction = require(./noise.glsl);

uniform float time;
uniform vec3 light;

void main() {
  float n = max(0.0, noiseFunction(time, vec3(light.xy, 0.0)));

  vec4 modelSpaceCoordinates = vec4(position.xy, position.z + n, 1.0);
  vec4 worldSpaceCoordinates = modelViewMatrix * modelSpaceCoordinates;
  vec4 screenSpaceCoordinate = projectionMatrix * worldSpaceCoordinates;

  gl_Position = screenSpaceCoordinate;
}
