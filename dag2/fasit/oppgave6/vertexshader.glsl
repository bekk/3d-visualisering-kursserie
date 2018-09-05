#define PI 3.14159265358979323844

uniform float time;
uniform float impulseTime;
uniform float nofParticles;
uniform float particleSize;
uniform float pixelRatio;

varying vec3 particlePosition;
varying vec3 colorForFragshader;

attribute float vertexIndex;
attribute vec3 color;

vec3 gridPosition() {
  float square = floor(sqrt(nofParticles));

  float x = mod(vertexIndex, square);
  float y = floor(vertexIndex / square);

  vec2 coord2D = vec2(x, y);

  vec2 origo = vec2(square/2.0);

  coord2D -= origo;

  return vec3(coord2D.x, 0, coord2D.y);
}

float wave(float x, float frequency, float amplitude, float wavespeed) {
  return amplitude * sin(x * frequency + time * wavespeed);
}

void main() {
  vec3 newPosition = gridPosition();

  newPosition.y += wave(newPosition.z, 0.1, 3.0, 3.0);

  bool isGreen = color.y > color.x && color.y > color.z;

  //float impulseStrength = (sin(impulseTime * 2.0 * PI - PI/2.0) + 1.0) / 2.0; // f(x)=(sin(x*2*3.14 - 3.14/2) + 1) / 2
  float impulseStrength = 1.0-abs(1.0-impulseTime*2.0);

  if (isGreen) {
    newPosition.y += 50.0 * impulseStrength;
    newPosition.y = min(newPosition.y, 20.0);
  }

  particlePosition = newPosition;
  colorForFragshader = color;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

  gl_PointSize = particleSize * pixelRatio / gl_Position.z;
}