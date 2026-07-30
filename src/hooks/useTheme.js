import { useState, useEffect } from 'react';

export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('trip-ready-theme');
      if (stored) return stored === 'dark';
      return true; // Default dark mode
    }
    return true;
  });

  useEffect(() => {
    const root = document.documentElement;
    const currentlyDark = root.classList.contains('dark');
    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    localStorage.setItem('trip-ready-theme', isDark ? 'dark' : 'light');
    
    // Only dispatch if there is a real change in classList to avoid loops
    if (currentlyDark !== isDark) {
      window.dispatchEvent(new CustomEvent('theme-toggle', { detail: { isDark } }));
    }
  }, [isDark]);

  useEffect(() => {
    const handleThemeToggle = (e) => {
      setIsDark(e.detail.isDark);
    };
    window.addEventListener('theme-toggle', handleThemeToggle);
    return () => window.removeEventListener('theme-toggle', handleThemeToggle);
  }, []);

  const toggleTheme = () => setIsDark(prev => !prev);

  return { isDark, toggleTheme };
}
