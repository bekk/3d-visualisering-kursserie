#pragma glslify: noise = require(./noise.glsl);

uniform float time;
uniform vec3 light;

void main() {
  float offset = clamp(noise(time, light), 0.0, 5.0);
  vec3 offsetPosition = vec3(position.xy, position.z + offset);

  vec4 modelSpaceCoordinates = vec4(offsetPosition, 1.0);
  vec4 worldSpaceCoordinates = modelViewMatrix * modelSpaceCoordinates;
  vec4 screenSpaceCoordinate = projectionMatrix * worldSpaceCoordinates;

  gl_Position = screenSpaceCoordinate;
}
