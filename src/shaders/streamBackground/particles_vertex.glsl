uniform float uTime;
uniform float uSize;
uniform float uProgressSpeed;
uniform float uPerlinFrequency;
uniform float uPerlinMultiplier;

attribute float aProgress;
attribute float aSize;
attribute float aAlpha;

varying float vAlpha;
varying vec2 vUv;

#include "../includes/perlinClassic3D.glsl";
void main() {
    float progress = mod(aProgress * uTime * uProgressSpeed, 1.0);
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.y += progress * 10.0;
    modelPosition.x += perlinClassic3D((modelPosition.xyz + vec3(0.0, -uTime * 0.1, 0.0)) * uPerlinFrequency) * uPerlinMultiplier;

    vec4 viewPosition = viewMatrix * modelPosition;

    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = aSize * uSize;
    gl_PointSize *= (1.0 / -viewPosition.z);

    vUv = uv;
    vAlpha = aAlpha;
}