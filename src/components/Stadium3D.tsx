import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, PerspectiveCamera, Stars } from '@react-three/drei';
import * as THREE from 'three';

function RealisticStadium() {
  const groupRef = useRef<THREE.Group>(null);
  const fieldRef = useRef<THREE.Mesh>(null);
  
  // Camera/Scene subtle rotation & Scroll Parallax
  useFrame(({ clock, pointer, camera }) => {
    if (groupRef.current) {
      // Base rotation + mouse interaction
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.05) * 0.05 + pointer.x * 0.02;
      groupRef.current.rotation.x = pointer.y * 0.02;
      
      // Scroll Parallax (read global scroll)
      const scrollY = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const scrollProgress = maxScroll > 0 ? scrollY / maxScroll : 0;
      
      // Parallax effect: Stadium rotates and moves down slightly on scroll
      groupRef.current.rotation.y += scrollProgress * Math.PI; 
      camera.position.y = 15 - scrollProgress * 10;
      camera.lookAt(0, 0, -40);
    }
    
    // Green patch field follows mouse
    if (fieldRef.current) {
      // Move the field slightly opposite to mouse pointer for depth
      fieldRef.current.position.x = THREE.MathUtils.lerp(fieldRef.current.position.x, -pointer.x * 5, 0.1);
      fieldRef.current.position.z = THREE.MathUtils.lerp(fieldRef.current.position.z, -40 + pointer.y * 5, 0.1);
      // Tilt field slightly on mouse move
      fieldRef.current.rotation.x = -Math.PI / 2 + pointer.y * 0.05;
      fieldRef.current.rotation.y = pointer.x * 0.05;
    }
  });

  // Generate seating tiers
  const tiers = useMemo(() => {
    const items = [];
    const colors = ['#2a3b4c', '#1e2b3c', '#151e2b']; // Sleek metallic/blue seating
    
    for (let i = 0; i < 3; i++) {
      items.push(
        <mesh key={`tier-${i}`} position={[0, i * 8, -40]} rotation={[0.1, 0, 0]}>
          {/* A large cylinder segment acting as the seating bowl */}
          <cylinderGeometry args={[50 + i * 15, 40 + i * 15, 10, 64, 1, true, 0, Math.PI]} />
          <meshStandardMaterial 
            color={colors[i]}
            roughness={0.7}
            metalness={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      );
    }
    return items;
  }, []);

  // Roof structure
  const roof = useMemo(() => {
    return (
      <mesh position={[0, 30, -40]} rotation={[0.1, 0, 0]}>
        <cylinderGeometry args={[45, 95, 2, 64, 1, true, 0, Math.PI]} />
        <meshStandardMaterial 
          color="#f3f4f6"
          roughness={0.2}
          metalness={0.8}
          side={THREE.DoubleSide}
          transparent
          opacity={0.9}
        />
      </mesh>
    );
  }, []);

  return (
    <group ref={groupRef}>
      {/* The Dynamic Pitch (Tracks Mouse) */}
      <mesh ref={fieldRef} position={[0, -10, -40]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[200, 200, 32, 32]} />
        <meshStandardMaterial 
          color="#0f3d1a" 
          roughness={0.8} 
          metalness={0.2}
          wireframe={true}
          transparent={true}
          opacity={0.3}
        />
      </mesh>

      {/* Pitch Lines */}
      {/* Outer boundary */}
      <mesh position={[0, -9.9, -40]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 64]} />
        <meshBasicMaterial color="#ffffff" wireframe />
      </mesh>
      {/* Center circle */}
      <mesh position={[0, -9.9, -40]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[9, 9.5, 32]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      {/* Center line */}
      <mesh position={[0, -9.9, -40]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.5, 64]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Seating Tiers */}
      {tiers}
      
      {/* Roof */}
      {roof}

      {/* Floating abstract particles simulating flashes from crowd */}
      <Stars radius={100} depth={50} count={1000} factor={3} saturation={0} fade speed={2} />
    </group>
  );
}

export default function Stadium3D() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
      <Canvas>
        {/* Spectator Viewpoint */}
        <PerspectiveCamera makeDefault position={[0, 15, 30]} fov={55} rotation={[-0.2, 0, 0]} />
        <fog attach="fog" args={['#050508', 20, 150]} />
        
        <ambientLight intensity={0.2} />
        {/* Stadium floodlights */}
        <directionalLight position={[-40, 50, -20]} intensity={2} color="#ffffff" />
        <directionalLight position={[40, 50, -20]} intensity={2} color="#ffffff" />
        {/* Golden accent lighting */}
        <pointLight position={[0, 20, -40]} intensity={100} color="#d4af37" distance={150} />
        
        <RealisticStadium />
        <Environment preset="night" />
      </Canvas>
      {/* Gradient overlay to blend the 3D with the page background flawlessly */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/40 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050508] via-transparent to-[#050508]/50 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#050508] via-transparent to-[#050508] pointer-events-none" />
    </div>
  );
}
