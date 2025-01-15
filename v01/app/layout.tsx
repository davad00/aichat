'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/lib/context/AuthContext';
import { Toaster } from '@/components/ui/toast';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}