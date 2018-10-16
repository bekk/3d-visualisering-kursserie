uniform sampler2D heightMap;
varying vec2 textureCoord;

void main() {
  textureCoord = uv;

  vec3 newPosition = position;

  vec4 texel = texture2D(heightMap, textureCoord);
  float heightScale = 2000.0;
  newPosition.y = texel.r * heightScale;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}