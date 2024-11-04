import { shaderMaterial } from "@react-three/drei";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import vertexShader from "@/shaders/shaderWave/vertex.glsl";
import fragmentShader from "@/shaders/shaderWave/fragment.glsl";
import { useRef } from "react";
import { Color, ShaderMaterial, Vector2, Vector3 } from "three";
import { useControls } from "leva";
const ShaderWaveMaterial = shaderMaterial(
  {
    uTime: 0,
    uResolution: new Vector2(),
    uBaseColor: new Color(0x3786fd),
    uBoxSize: 0.1,
    uWaveFrequency: 50,
    uWaveSpeed: 1.5,
    uColorWaveFrequency: 16,
    uColorSpeed: 4,
    uParticleCount: 100,
    uParticleSpeed: 0.05,
    uParticleSize: 0.05,
    uBaseTransparency: 0.4,
    uDetailLayers: 100,
    uLayerScaleStep: 0.2,
    uDetailWaveFrequencyStep: 100.0,
    uDetailWaveSpeedStep: 0.2,
  },
  vertexShader,
  fragmentShader
);
extend({ ShaderWaveMaterial });
const ShaderWave = () => {
  const shaderRef = useRef<ShaderMaterial>(null);
  const {
    boxSize,
    waveFrequency,
    waveSpeed,
    colorWaveFrequency,
    colorSpeed,
    particleCount,
    particleSpeed,
    particleSize,
    baseTransparency,
    detailLayers,
    layerScaleStep,
    detailWaveFrequencyStep,
    detailWaveSpeedStep,
  } = useControls("Shader Wave", {
    boxSize: { value: 0.1, min: 0, max: 1, step: 0.01 },
    waveFrequency: { value: 50, min: 0, max: 100, step: 1 },
    waveSpeed: { value: 1.5, min: 0, max: 10, step: 0.1 },
    colorWaveFrequency: { value: 16, min: 0, max: 100, step: 1 },
    colorSpeed: { value: 4, min: 0, max: 10, step: 0.1 },
    particleCount: { value: 100, min: 0, max: 1000, step: 1 },
    particleSpeed: { value: 0.05, min: 0, max: 1, step: 0.01 },
    particleSize: { value: 0.05, min: 0, max: 1, step: 0.01 },
    baseTransparency: { value: 0.4, min: 0, max: 1, step: 0.01 },
    detailLayers: { value: 100, min: 0, max: 100, step: 1 },
    layerScaleStep: { value: 0.2, min: 0, max: 1, step: 0.01 },

    detailWaveFrequencyStep: { value: 50.0, min: 0, max: 100, step: 1 },
    detailWaveSpeedStep: { value: 0.2, min: 0, max: 1, step: 0.01 },
  });
  useFrame(({ clock, size }) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = clock.getElapsedTime();
      shaderRef.current.uniforms.uBoxSize.value = boxSize;
      shaderRef.current.uniforms.uWaveFrequency.value = waveFrequency;
      shaderRef.current.uniforms.uWaveSpeed.value = waveSpeed;
      shaderRef.current.uniforms.uColorWaveFrequency.value = colorWaveFrequency;
      shaderRef.current.uniforms.uColorSpeed.value = colorSpeed;
      shaderRef.current.uniforms.uParticleCount.value = particleCount;
      shaderRef.current.uniforms.uParticleSpeed.value = particleSpeed;
      shaderRef.current.uniforms.uParticleSize.value = particleSize;
      shaderRef.current.uniforms.uBaseTransparency.value = baseTransparency;
      shaderRef.current.uniforms.uDetailLayers.value = detailLayers;
      shaderRef.current.uniforms.uLayerScaleStep.value = layerScaleStep;
      shaderRef.current.uniforms.uDetailWaveFrequencyStep.value =
        detailWaveFrequencyStep;
      shaderRef.current.uniforms.uDetailWaveSpeedStep.value =
        detailWaveSpeedStep;

      shaderRef.current.uniforms.uResolution.value.set(size.width, size.height);
    }
  });

  return (
    <>
      <mesh>
        <planeGeometry args={[2, 2, 1, 1]}></planeGeometry>
        <shaderWaveMaterial ref={shaderRef}></shaderWaveMaterial>
      </mesh>
    </>
  );
};

const App = () => {
  return (
    <Canvas>
      <ShaderWave></ShaderWave>
    </Canvas>
  );
};

export default App;
