import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});
import StoreProvider from '@/store/StoreProvider';
import { ThemeProvider } from '@/components/ThemeProvider';
import WelcomeMessage from '@/components/WelcomeMessage';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'ThankU — Social Service Employment Platform',
  description: 'A social service employment platform where giving creates jobs and builds communities. Donate items, support employment, and make a difference.',
  keywords: ['donate', 'free items', 'community', 'giving', 'ThankU', 'social service', 'employment', 'charity'],
  openGraph: {
    title: 'ThankU — Social Service Employment Platform',
    description: 'A social service employment platform where giving creates jobs and builds communities.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={outfit.variable} suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
          <StoreProvider>
            {children}
            <WelcomeMessage />
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
