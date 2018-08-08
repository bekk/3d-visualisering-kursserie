// vertexPosition er interpolert mellom (-1, -1) og (1, 1) 
// fordi geometrien er et sentrert plane med bredde og høyde lik 2
varying vec3 vertexPosition;

uniform vec3 baseColor;

void main() {
    float r = length(vertexPosition);

    vec3 yellow = vec3(1.0, 0.75, 0.5);
    vec3 color = baseColor;

    float alpha = 0.0;

    float coreSize = 0.1;
    if (r < coreSize) {
        float coreSharpness = 10.0;
        float diff = 1.0 - r/coreSize;
        float factor = clamp(diff * coreSharpness, 0.0, 1.0);
        alpha += factor;
        color += factor;
    }

    float glowStrength = 0.5;
    alpha += (1.0 - r) * glowStrength;

    gl_FragColor = vec4(color, alpha);
}