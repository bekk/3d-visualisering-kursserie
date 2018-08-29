varying vec3 vertexPosition;

void main() {
  // lagrer position til vertexPosition slik at den er tilgjengelig interpolert i fragmentshaderen
  vertexPosition = position.xyz;

  vec4 modelSpaceCoordinates = vec4(position.x, position.y, position.z, 1.0);
  vec4 worldSpaceCoordinates = modelViewMatrix * modelSpaceCoordinates;
  vec4 screenSpaceCoordinate = projectionMatrix * worldSpaceCoordinates;

  gl_Position = screenSpaceCoordinate;
}