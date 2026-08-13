'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function Topology3DPage() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [clusterState, setClusterState] = useState<'normal' | 'chaos' | 'optimized'>('normal');
  const [nodeStatusText, setNodeStatusText] = useState('All render blades nominal. 3D rack telemetry active.');

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#080a0f');
    scene.fog = new THREE.FogExp2('#080a0f', 0.035);

    const camera = new THREE.PerspectiveCamera(60, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.set(0, 5, 12);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x38bdf8, 2);
    dirLight.position.set(10, 20, 15);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0xf59e0b, 3, 20);
    pointLight.position.set(0, 5, 0);
    scene.add(pointLight);

    const rackGroup = new THREE.Group();
    scene.add(rackGroup);

    const blades: { mesh: THREE.Mesh; id: number; baseColor: THREE.Color }[] = [];
    const rows = 2;
    const cols = 4;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = (c - cols / 2 + 0.5) * 2.8;
        const z = (r - rows / 2 + 0.5) * 2.5;

        const frameGeo = new THREE.BoxGeometry(2.4, 3.8, 1.8);
        const frameMat = new THREE.MeshStandardMaterial({ color: 0x121620, roughness: 0.7, metalness: 0.5 });
        const rack = new THREE.Mesh(frameGeo, frameMat);
        rack.position.set(x, 0, z);
        rackGroup.add(rack);

        for (let b = 0; b < 3; b++) {
          const bladeGeo = new THREE.BoxGeometry(2.1, 0.9, 1.6);
          const bladeMat = new THREE.MeshStandardMaterial({ 
            color: 0x1e293b, 
            roughness: 0.3, 
            metalness: 0.8,
            emissive: 0x0ea5e9,
            emissiveIntensity: 0.2
          });
          const blade = new THREE.Mesh(bladeGeo, bladeMat);
          blade.position.set(x, (b - 1) * 1.1, z);
          
          const bladeId = r * cols + c + 1;
          blades.push({ mesh: blade, id: bladeId, baseColor: new THREE.Color(0x0ea5e9) });
          rackGroup.add(blade);
        }
      }
    }

    const gridHelper = new THREE.GridHelper(30, 30, 0xf59e0b, 0x1e293b);
    gridHelper.position.y = -2.5;
    scene.add(gridHelper);

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      rackGroup.rotation.y = elapsedTime * 0.08;

      blades.forEach((item, index) => {
        const mat = item.mesh.material as THREE.MeshStandardMaterial;
        if (clusterState === 'chaos') {
          if (item.id === 4) {
            const pulse = Math.sin(elapsedTime * 10) * 0.5 + 0.5;
            mat.emissive.setHex(0xef4444);
            mat.emissiveIntensity = 0.8 + pulse * 1.2;
          } else {
            mat.emissive.setHex(0xf97316);
            mat.emissiveIntensity = 0.4;
          }
        } else if (clusterState === 'optimized') {
          const pulse = Math.sin(elapsedTime * 6 + index) * 0.5 + 0.5;
          mat.emissive.setHex(0x10b981);
          mat.emissiveIntensity = 0.3 + pulse * 0.7;
        } else {
          mat.emissive.setHex(0x0ea5e9);
          mat.emissiveIntensity = 0.2 + Math.sin(elapsedTime * 2 + index) * 0.1;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!currentMount) return;
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (currentMount) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [clusterState]);

  return (
    <div className="space-y-6 text-gray-200 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-800 pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-amber-500 flex items-center gap-2">
            <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            3D Spatial Cluster Topology Visualizer
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Interactive WebGL 3D datacenter rendering cluster blades with real-time Gemini telemetry feedback.
          </p>
        </div>
        
        {/* State Control Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => { setClusterState('normal'); setNodeStatusText('All render blades nominal. Telemetry stable.'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${clusterState === 'normal' ? 'bg-sky-500 text-gray-950 font-semibold' : 'bg-[#121620] text-gray-300 border border-gray-800'}`}
          >
            Normal State
          </button>
          <button
            onClick={() => { setClusterState('chaos'); setNodeStatusText('CRITICAL: Node-04 VRAM spiked to 98.4% (Thermal limit exceeded).'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${clusterState === 'chaos' ? 'bg-red-600 text-white font-semibold animate-pulse' : 'bg-[#121620] text-red-400 border border-red-900/50'}`}
          >
            Trigger Thermal Spike
          </button>
          <button
            onClick={() => { setClusterState('optimized'); setNodeStatusText('Gemini agent executed CineOps-MemAgent::PurgeStaleCaches(). Cluster rebalanced.'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${clusterState === 'optimized' ? 'bg-emerald-500 text-gray-950 font-semibold' : 'bg-[#121620] text-emerald-400 border border-emerald-900/50'}`}
          >
            Gemini Rebalance
          </button>
        </div>
      </div>

      {/* 3D Viewport Canvas */}
      <div className="relative w-full h-[520px] bg-[#080a0f] rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
        
        {/* Floating Telemetry HUD Overlay */}
        <div className="absolute bottom-4 left-4 bg-[#121620]/80 backdrop-blur-md border border-gray-800 p-4 rounded-xl max-w-sm space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-400">
            <span>Rack Array Status</span>
            <span className={clusterState === 'chaos' ? 'text-red-400 animate-ping' : clusterState === 'optimized' ? 'text-emerald-400' : 'text-sky-400'}>
              {clusterState.toUpperCase()}
            </span>
          </div>
          <p className="text-xs font-mono text-gray-200 leading-relaxed">
            {nodeStatusText}
          </p>
        </div>

        <div className="absolute top-4 right-4 bg-[#121620]/80 backdrop-blur-md border border-gray-800 px-3 py-1.5 rounded-lg text-xs text-amber-400 font-mono flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          WebGL / Three.js Active
        </div>
      </div>

    </div>
  );
}
