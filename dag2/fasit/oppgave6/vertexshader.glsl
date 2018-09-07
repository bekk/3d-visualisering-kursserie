#define PI 3.14159265358979323844

uniform float time;
uniform float pixelRatio;
uniform float nofParticles;
attribute float vertexIndex;
uniform float animationTime;

attribute vec3 color;
varying vec3 colorForFragshader;

vec3 gridPosition() {
    float w = floor(sqrt(nofParticles));
    float i = vertexIndex;

    float x = mod(i, w);
    float y = floor(i / w);

    return vec3(x - w/2.0, 0.0, y - w/2.0);
}

float easeInOutCubic(float t) {
  if (t < 0.5) 
    return 4.0*t*t*t;
  else 
    return (t-1.0)*(2.0*t-2.0)*(2.0*t-2.0)+1.0;
}

void main() {
  vec3 newPosition = gridPosition();

  float x = newPosition.x;

  float waveSpeed = 3.0;
  float waveLength = 10.0;
  x = x / waveLength + time * waveSpeed;

  float amplitude = 3.0;
  newPosition.y += amplitude * sin(x);


  bool isGreen = color.g > color.r && color.g > color.b; // .r er en snarvei for .x, og så videre for g og b. Praktisk for vektorer som er farger.

  if (isGreen) {
    float targetHeight = 20.0;

    float movement = -abs(animationTime * 2.0 - 1.0) + 1.0;
    
    movement = easeInOutCubic(movement);

    newPosition.y = mix(newPosition.y, targetHeight, movement);
  }

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

  float particleSize = 300.0;

  gl_PointSize = particleSize * pixelRatio / gl_Position.z;

  colorForFragshader = color;
}