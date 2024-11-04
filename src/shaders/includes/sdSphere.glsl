float sdCapsule(vec3 p, vec3 a, vec3 b, float r) {
    vec3 ab = b - a;
    vec3 ap = p - a;

    float t = dot(ab, ap) / dot(ab, ab);
    t = clamp(t, 0.0, 1.0);

    vec3 c = a + t * ab;

    float d = length(p - c) - r;

    return d;
}

float sdSphere(vec3 p, float radius) {
    return length(p) - radius;
}

float sdTorus(vec3 p, vec2 r) {
    float x = length(p.xz) - r.x;
    return length(vec2(x, p.y)) - r.y;
}

float sdCross(vec3 p, float s) {
    float da = max(abs(p.x), abs(p.y));
    float db = max(abs(p.y), abs(p.z));
    float dc = max(abs(p.z), abs(p.x));

    return min(da, min(db, dc)) - s;
}