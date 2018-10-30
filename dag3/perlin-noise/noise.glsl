#pragma glslify: snoise3 = require(glsl-noise/simplex/3d);

float noise(float t, vec3 position) {
  vec3 basePos = vec3(position.x, position.y + t, 0.0);
  float offset1 = snoise3(basePos * 0.25);
  float offset2 = snoise3(basePos * 0.1);
  float sumavg = offset1 * 0.5 + offset2 * 0.5;

  float offset = sumavg;

  return offset * 5.0;
}

#pragma glslify: export(noise)
