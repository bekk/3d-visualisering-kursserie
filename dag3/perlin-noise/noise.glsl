#pragma glslify: snoise3 = require(glsl-noise/simplex/3d);

float noise(float t0, vec3 position) {
  float t = (t0 * 0.0015);
  vec3 basePos = vec3(position.x, position.y + t, 0);
  float offset1 = snoise3(basePos*.5);
  float offset2 = snoise3(basePos*.25);
  float sumavg = offset1 * .5 + offset2 * .5;

  float offset = sumavg;

  return offset * 5.;
}

#pragma glslify: export(noise)
