import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import { ReduxProvider } from '@/providers/ReduxProvider';
import { ThemeProvider } from '@/components/ThemeProvider';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: 'ThankU Admin — Enterprise Dashboard',
  description: 'Administrative dashboard for managing the ThankU community sharing platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={outfit.variable} suppressHydrationWarning>
      <body className="antialiased bg-background text-body font-body">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ReduxProvider>{children}</ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
