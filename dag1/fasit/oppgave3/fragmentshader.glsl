uniform float time;

void main() {
  const float speed = 3.0;
  float redness = (sin(time*speed) + 1.0) / 2.0;

  // gl_FragColor er output
  gl_FragColor = vec4(redness, 0.25, 0.25, 1.0);
}
