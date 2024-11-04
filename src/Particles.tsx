import particlesVertexShader from "@/shaders/streamBackground/particles_vertex.glsl";
import particlesFragmentShader from "@/shaders/streamBackground/particles_fragment.glsl";
import {
  AdditiveBlending,
  BufferGeometry,
  Color,
  DoubleSide,
  Float32BufferAttribute,
  ShaderMaterial,
  Uniform,
} from "three";
import { useMemo, useRef, useState } from "react";
import { useControls } from "leva";
import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
const Particles = () => {
  const particleMaskTexture = useTexture("/particleMask.png");
  const { size, progressSpeed, perlinFrequency, perlinMultiplier } =
    useControls("Particles", {
      size: {
        value: 50,
        min: 0,
        max: 100,
        step: 1,
        onChange: (v) => {
          if (shaderMaterialRef.current) {
            shaderMaterialRef.current.uniforms.uSize.value = v;
          }
        },
      },
      progressSpeed: {
        value: 0.05,
        min: 0,
        max: 0.2,
        step: 0.001,
        onChange: (v) => {
          if (shaderMaterialRef.current) {
            shaderMaterialRef.current.uniforms.uProgressSpeed.value = v;
          }
        },
      },
      perlinFrequency: {
        value: 0.2,
        min: 0,
        max: 1,
        step: 0.01,
        onChange: (v) => {
          if (shaderMaterialRef.current) {
            shaderMaterialRef.current.uniforms.uPerlinFrequency.value = v;
          }
        },
      },
      perlinMultiplier: {
        value: 3,
        min: 0,
        max: 10,
        step: 0.01,
        onChange: (v) => {
          if (shaderMaterialRef.current) {
            shaderMaterialRef.current.uniforms.uPerlinMultiplier.value = v;
          }
        },
      },
    });
  const [count, setCount] = useState(2000);
  const geometry = new BufferGeometry();
  const positionFloat32Array = new Float32Array(count * 3);
  const progressFloat32Array = new Float32Array(count);
  const sizeFloat32Array = new Float32Array(count);
  const alphaFloat32Array = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    positionFloat32Array[i * 3] = (Math.random() - 0.5) * 10;
    positionFloat32Array[i * 3 + 1] = 0;
    positionFloat32Array[i * 3 + 2] = (Math.random() - 0.5) * 10;

    progressFloat32Array[i] = Math.random();

    sizeFloat32Array[i] = Math.random();

    alphaFloat32Array[i] = Math.random();
  }
  geometry.setAttribute(
    "position",
    new Float32BufferAttribute(positionFloat32Array, 3)
  );
  geometry.setAttribute(
    "aProgress",
    new Float32BufferAttribute(progressFloat32Array, 1)
  );
  geometry.setAttribute(
    "aSize",
    new Float32BufferAttribute(sizeFloat32Array, 1)
  );
  geometry.setAttribute(
    "aAlpha",
    new Float32BufferAttribute(alphaFloat32Array, 1)
  );
  const shaderMaterialRef = useRef<ShaderMaterial>(null);
  useFrame(({ clock }) => {
    if (shaderMaterialRef.current) {
      shaderMaterialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  });
  return (
    <points geometry={geometry} position={[0, -5, 0]}>
      <shaderMaterial
        transparent
        depthWrite={false}
        depthTest={false}
        ref={shaderMaterialRef}
        blending={AdditiveBlending}
        uniforms={{
          uTime: new Uniform(0),
          uMask: new Uniform(particleMaskTexture),
          uSize: new Uniform(size),
          uProgressSpeed: new Uniform(progressSpeed),
          uPerlinFrequency: new Uniform(perlinFrequency),
          uPerlinMultiplier: new Uniform(perlinMultiplier),
        }}
        side={DoubleSide}
        vertexShader={particlesVertexShader}
        fragmentShader={particlesFragmentShader}
      />
    </points>
  );
};

export default Particles;
