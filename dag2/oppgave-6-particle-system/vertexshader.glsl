#define PI 3.14159265358979323844

uniform float time;
uniform float pixelRatio;
uniform float nofParticles;

void main() {
  vec3 newPosition = vec3(0.0, 0.0, 0.0);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}