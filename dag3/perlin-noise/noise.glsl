#pragma glslify: snoise3 = require(glsl-noise/simplex/3d);

float noise(float t0, vec3 position) {
  float t = (t0 * 0.0015);
  vec3 basePos = vec3(position.x, position.y + t, 0);
  float offset1 = snoise3(basePos);
  float offset2 = snoise3(basePos*.5);
  float offset3 = snoise3(basePos*.25);
  float offset4 = .0;//snoise3(basePos*.1);
  float sumavg = offset2 * .5 + offset3 * .25 + offset4 * .25;

  float offset = sumavg;

  return offset * 5.;
}

#pragma glslify: export(noise)
