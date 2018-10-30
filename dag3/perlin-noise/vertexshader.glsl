#pragma glslify: noise = require(./noise.glsl);

uniform float time;
uniform vec3 light;

varying vec3 positionVec;
varying vec3 normalVec;
varying float positionOffset;
varying float lightOffset;

void main() {
  float offset = noise(time, position);

  vec4 modelSpaceCoordinates = vec4(position.xy, position.z + offset, 1.0);
  vec4 worldSpaceCoordinates = modelViewMatrix * modelSpaceCoordinates;
  vec4 screenSpaceCoordinate = projectionMatrix * worldSpaceCoordinates;

  positionVec = position;
  normalVec = normal;
  positionOffset = offset;
  lightOffset = clamp(noise(time, light), 0.0, 5.0);

  gl_Position = screenSpaceCoordinate;
}
