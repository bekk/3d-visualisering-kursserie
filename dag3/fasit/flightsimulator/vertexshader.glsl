uniform sampler2D heightMap;
varying vec2 textureCoord;

void main() {
  textureCoord = uv;

  vec4 texel = texture2D(heightMap, textureCoord);
  
  float heightScale = 2000.0;

  vec3 newPosition = position;
  newPosition.y = texel.r * heightScale;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}