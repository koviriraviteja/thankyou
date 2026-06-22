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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'ThankU — Give Freely. Help Genuinely.',
  description: 'A community where giving creates happiness and gratitude grows. Donate items, help your neighbors, and make a difference.',
  keywords: ['donate', 'free items', 'community', 'giving', 'ThankU', 'charity', 'neighbors'],
  openGraph: {
    title: 'ThankU — Give Freely. Help Genuinely.',
    description: 'A community where giving creates happiness and gratitude grows.',
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
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
