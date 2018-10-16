#pragma glslify: snoise3 = require(glsl-noise/simplex/3d);

varying vec3 positionVec;
uniform float time;

void main() {
    float t = (time * 0.001);
    float s1 = t * 2.0;
    float s2 = t;
    float coffset1 = snoise3(vec3(positionVec.x, positionVec.y - s1, positionVec.z)*0.25);
    float coffset2 = snoise3(vec3(positionVec.x, positionVec.y - s2, positionVec.z));

    float colorOffset = coffset1 + coffset2 / 10.0;
    float colorFade = positionVec.y / 200.0;

    vec3 color = mix(vec3(1.0, 0.0, 0.0), vec3(1.0, 0.7, 0.0), colorOffset);
    vec3 color2 = vec3(colorFade, 0.0, colorFade) + mix(vec3(0.0), vec3(1.0, 0.5, 0.0), colorOffset);

    gl_FragColor = vec4(color2, 1.0);
}
