varying vec3 colorForFragshader;

void main() {
  vec3 color = colorForFragshader;

  float alpha = 1.0;

  float radius = 2.0 * length(gl_PointCoord - vec2(0.5));
  alpha = 1.0 - radius;

  float strength = 5.0;
  alpha *= strength;

  gl_FragColor = vec4(colorForFragshader, alpha);
}