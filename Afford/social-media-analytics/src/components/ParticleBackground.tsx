import React, { useRef, useEffect } from 'react';
import { useTheme } from './Layout';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  alpha: number;
}

interface ParticleBackgroundProps {
  particleCount?: number;
  particleSize?: number;
  particleSpeed?: number;
  connectionDistance?: number;
  interactive?: boolean;
  className?: string;
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
  particleCount = 50,
  particleSize = 3,
  particleSpeed = 0.5,
  connectionDistance = 150,
  interactive = true,
  className = '',
}) => {
  const { darkMode } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, radius: 150 });
  const animationFrameRef = useRef<number>(0);

  // Initialize particles
  const initParticles = (canvas: HTMLCanvasElement) => {
    const particles: Particle[] = [];
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() || '#6366f1';
    const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-secondary').trim() || '#a855f7';
    
    for (let i = 0; i < particleCount; i++) {
      const size = Math.random() * particleSize + 1;
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const speedX = (Math.random() - 0.5) * particleSpeed;
      const speedY = (Math.random() - 0.5) * particleSpeed;
      
      // Alternate between primary and secondary colors
      const colorRatio = Math.random();
      const color = colorRatio > 0.7 
        ? primaryColor 
        : colorRatio > 0.4 
          ? secondaryColor 
          : darkMode ? '#4B5563' : '#E5E7EB';
      
      const alpha = Math.random() * 0.5 + 0.1;
      
      particles.push({ x, y, size, speedX, speedY, color, alpha });
    }
    
    particlesRef.current = particles;
  };

  // Draw particles and connections
  const drawParticles = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw particles
    particlesRef.current.forEach((particle, index) => {
      // Update position
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      // Bounce off edges
      if (particle.x < 0 || particle.x > canvas.width) {
        particle.speedX *= -1;
      }
      
      if (particle.y < 0 || particle.y > canvas.height) {
        particle.speedY *= -1;
      }
      
      // Mouse interaction
      if (interactive) {
        const dx = particle.x - mouseRef.current.x;
        const dy = particle.y - mouseRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouseRef.current.radius) {
          const force = (mouseRef.current.radius - distance) / mouseRef.current.radius;
          const directionX = dx / distance || 0;
          const directionY = dy / distance || 0;
          
          particle.x += directionX * force * 2;
          particle.y += directionY * force * 2;
        }
      }
      
      // Draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = `${particle.color}${Math.round(particle.alpha * 255).toString(16).padStart(2, '0')}`;
      ctx.fill();
      
      // Draw connections
      for (let j = index + 1; j < particlesRef.current.length; j++) {
        const otherParticle = particlesRef.current[j];
        const dx = particle.x - otherParticle.x;
        const dy = particle.y - otherParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < connectionDistance) {
          const opacity = 1 - (distance / connectionDistance);
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(otherParticle.x, otherParticle.y);
          ctx.strokeStyle = `${particle.color}${Math.round(opacity * 40).toString(16).padStart(2, '0')}`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    });
  };

  // Animation loop
  const animate = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      drawParticles(canvas, ctx);
    }
    
    animationFrameRef.current = requestAnimationFrame(animate);
  };

  // Handle mouse movement
  const handleMouseMove = (e: MouseEvent) => {
    if (!canvasRef.current || !interactive) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;
  };

  // Handle touch movement
  const handleTouchMove = (e: TouchEvent) => {
    if (!canvasRef.current || !interactive || !e.touches[0]) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    mouseRef.current.x = e.touches[0].clientX - rect.left;
    mouseRef.current.y = e.touches[0].clientY - rect.top;
    
    // Prevent scrolling when interacting with particles
    e.preventDefault();
  };

  // Handle resize
  const handleResize = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    initParticles(canvas);
  };

  // Setup and cleanup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Initialize particles
    initParticles(canvas);
    
    // Start animation
    animate();
    
    // Add event listeners
    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
    }
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('touchmove', handleTouchMove);
      }
      
      window.removeEventListener('resize', handleResize);
    };
  }, [darkMode, interactive, particleCount, particleSize, particleSpeed, connectionDistance]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default ParticleBackground;
