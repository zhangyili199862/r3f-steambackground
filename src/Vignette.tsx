import vertexShader from "@/shaders/streamBackground/vignette_vertex.glsl";
import fragmentShader from "@/shaders/streamBackground/vignette_fragment.glsl";
import { Color, ShaderMaterial, Uniform } from "three";
import { useControls } from "leva";
import { useRef } from "react";
const Vignette = () => {
  const shaderMaterialRef = useRef<ShaderMaterial>(null);
  const { offset, multiplier } = useControls("Vignette", {
    offset: {
      value: 0,
      min: 0,
      max: 1,
      step: 0.01,
      onChange: (v) => {
        if (shaderMaterialRef.current) {
          shaderMaterialRef.current.uniforms.uOffset.value = v;
        }
      },
    },
    multiplier: {
      value: 1.3,
      min: 0,
      max: 2,
      step: 0.01,
      onChange: (v) => {
        if (shaderMaterialRef.current) {
          shaderMaterialRef.current.uniforms.uMultiplier.value = v;
        }
      },
    },
  });
  return (
    <>
      <mesh position={[0, 0, 0.000001]}>
        <planeGeometry args={[2, 2, 1, 1]} />
        <shaderMaterial
          ref={shaderMaterialRef}
          uniforms={{
            uColor: new Uniform(new Color(0x130819)),
            uOffset: new Uniform(offset),
            uMultiplier: new Uniform(multiplier),
          }}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent={true}
          depthWrite={false}
          depthTest={false}
        ></shaderMaterial>
      </mesh>
    </>
  );
};

export default Vignette;
