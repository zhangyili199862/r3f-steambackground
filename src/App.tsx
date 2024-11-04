import { Canvas } from "@react-three/fiber";
import Gradient from "./Gradient";
import Particles from "./Particles";
import Smoke from "./Smoke";
import Vignette from "./Vignette";

const StreamBackgroundApp = () => {
  return (
    <>
      <Canvas camera={{ fov: 55, near: 0.1, far: 100, position: [0, 0, 5] }}>
        <Gradient />
        <Smoke />
        <Vignette />
        <Particles />
        {/* <OrbitControls makeDefault /> */}
      </Canvas>
    </>
  );
};

export default StreamBackgroundApp;
