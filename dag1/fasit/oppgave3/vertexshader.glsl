uniform float time;

void main() {
  // position er vertex-koordinatene gitt av webgl til shaderen
  vec4 modelSpaceCoordinates = vec4(position.x, position.y, position.z, 1.0);

  // modelViewMatrix inneholder modellens translasjon og rotasjon
  vec4 worldSpaceCoordinates = modelViewMatrix * modelSpaceCoordinates;

  // projectionMatrix projiserer til 2D
  vec4 screenSpaceCoordinate = projectionMatrix * worldSpaceCoordinates;

  // gl_Position er output
  gl_Position = screenSpaceCoordinate;
}