import { useState, useEffect } from 'react';
import { MOBILE_RESTRICTION_CONFIG } from '@/config/mobileRestriction.config';

/**
 * Custom hook to detect if the user is on a mobile device.
 *
 * Uses a combination of:
 * 1. User-Agent string detection for mobile devices
 * 2. Screen width detection below the configured breakpoint
 *
 * Returns true if either method detects a mobile device.
 *
 * @removable - This file can be deleted when mobile support is ready.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      // Check user agent for mobile devices
      const userAgentMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );

      // Check screen width
      const screenWidthMobile =
        window.innerWidth < MOBILE_RESTRICTION_CONFIG.MOBILE_BREAKPOINT;

      // Consider mobile if either check is true
      setIsMobile(userAgentMobile || screenWidthMobile);
    };

    // Initial check
    checkMobile();

    // Listen for resize events
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return isMobile;
}
