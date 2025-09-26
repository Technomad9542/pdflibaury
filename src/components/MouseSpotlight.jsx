import { useEffect, useRef, useState } from 'react';

const MouseSpotlight = () => {
  const spotlightRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (spotlightRef.current) {
        const x = e.clientX;
        const y = e.clientY;
        
        // Adjust spotlight size based on screen size (previous size)
        const isMobile = window.innerWidth < 768;
        const spotlightSize = isMobile ? 400 : 600;
        
        // Create a violet gradient spotlight effect with increased center brightness
        spotlightRef.current.style.background = `radial-gradient(${spotlightSize}px circle at ${x}px ${y}px, 
          rgba(139, 92, 246, 0.22),  /* Increased from 0.18 to 0.22 */
          rgba(124, 58, 237, 0.15) 20%,  /* Increased from 0.12 to 0.15 */
          rgba(109, 40, 217, 0.08) 40%,   /* Increased from 0.06 to 0.08 */
          transparent 70%)`;
      }
      
      // Show spotlight after first movement
      if (!isVisible) {
        setIsVisible(true);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleTouchStart = (e) => {
      // For touch devices, create spotlight at touch point
      if (spotlightRef.current && e.touches.length > 0) {
        const touch = e.touches[0];
        const x = touch.clientX;
        const y = touch.clientY;
        
        spotlightRef.current.style.background = `radial-gradient(300px circle at ${x}px ${y}px, 
          rgba(139, 92, 246, 0.18),  /* Increased from 0.15 to 0.18 */
          rgba(124, 58, 237, 0.12) 30%,  /* Increased from 0.1 to 0.12 */
          transparent 60%)`;
        
        if (!isVisible) {
          setIsVisible(true);
        }
      }
    };

    const handleTouchMove = (e) => {
      if (spotlightRef.current && e.touches.length > 0) {
        const touch = e.touches[0];
        const x = touch.clientX;
        const y = touch.clientY;
        
        spotlightRef.current.style.background = `radial-gradient(300px circle at ${x}px ${y}px, 
          rgba(139, 92, 246, 0.18),  /* Increased from 0.15 to 0.18 */
          rgba(124, 58, 237, 0.12) 30%,  /* Increased from 0.1 to 0.12 */
          transparent 60%)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleMouseLeave);
    };
  }, [isVisible]);

  return (
    <div
      ref={spotlightRef}
      className={`fixed inset-0 pointer-events-none transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        background: 'radial-gradient(600px circle at 0px 0px, rgba(139, 92, 246, 0.22), rgba(124, 58, 237, 0.15) 20%, transparent 70%)',
        mixBlendMode: 'screen',
        zIndex: -1, // Behind content but above background
      }}
    />
  );
};

export default MouseSpotlight;