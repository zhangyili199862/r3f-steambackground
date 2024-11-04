float noise(in vec3 x) {
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);

    vec2 uv = (p.xy + vec2(37.0, 239.0) * p.z) + f.xy;
    vec2 tex = textureLod(uNoise, (uv + 0.5) / 256.0, 0.0).yx;

    return mix(tex.x, tex.y, f.z) * 2.0 - 1.0;
}