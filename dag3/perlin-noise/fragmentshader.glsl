#pragma glslify: noise = require(./noise.glsl);

varying vec3 positionVec;
varying vec3 fragNormal;
uniform float time;
uniform vec3 light;

void main() {
    float offset = noise(time, positionVec);
    float lightOffset = clamp(noise(time, light), 0.0, 5.0);

    vec3 normal = normalize(fragNormal);
    vec3 lightPos = vec3(light.xy, light.z + lightOffset);
    vec3 lightDir = normalize(lightPos - positionVec);
    float diffuse = max(0.0, dot(lightDir, normal));

    vec3 color = mix(vec3(0.25, 0.0, 1.0), vec3(1.0, 0.0, 1.0), offset);
    vec3 finalColor = (clamp(diffuse, .5, 1.0) - .5) * 2.5 * color;

    gl_FragColor = vec4(finalColor, 1.0);
}
