import vertexShader from "@/shaders/streamBackground/vertex.glsl";
import fragmentShader from "@/shaders/streamBackground/fragment.glsl";
import { Color, ShaderMaterial, Uniform } from "three";
import { useRef } from "react";
import { useControls } from "leva";
import { useFrame } from "@react-three/fiber";
const Gradient = () => {
  const materialRef = useRef<ShaderMaterial>(null);
  const { startColor, endColor } = useControls("Gradient", {
    endColor: {
      value: "#1a2036",
      onChange: (v) => {
        if (materialRef.current) {
          materialRef.current.uniforms.uEndColor.value = new Color(v);
        }
      },
    },
    startColor: {
      value: "hsl(0,32%,38%)",
      onChange: (v) => {
        if (materialRef.current) {
          materialRef.current.uniforms.uStartColor.value = new Color(v);
        }
      },
    },
  });
  const uniforms = {
    uTime: new Uniform(0),
    uStartColor: new Uniform(startColor),
    uEndColor: new Uniform(new Color(endColor)),
  };
  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    if (materialRef.current) {
      materialRef.current.uniforms.uStartColor.value = new Color(
        `hsl(${elapsedTime * 5},32%,38%)`
      );
    }
  });
  return (
    <>
      <mesh>
        <planeGeometry args={[2, 2, 1, 1]}></planeGeometry>
        <shaderMaterial
          depthWrite={false}
          depthTest={false}
          transparent
          uniforms={uniforms}
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
        ></shaderMaterial>
      </mesh>
    </>
  );
};

export default Gradient;
