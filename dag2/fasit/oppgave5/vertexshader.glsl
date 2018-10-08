varying vec3 normalVec;
attribute float displacement;

void main() {
  normalVec = normal;

  vec3 offsetPos = position;

  offsetPos.xyz += normalVec * displacement;

  vec4 modelSpaceCoordinates = vec4(offsetPos.x, offsetPos.y, offsetPos.z, 1.0);
  vec4 worldSpaceCoordinates = modelViewMatrix * modelSpaceCoordinates;
  vec4 screenSpaceCoordinate = projectionMatrix * worldSpaceCoordinates;

  gl_Position = screenSpaceCoordinate;
}
