/**
 * Optimized Image Component
 * Lazy loads images and shows placeholder while loading
 */

import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  width?: number | string;
  height?: number | string;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className,
  style,
  width,
  height,
  placeholder,
  onLoad,
  onError,
}) => {
  const { colors } = useTheme();
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Use Intersection Observer for lazy loading
    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && imgRef.current) {
            // Start loading when image enters viewport
            if (imgRef.current.dataset.src) {
              imgRef.current.src = imgRef.current.dataset.src;
              imgRef.current.removeAttribute('data-src');
            }
            observer.disconnect();
          }
        });
      },
      { rootMargin: '50px' }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: width || '100%',
    height: height || 'auto',
    backgroundColor: colors.surface || colors.background,
    display: 'inline-block',
    ...style,
  };

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    opacity: isLoaded ? 1 : 0,
    transition: 'opacity 0.3s ease-in-out',
  };

  const placeholderStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: colors.surface || colors.background,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: isLoaded ? 0 : 1,
    transition: 'opacity 0.3s ease-in-out',
  };

  if (hasError) {
    return (
      <div style={containerStyle} className={className}>
        <div
          style={{
            ...placeholderStyle,
            opacity: 1,
            color: colors.textSecondary,
            fontSize: '0.875rem',
          }}
        >
          {alt || 'Bilde'}
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle} className={className}>
      {!isLoaded && (
        <div style={placeholderStyle}>
          {placeholder ? (
            <img
              src={placeholder}
              alt=""
              style={{ width: '50%', height: '50%', opacity: 0.3 }}
            />
          ) : (
            <span style={{ color: colors.textSecondary, fontSize: '0.875rem' }}>
              Laster...
            </span>
          )}
        </div>
      )}
      <img
        ref={imgRef}
        data-src={src}
        alt={alt}
        style={imageStyle}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
};

