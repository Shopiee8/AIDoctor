'use client';

import { ThemeProvider } from './theme-provider';
import { useEffect } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  // This effect ensures fonts are loaded properly
  useEffect(() => {
    // Preload fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Architects+Daughter&family=Times+New+Roman:ital,wght@0,400;0,700;1,400&family=Courier+New:ital,wght@0,400;0,700;1,400&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
