uniform float time;

varying vec3 colorForFragshader;

vec4 circle(vec3 color, vec2 pointCoord) {
  float radius = length(pointCoord * 2.0 - vec2(1.0));
  
  float sharpness = 4.0;

  float alpha = sharpness * clamp(1.0 - radius, 0.0, 1.0);

  return vec4(color.xyz, alpha);
}

void main() {
  vec3 white = vec3(1.0);

  gl_FragColor = circle(colorForFragshader, gl_PointCoord);
}