#define PI 3.14159265358979323844

uniform float time;
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

vec3 targetPosition() {
  float width = 20.0;
  float height = 40.0;
  float z = -width/2.0;
  if (deviance.y < 0.03) z -= width;
  if (deviance.y > 0.2) z += width;

  return vec3(-20.0, 30.0 + deviance.w*height, z + deviance.z*width);
}

void main() {

  vec3 startPosition = startPosition();
  
  vec3 targetPosition = targetPosition();

  float movementSpeed = 1.0/2.0;
  float releaseTempo = 1.0/10.0;
  float relativeTime = (time - deviance.x/releaseTempo) * movementSpeed;
  relativeTime = clamp(relativeTime, 0.0, 1.0);

  vec3 newPosition = mix(startPosition, targetPosition, easeInOutQuad(relativeTime));

  particlePosition = newPosition;
  devianceForFragshader = deviance;

  vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
  
  gl_PointSize = particleSize*pixelRatio/length(mvPosition.xyz);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}