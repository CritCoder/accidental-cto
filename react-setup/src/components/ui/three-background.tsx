"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function FloatingParticles({ count = 200, paused = false }: { count?: number; paused?: boolean }) {
  const meshRef = useRef<THREE.Points>(null);
  const lastUpdateRef = useRef(0);

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

      velocities[i * 3] = (Math.random() - 0.5) * 0.002;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.002;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
    }

    return { positions, velocities };
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current || paused) return;

    // Throttle updates to ~20fps instead of 60fps
    const now = state.clock.elapsedTime;
    if (now - lastUpdateRef.current < 0.05) {
      return;
    }
    lastUpdateRef.current = now;

    const positions = meshRef.current.geometry.attributes.position
      .array as Float32Array;

    for (let i = 0; i < count; i++) {
      positions[i * 3] += particles.velocities[i * 3];
      positions[i * 3 + 1] += particles.velocities[i * 3 + 1];
      positions[i * 3 + 2] += particles.velocities[i * 3 + 2];

      // Wrap around edges
      if (Math.abs(positions[i * 3]) > 5) particles.velocities[i * 3] *= -1;
      if (Math.abs(positions[i * 3 + 1]) > 5)
        particles.velocities[i * 3 + 1] *= -1;
      if (Math.abs(positions[i * 3 + 2]) > 5)
        particles.velocities[i * 3 + 2] *= -1;
    }

    meshRef.current.geometry.attributes.position.needsUpdate = true;

    // Gentle rotation
    meshRef.current.rotation.y = now * 0.02;
    meshRef.current.rotation.x = Math.sin(now * 0.01) * 0.1;
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.BufferAttribute(particles.positions, 3)
    );
    return geo;
  }, [particles.positions]);

  return (
    <points ref={meshRef} geometry={geometry}>
      <pointsMaterial
        size={0.05}
        color="#d4a853"
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function GentleLines({ count = 15, paused = false }: { count?: number; paused?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const lastUpdateRef = useRef(0);

  const lineObjects = useMemo(() => {
    return Array.from({ length: count }, () => {
      const points: THREE.Vector3[] = [];
      const segments = 50;
      const radius = 2 + Math.random() * 3;
      const offset = Math.random() * Math.PI * 2;

      for (let j = 0; j <= segments; j++) {
        const t = j / segments;
        const angle = t * Math.PI * 2 + offset;
        points.push(
          new THREE.Vector3(
            Math.cos(angle) * radius + (Math.random() - 0.5) * 0.5,
            (Math.random() - 0.5) * 4,
            Math.sin(angle) * radius + (Math.random() - 0.5) * 0.5
          )
        );
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: "#d4a853",
        transparent: true,
        opacity: 0.3,
      });
      return new THREE.Line(geometry, material);
    });
  }, [count]);

  useFrame((state) => {
    if (!groupRef.current || paused) return;

    // Throttle to ~20fps
    const now = state.clock.elapsedTime;
    if (now - lastUpdateRef.current < 0.05) return;
    lastUpdateRef.current = now;

    groupRef.current.rotation.y = now * 0.015;
  });

  return (
    <group ref={groupRef}>
      {lineObjects.map((lineObj, i) => (
        <primitive key={i} object={lineObj} />
      ))}
    </group>
  );
}

export function ThreeBackground() {
  const [mounted, setMounted] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check WebGL support
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      setHasWebGL(!!gl);
    } catch {
      setHasWebGL(false);
    }

    // Pause when tab is hidden to save resources
    const handleVisibility = () => {
      setPaused(document.hidden);
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  if (!mounted || !hasWebGL) {
    return null;
  }

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
        style={{ background: "transparent" }}
        dpr={[1, 1.5]}
        frameloop={paused ? "never" : "always"}
      >
        <ambientLight intensity={0.5} />
        <FloatingParticles count={100} paused={paused} />
        <GentleLines count={8} paused={paused} />
      </Canvas>
    </div>
  );
}

export default ThreeBackground;
