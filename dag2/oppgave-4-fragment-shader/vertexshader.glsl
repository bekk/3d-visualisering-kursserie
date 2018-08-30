varying vec2 vertexPosition;

void main() {
  vertexPosition = position.xy;
  
  vec4 modelSpaceCoordinates = vec4(position.x, position.y, position.z, 1.0);
  vec4 worldSpaceCoordinates = modelViewMatrix * modelSpaceCoordinates;
  vec4 screenSpaceCoordinate = projectionMatrix * worldSpaceCoordinates;

  gl_Position = screenSpaceCoordinate;
}