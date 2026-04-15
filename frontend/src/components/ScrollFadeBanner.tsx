import React, { useEffect, useRef, useState } from 'react';

type ScrollFadeBannerProps = {
  src: string;
  alt: string;
  maxHeightClassName?: string;
  maxHeightVh?: number;
  fadeDistance?: number;
  className?: string;
};

export function ScrollFadeBanner({
  src,
  alt,
  maxHeightClassName = 'max-h-[60vh]',
  maxHeightVh = 60,
  fadeDistance = 420,
  className = ''
}: ScrollFadeBannerProps) {
  const [progress, setProgress] = useState(0);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const updateProgress = () => {
      if (rafId.current !== null) {
        window.cancelAnimationFrame(rafId.current);
      }

      rafId.current = window.requestAnimationFrame(() => {
        const nextProgress = Math.min(1, Math.max(0, window.scrollY / fadeDistance));
        setProgress(nextProgress);
      });
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);

    return () => {
      if (rafId.current !== null) {
        window.cancelAnimationFrame(rafId.current);
      }
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, [fadeDistance]);

  const opacity = 1 - progress;
  const translateY = -progress * 72;
  const scale = Math.max(0.03, 1 - progress * 0.85);
  const overlayOpacity = 0.12 + progress * 0.7;

  return (
    <div
      className={`sticky top-0 z-0 w-full bg-white border-b border-[#b8d7a8] shadow-[0_6px_24px_rgba(60,143,43,0.15)] ${className}`}
      style={{
        opacity,
        height: `${maxHeightVh}vh`,
        overflow: 'hidden',
        willChange: 'transform, opacity'
      }}
    >
      <div
        className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/5 to-white/25 pointer-events-none"
        style={{ opacity: 0.45 + progress * 0.25 }}
      />
      <div
        className="max-w-6xl mx-auto h-full"
        style={{
          transform: `translate3d(0, ${translateY}px, 0) scale(${scale})`,
          transformOrigin: 'top center',
          willChange: 'transform, opacity'
        }}
      >
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover ${maxHeightClassName}`}
          style={{
            transformOrigin: 'top center',
            backfaceVisibility: 'hidden',
            transform: 'translateZ(0)'
          }}
        />
      </div>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,${overlayOpacity * 0.45}) 100%)`,
          opacity: overlayOpacity,
          mixBlendMode: 'multiply'
        }}
      />
    </div>
  );
}
