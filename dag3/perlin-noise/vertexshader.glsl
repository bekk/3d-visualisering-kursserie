#pragma glslify: snoise3 = require(glsl-noise/simplex/3d);

varying vec3 positionVec;
uniform float time;

void main() {
  float t = (time * 0.001);
  float s1 = t * 2.0;
  float s2 = t;
  float offset1 = snoise3(vec3(position.x, position.y - s1, position.z)*0.25);
  float offset2 = snoise3(vec3(position.x, position.y - s2, position.z));
  float offset = clamp(offset1 + offset2, 0.0, 10.0);

  float r = 20.0 / (2.0 * 3.14);

  float theta = (((position.x - -10.0) / 20.0) - 0.5) * 2.0 * 3.14;

  float newX = r * cos(theta);
  float newZ = r * sin(theta);

  vec3 newPos = vec3(newX, position.y, newZ);
  vec3 newNormal = vec3(0.0) - newPos;

  vec4 modelSpaceCoordinates = vec4(newPos + newNormal * 0.25 * offset, 1.0);
  vec4 worldSpaceCoordinates = modelViewMatrix * modelSpaceCoordinates;
  vec4 screenSpaceCoordinate = projectionMatrix * worldSpaceCoordinates;

  positionVec = position;

  gl_Position = screenSpaceCoordinate;
}
