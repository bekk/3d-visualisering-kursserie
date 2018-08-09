// vertexPosition er interpolert mellom (-1, -1) og (1, 1) 
// fordi geometrien er et sentrert plane med bredde og høyde lik 2
varying vec3 vertexPosition;

uniform vec3 baseColor;
uniform float coreSize;
uniform float glowRange;
uniform float glowIntensity;


void main() {
    float radius = clamp(length(vertexPosition), 0.0, 1.0);
    float radInverse = 1.0 - radius;
    vec2 polarCoord = vec2(
        length(vertexPosition),
        atan(vertexPosition.y / vertexPosition.x)
    );

    vec3 color = baseColor;
    float alpha = 0.0;

    float coreSharpness = 10.0;

    if (radius < coreSize) {
        float diff = 1.0 - radius/coreSize;
        float factor = clamp(diff * coreSharpness, 0.0, 1.0);
        alpha += factor;
        color += factor;
    }

    alpha += pow(radInverse, 3.0) * glowRange;
    color += pow(radInverse, 3.0) * glowIntensity;

    float nofBeams = 6.0;
    float beamStrength = 0.1;
    alpha += clamp(sin(polarCoord.y * nofBeams), 0.0, 1.0) * beamStrength * radInverse;

    gl_FragColor = vec4(color, alpha);
}