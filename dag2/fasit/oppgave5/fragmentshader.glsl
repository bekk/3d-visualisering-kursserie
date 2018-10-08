varying vec3 normalVec;

void main() {
    vec3 color = 0.5 * normalVec + 0.5;
    float alpha = 1.0;

    gl_FragColor = vec4(color, alpha);
}
