import type { Metadata } from 'next';
import './variables.css';
import './globals.css';
import './globals-reset.css';
import './utilities.css';
import { Toaster as ShadToaster } from '@/components/ui/toaster';
import { Toaster as HotToaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/auth-context';
import { Providers } from '@/components/providers';

export const metadata: Metadata = {
  title: 'Not Too Late AI',
  description: 'Your AI-powered healthcare companion for timely medical assistance and support.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>
          <AuthProvider>
            {children}
            <ShadToaster />
            <HotToaster position="bottom-right" />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
