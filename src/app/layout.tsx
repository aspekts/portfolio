import type { Metadata, Viewport } from 'next';
import { Condiment, Dela_Gothic_One, Doto, Spline_Sans } from 'next/font/google';
import './globals.css';

const logo = Condiment({ subsets: ['latin'], weight: '400', variable: '--font-logo', display: 'swap' });
const display = Dela_Gothic_One({ subsets: ['latin'], weight: '400', variable: '--font-display', display: 'swap' });
const text = Spline_Sans({ subsets: ['latin'], variable: '--font-text', display: 'swap' });
const dots = Doto({ subsets: ['latin'], variable: '--font-dots', display: 'swap' });

const description = 'Marcus Kamuntu is a software engineer and founder of Sendix. He collects music and makes things. This is his radio station.';

export const metadata: Metadata = {
  metadataBase: new URL('https://aspekts.dev'),
  title: 'Marcus Kamuntu, software engineer and founder',
  description,
  authors: [{ name: 'Marcus Kamuntu', url: 'https://github.com/aspekts' }],
  creator: 'Marcus Kamuntu',
  alternates: { canonical: 'https://aspekts.dev/' },
  openGraph: { type: 'website', url: 'https://aspekts.dev/', title: 'Aspekts FM: Marcus Kamuntu', description, siteName: 'aspekts.dev', locale: 'en_GB' },
  twitter: { card: 'summary_large_image', title: 'Aspekts FM: Marcus Kamuntu', description, creator: '@xAspekts' },
  icons: { icon: '/favicon.ico' },
};

export const viewport: Viewport = { viewportFit: 'cover', themeColor: '#FFD400' };

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Marcus Kamuntu',
  alternateName: 'aspekts',
  url: 'https://aspekts.dev',
  jobTitle: 'Software Engineer and Founder',
  email: 'home@aspekts.dev',
  sameAs: ['https://github.com/aspekts', 'https://linkedin.com/in/mkamuntu', 'https://www.instagram.com/7xmarcus/'],
  alumniOf: { '@type': 'EducationalOrganization', name: 'University of Dundee' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${logo.variable} ${display.variable} ${text.variable} ${dots.variable}`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
