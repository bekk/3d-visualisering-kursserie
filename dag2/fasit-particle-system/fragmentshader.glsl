uniform float time;

varying vec4 devianceForFragshader;
varying vec3 particlePosition;

vec4 circle(vec3 color, vec2 pointCoord) {
  float alpha;

  float gradient = 1.0 - length(pointCoord - vec2(0.5, 0.5));
  
  if (gradient > 0.5) // TODO: Use ternary
    alpha = 1.0; 
  else 
    alpha = 0.0;
  
  float gradientWidth = 0.1;
  if (gradient < 0.5 + gradientWidth && gradient > 0.5) 
    alpha = 1.0 - (0.5 + gradientWidth - gradient) / gradientWidth;

  return vec4(color.x, color.y, color.z, alpha);
}

void main() {
  vec3 white = vec3(1.0);
  vec3 green = vec3(0.5, 1.0, 0.5);
  vec3 red = vec3(1.0, 0.25, 0.25);

  vec3 color = white;
  if (devianceForFragshader.y < 0.03) color = green;
  if (devianceForFragshader.y > 0.2) color = red;

  gl_FragColor = circle(color, gl_PointCoord);
}