import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Dimensions
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Particles Geometry
    const particlesCount = 280;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 12; // Spread particles
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    // Determine color based on light/dark mode
    const isLightMode = document.body.classList.contains('light');
    const particleColor = isLightMode ? '#7f00ff' : '#00f2fe';

    // Particle texture creator helper (glowing circles)
    const createCircleTexture = (colorHex) => {
      const canvas = document.createElement('canvas');
      canvas.width = 16;
      canvas.height = 16;
      const ctx = canvas.getContext('2d');
      const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
      gradient.addColorStop(0, colorHex);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 16, 16);
      
      return new THREE.CanvasTexture(canvas);
    };

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.08,
      map: createCircleTexture(particleColor),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    // Mesh
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth) - 0.5;
      mouseY = (event.clientY / window.innerHeight) - 0.5;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    const clock = new THREE.Clock();

    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Gentle continuous rotation
      particlesMesh.rotation.y = elapsedTime * 0.04;
      particlesMesh.rotation.x = elapsedTime * 0.015;

      // Mouse follow effect
      targetX = mouseX * 0.6;
      targetY = mouseY * 0.6;
      
      // Interpolate for smooth drift
      particlesMesh.position.x += (targetX - particlesMesh.position.x) * 0.05;
      particlesMesh.position.y += (-targetY - particlesMesh.position.y) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // Theme observer to dynamically update colors
    const observer = new MutationObserver(() => {
      const updatedLightMode = document.body.classList.contains('light');
      const newColor = updatedLightMode ? '#7f00ff' : '#00f2fe';
      
      if (particlesMaterial.map) particlesMaterial.map.dispose();
      particlesMaterial.map = createCircleTexture(newColor);
      particlesMaterial.needsUpdate = true;
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      observer.disconnect();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden" 
      style={{ minHeight: '100%' }}
    />
  );
}
