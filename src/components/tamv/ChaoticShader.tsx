/**
 * ChaoticShader - Visual Encryption Effect for Premium Content
 * Based on Anubis Sentinel chaotic encryption visualization
 */

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock } from 'lucide-react';

interface ChaoticShaderProps {
  locked: boolean;
  onUnlock?: () => void;
  children: React.ReactNode;
  intensity?: number; // 0-100
}

export function ChaoticShader({ 
  locked, 
  onUnlock, 
  children, 
  intensity = 80 
}: ChaoticShaderProps) {
  const [pixelSize, setPixelSize] = useState(intensity / 10);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!locked) {
      setPixelSize(0);
      return;
    }

    // Animate chaos level
    const interval = setInterval(() => {
      setPixelSize(prev => {
        const variation = (Math.random() - 0.5) * 2;
        return Math.max(4, Math.min(20, prev + variation));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [locked, intensity]);

  return (
    <div ref={containerRef} className="relative overflow-hidden rounded-2xl">
      {/* Content */}
      <div 
        className="transition-all duration-300"
        style={{
          filter: locked 
            ? `blur(${pixelSize}px) saturate(0.5) contrast(1.2)` 
            : 'none',
        }}
      >
        {children}
      </div>

      {/* Chaotic Overlay */}
      {locked && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20"
          style={{
            backgroundSize: `${pixelSize * 2}px ${pixelSize * 2}px`,
            mixBlendMode: 'overlay',
          }}
        />
      )}

      {/* Lock Indicator */}
      {locked && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div 
            onClick={onUnlock}
            className="glass-sovereign p-6 rounded-2xl cursor-pointer hover:scale-105 transition-transform"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <Lock className="w-8 h-8 text-primary animate-pulse" />
              </div>
              <span className="text-sm font-sovereign text-primary">CIFRADO CAÓTICO</span>
              <span className="text-xs text-muted-foreground">Contenido Premium MSR</span>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="px-4 py-2 rounded-full bg-secondary/20 text-secondary text-xs font-medium"
              >
                Desbloquear con MSR
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Unlock Animation */}
      {!locked && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute top-4 right-4"
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/20 text-secondary text-xs">
            <Unlock className="w-3 h-3" />
            <span>Desbloqueado</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
