import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from './Layout';

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  depth?: number;
  glareIntensity?: number;
  backgroundColor?: string;
  borderColor?: string;
  glareColor?: string;
  disabled?: boolean;
}

const Card3D: React.FC<Card3DProps> = ({
  children,
  className = '',
  depth = 20,
  glareIntensity = 0.15,
  backgroundColor,
  borderColor,
  glareColor = 'rgba(255, 255, 255, 0.4)',
  disabled = false,
}) => {
  const { darkMode } = useTheme();
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  // Default colors based on theme
  const defaultBackgroundColor = darkMode 
    ? 'rgba(31, 41, 55, 0.8)' 
    : 'rgba(255, 255, 255, 0.8)';
  
  const defaultBorderColor = darkMode 
    ? 'rgba(55, 65, 81, 0.5)' 
    : 'rgba(229, 231, 235, 0.8)';

  // Handle mouse movement for 3D effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    
    // Calculate mouse position relative to card center
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    // Calculate rotation (inverted for natural feel)
    const rotateY = (mouseX / (rect.width / 2)) * -depth;
    const rotateX = (mouseY / (rect.height / 2)) * depth;
    
    // Calculate glare position
    const glareX = ((e.clientX - rect.left) / rect.width) * 100;
    const glareY = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Update state
    setRotation({ x: rotateX, y: rotateY });
    setPosition({ x: mouseX * 0.05, y: mouseY * 0.05 });
    setGlarePosition({ x: glareX, y: glareY });
  };

  // Reset card position when mouse leaves
  const handleMouseLeave = () => {
    if (disabled) return;
    
    setRotation({ x: 0, y: 0 });
    setPosition({ x: 0, y: 0 });
    setGlarePosition({ x: 50, y: 50 });
    setIsHovered(false);
  };

  // Set hovered state
  const handleMouseEnter = () => {
    if (disabled) return;
    setIsHovered(true);
  };

  // Add perspective to parent on mount
  useEffect(() => {
    if (cardRef.current && cardRef.current.parentElement) {
      cardRef.current.parentElement.style.perspective = '1000px';
    }
  }, []);

  return (
    <div
      ref={cardRef}
      className={`relative transition-transform duration-200 ${className}`}
      style={{
        transform: disabled 
          ? 'none' 
          : `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) translate3d(${position.x}px, ${position.y}px, 0)`,
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        backgroundColor: backgroundColor || defaultBackgroundColor,
        borderColor: borderColor || defaultBorderColor,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      {/* Card content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Glare effect */}
      {!disabled && isHovered && (
        <div 
          className="absolute inset-0 overflow-hidden rounded-inherit pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, ${glareColor} 0%, transparent 80%)`,
            opacity: glareIntensity,
            mixBlendMode: 'overlay',
            zIndex: 20,
          }}
        />
      )}
      
      {/* Shadow effect */}
      {!disabled && (
        <div 
          className="absolute -z-10 inset-0 rounded-inherit transition-all duration-200"
          style={{
            transform: `translateZ(-${depth}px)`,
            boxShadow: isHovered 
              ? `0 ${depth}px ${depth * 1.5}px rgba(0, 0, 0, ${darkMode ? 0.5 : 0.2})` 
              : `0 ${depth / 2}px ${depth}px rgba(0, 0, 0, ${darkMode ? 0.3 : 0.1})`,
          }}
        />
      )}
    </div>
  );
};

export default Card3D;
