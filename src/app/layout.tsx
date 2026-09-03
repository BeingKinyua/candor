import type { Metadata, Viewport } from 'next';
import '@/src/index.css';
import { AppProviders } from '@/src/components/providers/AppProviders';

export const metadata: Metadata = {
  title: 'Candor - Your Campaign PA',
  description: 'Secure, role-based campaign operations command centre and intelligence platform.',
  openGraph: {
    title: 'Candor - Your Campaign PA',
    description: 'Secure, role-based campaign operations command centre and intelligence platform.',
    type: 'website',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: '#032221',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-[#032221] text-[#F1F7F6] font-sans antialiased selection:bg-[#00DF81]/30 selection:text-[#00DF81]"
      >
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
