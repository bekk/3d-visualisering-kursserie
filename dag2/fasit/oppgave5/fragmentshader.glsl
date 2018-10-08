varying vec3 normalVec;

void main() {
    vec3 color = normalVec * 0.5 + 0.5;
    float alpha = 1.0;

    gl_FragColor = vec4(color, alpha);
}
