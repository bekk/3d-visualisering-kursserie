uniform sampler2D textureMap;
varying vec2 textureCoord;

void main() {
  gl_FragColor = texture2D(textureMap, textureCoord);
}