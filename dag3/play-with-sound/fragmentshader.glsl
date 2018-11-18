uniform float soundLevel;

void main() {
  vec4 baseRed = vec4(1.0, 0.15, 0.15, 1.0);
  float redness = soundLevel / 3000.0;
  gl_FragColor = baseRed * (redness + 0.2);
}
