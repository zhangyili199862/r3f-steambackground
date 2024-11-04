#define rot(a) mat2(cos(a), -sin(a), sin(a), cos(a))
uniform vec2 uResolution;
uniform vec3 uBaseColor;
uniform float uTime;
uniform float uBoxSize;
uniform float uWaveFrequency;
uniform float uWaveSpeed;
uniform float uColorWaveFrequency;
uniform float uColorSpeed;
uniform int uParticleCount;
uniform float uParticleSpeed;
uniform float uParticleSize;
uniform float uBaseTransparency;
uniform int uDetailLayers;
uniform float uLayerScaleStep;
uniform float uDetailWaveFrequencyStep;
uniform float uDetailWaveSpeedStep;

varying vec2 vUv;

// 计算点到正方形边缘的距离
float sdBox(in vec2 p, in vec2 b) {
    vec2 d = abs(p) - b;
    return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

// 稳定的随机数生成
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
    // 将 UV 居中，使其范围为 (-0.5, 0.5)
    vec2 centeredUv = vUv - 0.5;

    // 获取屏幕的宽高比
    float aspectRatio = uResolution.x / uResolution.y;

    // 根据宽高比调整 UV，以保持居中且比例正确
    vec2 scaledUv = centeredUv * vec2(aspectRatio, 1.0);
    vec2 uv = scaledUv;

    // 1. **旋转参数**
    float rotationAngle = uTime * 0.1;
    uv *= rot(rotationAngle);

    // 2. **正方形距离计算参数**
    vec2 boxSize = vec2(uBoxSize);
    float distToBox = sdBox(uv, boxSize);

    // 3. **波动效果**
    float angle = atan(uv.x, uv.y);
    float waveFrequency = uWaveFrequency;
    float waveSpeed = uWaveSpeed;
    float waveEffect = 0.02 * cos(angle * waveFrequency + uTime * waveSpeed);
    distToBox += waveEffect;

    // 4. **基础颜色映射参数**
    vec3 baseColor = uBaseColor;
    float colorWaveFrequency = uColorWaveFrequency;
    float colorSpeed = uColorSpeed;
    float colorEffect = 0.01 / abs(sin(distToBox * colorWaveFrequency - uTime * colorSpeed) / 16.0);

    // colorEffect *= (distToBox * 0.5);
    vec3 color = mix(vec3(0), baseColor, colorEffect);

    // // 5. **粒子效果**
    int particleCount = uParticleCount; // 粒子数量
    float particleSpeed = uParticleSpeed; // 控制粒子运动速度
    float particleSize = uParticleSize; // 控制粒子大小
    float baseTransparency = uBaseTransparency; // 基础透明度

    // // 粒子的循环生成
    for(int i = 0; i < particleCount; i++) {
        // 基于 i 和 uTime 生成随机粒子位置
        vec2 randomOffset = vec2(random(vec2(float(i), uTime)), random(vec2(float(i * 2), uTime)));
        vec2 particlePos = randomOffset * 2.0 - 1.0; // 提前计算

        // 粒子运动轨迹
        particlePos += vec2(sin(uTime * particleSpeed + float(i) * 0.3), cos(uTime * particleSpeed + float(i) * 0.3)) * 0.15;

        // 计算当前像素与粒子的距离
        float distToParticle = length(uv - particlePos);

        // 6. **粒子颜色变化**
        // 1. 基于时间：颜色周期性变化，形成动态效果
        float timeColorFactor = 0.5 + 0.5 * sin(uTime + float(i) * 0.5);

        // 2. 基于位置：根据粒子位置动态调整颜色
        vec3 positionColor = vec3(particlePos.x, particlePos.y, 1.0 - particlePos.x);

        // 3. 混合颜色：基于时间和位置变化颜色
        vec3 particleColor = mix(vec3(1.0, 0.5, 0.0), positionColor, timeColorFactor);

       // 透明度和颜色变化
        float distanceTransparency = smoothstep(particleSize, 0.0, distToParticle);
        float particleTransparency = baseTransparency * distanceTransparency * (0.5 + 0.5 * sin(uTime * 2.0 + float(i) * 0.5));

        // 优化叠加颜色
        color += mix(vec3(1.0, 0.5, 0.0), vec3(particlePos.x, particlePos.y, 1.0 - particlePos.x), timeColorFactor) * particleTransparency;
    }

    // 8. **细节波动叠加**
    int detailLayers = uDetailLayers;
    float layerScaleStep = uLayerScaleStep;
    float detailWaveFrequencyStep = uDetailWaveFrequencyStep;
    float detailWaveSpeedStep = uDetailWaveSpeedStep;
    for(float i = 0.0; i < float(detailLayers); i++) {
        float scale = 1.0 + i * layerScaleStep;
        vec2 detailUV = uv * scale;
        float detailDist = sdBox(detailUV, boxSize);
        float detailAngle = atan(detailUV.x, detailUV.y);
        float detailWaveEffect = 0.01 * cos(detailAngle * (waveFrequency + i * detailWaveFrequencyStep) + uTime * (waveSpeed + i * detailWaveSpeedStep));
        detailDist += detailWaveEffect;
        color += vec3(0.005 / abs(detailDist));
    }
    // **边缘平滑过渡优化**
    // 调整平滑过渡的范围，使其符合 distToBox 的小值域
    float smoothEdgeStart = 0.01; // 较小的开始值
    float smoothEdgeEnd = 0.0;   // 稍大的结束值
    float edgeSmoothFactor = smoothstep(smoothEdgeStart, smoothEdgeEnd, distToBox); // 基于正方形距离的平滑过渡

    // 将边缘平滑过渡效果应用到颜色上
    color = mix(color, mix(baseColor, vec3(1.0), 0.7), edgeSmoothFactor); // 过渡到黑色

    // 9. **边缘平滑过渡参数**
    // float smoothEdgeStart = 0.001;
    // float smoothEdgeEnd = 0.0;
    // color = mix(color, baseColor, smoothstep(smoothEdgeStart, smoothEdgeEnd, distToBox));

    // 输出颜色
    gl_FragColor = vec4(color, 1.0);
}
