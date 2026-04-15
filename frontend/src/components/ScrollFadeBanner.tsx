import { useEffect, useRef, useState } from 'react';

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
  const translateY = -progress * 48;
  const scale = Math.max(0.7, 1 - progress * 0.34);
  const overlayOpacity = 0.22 + progress * 0.34;

  return (
    <div
      className={`sticky top-0 z-0 w-full border-b border-[#cadbcf]/85 bg-[#ffffff]/75 shadow-[0_10px_24px_rgba(23,58,40,0.1)] backdrop-blur ${className}`}
      style={{
        opacity,
        height: `${maxHeightVh}vh`,
        overflow: 'hidden',
        willChange: 'transform, opacity'
      }}
    >
      <div className="mx-auto h-full max-w-7xl px-2 md:px-4">
        <div className="relative h-full overflow-hidden rounded-b-[26px] border border-[#cadbcf]/85">
          <img
            src={src}
            alt={alt}
            className={`h-full w-full object-cover ${maxHeightClassName}`}
            style={{
              transform: `translate3d(0, ${translateY}px, 0) scale(${scale})`,
              transformOrigin: 'top center',
              backfaceVisibility: 'hidden',
              transformStyle: 'preserve-3d',
              filter: `saturate(${1.01 + progress * 0.08}) brightness(${1 - progress * 0.04})`
            }}
          />

          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.05) 44%, rgba(35,84,59,0.2) 100%)',
              opacity: 0.18 + progress * 0.18
            }}
          />

          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                'repeating-linear-gradient(180deg, rgba(66,133,94,0.06) 0px, rgba(66,133,94,0.06) 1px, transparent 1px, transparent 7px)',
              opacity: 0.12 + progress * 0.09
            }}
          />
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 10%, rgba(185,146,61,0.2), transparent 40%)',
          opacity: 0.2 + progress * 0.06
        }}
      />

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(34,79,56,${overlayOpacity * 0.4}) 100%)`,
          opacity: overlayOpacity * 0.8,
          mixBlendMode: 'multiply'
        }}
      />

      <div
        className="pointer-events-none absolute bottom-0 left-1/2 h-[3px] w-[92%] -translate-x-1/2 rounded-full"
        style={{
          background: 'linear-gradient(90deg, rgba(63,134,87,0), rgba(63,134,87,0.85), rgba(185,146,61,0.85), rgba(63,134,87,0))',
          opacity: 0.38 + progress * 0.1
        }}
      />
    </div>
  );
}
