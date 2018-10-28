#pragma glslify: noise = require(./noise.glsl);

varying vec3 positionVec;
varying vec3 fragNormal;
uniform float time;
uniform vec3 light;

void main() {
    float offset = noise(time, positionVec);
    float lightOffset = noise(time, light);

    vec3 normal = normalize(fragNormal);
    vec3 lightPos = vec3(light.xy, light.z + lightOffset);
    vec3 lightDir = normalize(lightPos - positionVec);
    float diffuse = max(0.0, dot(lightDir, normal));

    // float colorOffset = coffset1 + coffset2;
    // float colorFade = positionVec.y / 200.0;

    vec3 color = mix(vec3(.0, .25, .0), vec3(.0, 1., .0), offset);
    // vec3 color2 = vec3(colorFade, 0.0, colorFade) + mix(vec3(0.0), vec3(1.0, 0.5, 0.0), colorOffset);
    vec3 finalColor = (clamp(diffuse, .75, 1.0) - .75) * 2.5 * color;

    gl_FragColor = vec4(finalColor, 1.0);
}
