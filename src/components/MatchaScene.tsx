import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text3D, MeshTransmissionMaterial, useMatcapTexture, Center } from '@react-three/drei';
import * as THREE from 'three';

function MatchaParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 100;

  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 10;
    positions[i + 1] = (Math.random() - 0.5) * 10;
    positions[i + 2] = (Math.random() - 0.5) * 5;
  }

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#7cb342" transparent opacity={0.6} />
    </points>
  );
}

function RotatingCup() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <cylinderGeometry args={[0.8, 0.6, 1.2, 32]} />
        <meshStandardMaterial color="#7cb342" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.65, 0]}>
        <torusGeometry args={[0.85, 0.05, 16, 32]} />
        <meshStandardMaterial color="#7cb342" metalness={0.8} roughness={0.2} />
      </mesh>
    </Float>
  );
}

function FloatingLeaf({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.15, 32, 32]} />
      <meshStandardMaterial color="#558b2f" metalness={0.5} roughness={0.3} />
    </mesh>
  );
}

export default function MatchaScene() {
  return (
    <>
      <color attach="background" args={['#f5f5f5']} />
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      <RotatingCup />
      <MatchaParticles />

      <FloatingLeaf position={[-2, 1, 0]} />
      <FloatingLeaf position={[2, -1, 0]} />
      <FloatingLeaf position={[-1.5, -1.5, 0]} />
      <FloatingLeaf position={[1.8, 1.2, 0]} />
    </>
  );
}
