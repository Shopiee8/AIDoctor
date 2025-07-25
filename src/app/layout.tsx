import type { Metadata } from 'next';
import './globals.css';
import { Toaster as ShadToaster } from '@/components/ui/toaster';
import { Toaster as HotToaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/auth-context';

export const metadata: Metadata = {
  title: 'AIDoctor',
  description: 'An AI-powered doctor consultation platform inspired by Hippocratic AI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: "dark" }} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700&family=Lora&family=Roboto+Mono&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        <AuthProvider>
            {children}
            <ShadToaster />
            <HotToaster />
        </AuthProvider>
      </body>
    </html>
  );
}
