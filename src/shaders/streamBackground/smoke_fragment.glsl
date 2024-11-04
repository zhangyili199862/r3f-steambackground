uniform vec2 uSize;
uniform float uTime;

varying vec2 vUv;
#include "../includes/perlinClassic3D.glsl";

void main() {
    vec2 smokeUv = vUv * uSize * 0.01;
    smokeUv.x += perlinClassic3D(vec3(smokeUv * 0.2 + 23.45, 0.0)) * 6.0;

    smokeUv.y /= 2.0;

    smokeUv.y -= uTime * 0.3;

    smokeUv.y += perlinClassic3D(vec3(smokeUv + 123.45, 0.0));

    float smokeStrength = perlinClassic3D(vec3(smokeUv, uTime * 0.0001));
    smokeStrength *= pow(1.0 - vUv.y, 2.0);
    // vec2 newUv = vUv;
    // newUv.y = mod(uTime, 1.0);
    gl_FragColor = vec4(1.0, 1.0, 1.0, smokeStrength);
}