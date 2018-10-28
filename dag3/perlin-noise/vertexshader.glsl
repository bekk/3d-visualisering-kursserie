#pragma glslify: noise = require(./noise.glsl);

uniform float time;
uniform vec3 light;

varying vec3 positionVec;
varying vec3 fragNormal;

void main() {
  float offset = noise(time, position);

  // float r = 20.0 / (2.0 * 3.14);

  // float theta = (((position.x - -10.0) / 20.0) - 0.5) * 2.0 * 3.14;

  // float newX = r * cos(theta);
  // float newZ = r * sin(theta);

  // vec3 newPos = vec3(newX, position.y, newZ);
  // vec3 newNormal = vec3(0.0) - newPos;

  vec4 modelSpaceCoordinates = vec4(position + normal * offset, 1.0);
  vec4 worldSpaceCoordinates = modelViewMatrix * modelSpaceCoordinates;
  vec4 screenSpaceCoordinate = projectionMatrix * worldSpaceCoordinates;

  positionVec = position;
  fragNormal = normal;

  gl_Position = screenSpaceCoordinate;
}
