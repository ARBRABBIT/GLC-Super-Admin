import { useState, useEffect } from 'react';

/**
 * Custom hook to dynamically calculate the scale factor required to fit a fixed coordinate layout
 * (e.g. 1440px) exactly to the screen width (full screen width), and scale the height responsively
 * while allowing vertical scrolling.
 * 
 * @param baseWidth The Figma target width design scale (default 1440px)
 * @returns The scaling factor to fit the width perfectly.
 */
export const useViewportScale = (baseWidth = 1440, _baseHeight?: number) => {
  const [scale, setScale] = useState<number>(1);

  useEffect(() => {
    const handleResize = () => {
      const newScale = window.innerWidth / baseWidth;
      setScale(newScale);
    };

    // Calculate initial scale
    handleResize();

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [baseWidth]);

  return scale;
};
