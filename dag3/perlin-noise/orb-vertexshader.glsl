#pragma glslify: noise = require(./noise.glsl);

uniform float time;
uniform vec3 light;

void main() {
  float offset = noise(time, light);
  vec3 offsetPosition = vec3(position.x, position.y + offset, position.z);

  vec4 modelSpaceCoordinates = vec4(offsetPosition, 1.0);
  vec4 worldSpaceCoordinates = modelViewMatrix * modelSpaceCoordinates;
  vec4 screenSpaceCoordinate = projectionMatrix * worldSpaceCoordinates;

  gl_Position = screenSpaceCoordinate;
}
