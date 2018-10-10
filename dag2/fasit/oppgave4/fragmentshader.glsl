// vertexPosition er interpolert mellom (-1, -1) og (1, 1) 
// fordi geometrien er et sentrert plane med bredde og høyde lik 2
varying vec2 vertexPosition;

uniform vec3 baseColor;
uniform float coreSize;
uniform float glowFalloff;
uniform float glowIntensity;

void main() {
    float radius = length(vertexPosition);
    float angle = atan(vertexPosition.y / vertexPosition.x);

    float alpha = radius < coreSize ? 1.0 : 0.0;

    float glowDistance = clamp(radius - coreSize, 0.0, 1.0);

    float glow = 1.0 - glowDistance;

    glow = pow(glow, glowFalloff);

    glow *= glowIntensity;
    
    alpha += glow;

    vec3 color = baseColor;

    float brightness = 0.9;
    color += glow * brightness;

    float nofBeams = 6.0;
    float wave = sin(angle * nofBeams);

    wave = clamp(wave, 0.0, 1.0);

    float beamFalloff = 1.0 - glowDistance;
    float beamStrength = 0.075;
    wave *= beamStrength * beamFalloff;

    alpha += wave;

    gl_FragColor = vec4(color, alpha);
}