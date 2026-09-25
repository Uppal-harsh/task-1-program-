import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Scattered floating glowing particles / spheres
function ParticleField({ count = 20, isBeige = false }) {
  const meshRef = useRef();
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      // random scattered positions in 3D depth
      const x = (Math.random() - 0.5) * 14;
      const y = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 12 - 1; // scattered depth
      const scale = Math.random() * 0.08 + 0.04;
      const speed = Math.random() * 0.4 + 0.2;
      const phase = Math.random() * Math.PI * 2;
      const baseIntensity = Math.random() * 0.5 + 0.5;
      temp.push({ x, y, z, scale, speed, phase, baseIntensity, initialY: y });
    }
    return temp;
  }, [count]);

  const sphereGeo = useMemo(() => new THREE.SphereGeometry(1, 16, 16), []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.children.forEach((child, i) => {
        const p = particles[i];
        if (child) {
          child.position.y = p.initialY + Math.sin(t * p.speed + p.phase) * 0.4;
          child.position.x = p.x + Math.cos(t * p.speed * 0.5 + p.phase) * 0.2;
          // subtle pulse
          const pulse = 1 + Math.sin(t * 2 + p.phase) * 0.2;
          child.scale.setScalar(p.scale * pulse);
        }
      });
    }
  });

  const particleColor = isBeige ? '#f5efe6' : '#ffffff';
  const emissiveColor = isBeige ? '#d8c4b6' : '#e0e0e0';

  return (
    <group ref={meshRef}>
      {particles.map((p, idx) => (
        <mesh key={idx} position={[p.x, p.y, p.z]} geometry={sphereGeo}>
          <meshStandardMaterial
            color={particleColor}
            emissive={emissiveColor}
            emissiveIntensity={1.2}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

// Wireframe Icosahedron with inner glow core and mouse tilt damping
function WireframeIcosahedron({ mousePos, themeMode }) {
  const outerRef = useRef();
  const innerRef = useRef();
  const targetRotation = useRef({ x: 0, y: 0 });

  // Color pallete based on blacks/whites/beiges palette
  const colors = useMemo(() => {
    if (themeMode === 'warm-beige') {
      return {
        wireframe: '#e8dec8', // Warm creamy beige
        emissive: '#d4af37', // Subtle warm gold / champagne beige emissive
        inner: '#1a1815',
        rim: '#f3e8d2'
      };
    } else if (themeMode === 'platinum-white') {
      return {
        wireframe: '#ffffff', // Crisp stark white
        emissive: '#f0f4f8', // Platinum glow
        inner: '#111215',
        rim: '#ffffff'
      };
    } else {
      // Default: Techfest Obsidian & Warm Ivory
      return {
        wireframe: '#f4ede4', // Warm ivory white
        emissive: '#d6cbbe', // Warm beige glow
        inner: '#0d0d11',
        rim: '#eae3d2'
      };
    }
  }, [themeMode]);

  useFrame((_, delta) => {
    // 1. Slow continuous auto-rotation
    const autoSpeed = 0.4 * delta;
    
    // 2. Mouse tilt target calculation (up to ±15 degrees = ±0.2618 radians)
    const maxTilt = THREE.MathUtils.degToRad(15);
    const targetX = -mousePos.current.y * maxTilt;
    const targetY = mousePos.current.x * maxTilt;

    // Smooth damping (lerp) for cursor tilt
    const dampingFactor = THREE.MathUtils.clamp(delta * 4, 0.01, 1);
    targetRotation.current.x = THREE.MathUtils.lerp(targetRotation.current.x, targetX, dampingFactor);
    targetRotation.current.y = THREE.MathUtils.lerp(targetRotation.current.y, targetY, dampingFactor);

    if (outerRef.current) {
      // Apply base auto spin + lerped mouse tilt
      outerRef.current.rotation.x = targetRotation.current.x + Math.sin(Date.now() * 0.0005) * 0.1;
      outerRef.current.rotation.y += autoSpeed;
      outerRef.current.rotation.z = targetRotation.current.y * 0.5;
    }

    if (innerRef.current) {
      innerRef.current.rotation.y -= autoSpeed * 1.3;
      innerRef.current.rotation.x = -targetRotation.current.x * 0.8;
      innerRef.current.rotation.z = -targetRotation.current.y * 0.8;
    }
  });

  return (
    <group>
      {/* Primary Wireframe Icosahedron */}
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[2.2, 1]} />
        <meshStandardMaterial
          wireframe
          color={colors.wireframe}
          emissive={colors.emissive}
          emissiveIntensity={0.9}
          roughness={0.15}
          metalness={0.85}
          wireframeLinewidth={2}
        />
      </mesh>

      {/* Inner nested crystal structure for high-tech holographic depth */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[1.3, 0]} />
        <meshStandardMaterial
          wireframe
          color="#8c8275"
          emissive={colors.emissive}
          emissiveIntensity={0.4}
          roughness={0.3}
          metalness={0.9}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Central obsidian core point */}
      <mesh>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial
          color="#050505"
          emissive={colors.wireframe}
          emissiveIntensity={0.2}
          roughness={0.1}
          metalness={0.95}
        />
      </mesh>
    </group>
  );
}

// Scene lighting with soft rim light behind the object
function SceneLighting({ themeMode }) {
  const rimColor = themeMode === 'warm-beige' ? '#f5ebd7' : '#ffffff';
  
  return (
    <>
      {/* Ambient base lighting for clean monochrome visibility */}
      <ambientLight intensity={0.4} />

      {/* Key front-right light */}
      <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" />
      
      {/* Fill cool light */}
      <directionalLight position={[-5, -2, 3]} intensity={0.5} color="#d4d4d8" />

      {/* Soft Rim Light behind the object to create halo silhouette effect */}
      <pointLight position={[0, 0.5, -4]} intensity={4.5} distance={12} color={rimColor} />
      <pointLight position={[0, 2, -3]} intensity={2.5} distance={10} color="#f0ebe1" />
      <directionalLight position={[0, 0, -6]} intensity={2.0} color={rimColor} />
    </>
  );
}

export default function ThreeScene({ themeMode = 'techfest-default' }) {
  // Mouse position normalized [-1, 1]
  const mousePos = useRef({ x: 0, y: 0 });
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const handlePointerMove = (e) => {
    // Normalize coordinates from -1 to 1 based on window
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;
    mousePos.current.x = x;
    mousePos.current.y = y;
    setCoords({ x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100 });
  };

  useEffect(() => {
    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  return (
    <div className="canvas-container">
      <Canvas
        camera={{ position: [0, 0, 6.2], fov: 45 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.setClearColor('#0a0a0f');
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.1;
        }}
      >
        <SceneLighting themeMode={themeMode} />
        <WireframeIcosahedron mousePos={mousePos} themeMode={themeMode} />
        <ParticleField count={24} isBeige={themeMode === 'warm-beige'} />
      </Canvas>

      {/* HUD Telemetry overlay info */}
      <div className="hud-telemetry">
        <div className="telemetry-item">
          <span className="telemetry-label">CURSOR TILT</span>
          <span className="telemetry-val">X: {coords.x} | Y: {coords.y}</span>
        </div>
        <div className="telemetry-item">
          <span className="telemetry-label">ROTATION LIMIT</span>
          <span className="telemetry-val">±15.0° LERP DAMPED</span>
        </div>
        <div className="telemetry-item">
          <span className="telemetry-label">GEOMETRY</span>
          <span className="telemetry-val">ICOSAHEDRON (24 PARTICLES)</span>
        </div>
      </div>
    </div>
  );
}
