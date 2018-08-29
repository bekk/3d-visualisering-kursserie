uniform float soundLevel;

void main() {
  float redness = soundLevel / 3000.0;
  gl_FragColor = vec4(1.0, 0.15, 0.15, 1.0) * (redness + 0.2);
}
