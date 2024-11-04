import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import {
  AdditiveBlending,
  Color,
  Group,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  Vector3,
} from "three";

const Smoke = () => {
  const texture = useTexture("/smoke.png");
  console.log(texture);
  const count = 10;
  const smokeRef = useRef<Group>(null);
  const geometry = new PlaneGeometry(1, 1, 1, 1);
  const smokes = Array.from({ length: count }, () => {
    const material = new MeshBasicMaterial({
      transparent: true,
      depthWrite: false,
      depthTest: false,
      // blending: AdditiveBlending,
      alphaMap: texture,
      opacity: 1,
      // opacity: 0.1 + Math.random() * 0.4,
    });
    return {
      geometry: geometry,
      material: material,
      position: new Vector3((Math.random() - 0.5) * 10, 0, 0),
      scale: Math.random() * 3 + 3,
      rotateSpeed: (Math.random() - 0.5) * Math.random() * 0.4,
      floatingSpeed: Math.random() * 0.2,
    };
  });
  const smokeRefs = useRef<Mesh<any>[]>([]);
  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    smokeRefs.current.forEach((smoke, index) => {
      smoke.rotation.z = elapsedTime * smokes[index].rotateSpeed;
      smoke.position.y = Math.sin(elapsedTime * smokes[index].floatingSpeed);

      //Set Smoke Color
      const color = new Color(`hsl(${elapsedTime * 5},32%,38%)`);
      color.lerp(new Color(0xffffff), 0.1);
      (smoke.material as MeshBasicMaterial).color.copy(color);
    });
  });
  return (
    <group position={[0, -2, 0.00001]} ref={smokeRef}>
      {smokes.map((smoke, index) => {
        return (
          <mesh
            key={index}
            ref={(el: Mesh) => (smokeRefs.current[index] = el)}
            geometry={smoke.geometry}
            material={smoke.material}
            position={smoke.position}
            scale={smoke.scale}
          ></mesh>
        );
      })}
    </group>
  );
};
export default Smoke;
