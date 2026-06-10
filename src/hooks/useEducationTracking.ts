'use client';

import { useEffect } from 'react';
import { updateLastAccessDate } from '@/lib/educationProgress';

/**
 * Hook to track education mode activity
 * Call this in components when user is in learning mode to update their progress
 */
export function useEducationTracking(isActive: boolean = true) {
  useEffect(() => {
    if (!isActive) return;
    
    // Update last access date when component mounts
    updateLastAccessDate();
    
    // Optional: Track time spent (hourly update)
    const timer = setInterval(() => {
      updateLastAccessDate();
    }, 3600000); // Every hour
    
    return () => clearInterval(timer);
  }, [isActive]);
}
