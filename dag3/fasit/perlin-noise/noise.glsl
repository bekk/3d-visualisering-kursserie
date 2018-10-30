#pragma glslify: snoise3 = require(glsl-noise/simplex/3d);

float noiseFunction(float t, vec3 position) {
  vec3 offsetPosition = vec3(position.x, position.y + t, position.z);
  float n1 = snoise3(0.25 * offsetPosition);
  float n2 = snoise3(0.1 * offsetPosition);
  float n = n1 + n2;

  return n * 2.5;
}

#pragma glslify: export(noiseFunction)
