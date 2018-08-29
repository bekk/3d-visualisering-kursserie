#define PI 3.14159265358979323844

uniform float time;
uniform float transitionTime;
uniform float phase;
uniform float nofParticles;
uniform float particleSize;
uniform float pixelRatio;

varying vec3 particlePosition;
varying vec4 devianceForFragshader;

attribute float vertexIndex;
attribute vec4 deviance;

float easeOutCubic(float t) {
  t--;
  return t*t*t + 1.0;
}

float easeInOutCubic(float t) {
  if (t < 0.5) 
    return 4.0*t*t*t;
  else 
    return (t-1.0)*(2.0*t-2.0)*(2.0*t-2.0)+1.0;
}

float easeInOutQuad(float t) {
  return t < 0.5 ? 2.0*t*t : -1.0+(4.0-2.0*t)*t;
}

vec2 get2DCoord(float index, float width) {
  float x = mod(vertexIndex, width);
  float y = floor(vertexIndex / width);

  return vec2(x, y);
}

vec3 get3DCoord(float index, float width, float depth) {
  float x = mod(index, width);
  float y = floor(index / (width * depth));
  float z = mod(floor(index / width), depth);

  return vec3(x, y, z);
}

vec3 startPosition() {
  float square = floor(sqrt(nofParticles));

  vec2 coord2D = get2DCoord(vertexIndex, square) - vec2(square/2.0);

  vec3 gridPosition = vec3(coord2D.x, 0, coord2D.y);

  float wavelength = 1.0/10.0;
  float wavespeed = 3.0;
  float amplitude = 3.0;
  float wave = amplitude * sin(gridPosition.z*wavelength + time*wavespeed);

  return vec3(
    gridPosition.x, 
    gridPosition.y + wave, 
    gridPosition.z
  );
}

mat2 rotate2d(float angle){
  return mat2(
    cos(angle), -sin(angle),
    sin(angle), cos(angle)
  );
}

vec3 targetPosition() {
  float width = 25.0;
  float depth = 25.0;

  float spread = 3.0;

  vec3 coordNormalized = get3DCoord(vertexIndex, width, depth) - vec3(width/2.0);

  vec3 origo = vec3(0.0);//vec3(-40.0, 15.0, 10.0) + deviance.xyz;

  vec3 target = coordNormalized * spread + origo;

  float speed = 0.3;

  vec2 rotated = rotate2d(time * speed) * vec2(target.x, target.z);

  return vec3(rotated.x, target.y, rotated.y);
}

void main() {

  vec3 startPosition = startPosition();
  vec3 targetPosition = targetPosition();

  if (phase == 1.0 && transitionTime < 1.0) {
    vec3 temp = startPosition;
    startPosition = targetPosition;
    targetPosition = temp;
  }

  vec3 newPosition = mix(startPosition, targetPosition, easeInOutQuad(transitionTime));

  particlePosition = newPosition;
  devianceForFragshader = deviance;

  vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
  
  gl_PointSize = particleSize*pixelRatio/length(mvPosition.xyz);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}