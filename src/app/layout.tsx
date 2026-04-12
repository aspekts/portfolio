import type { Metadata } from 'next';
import { Bricolage_Grotesque, Onest, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  axes: ['wdth'],
});

const onest = Onest({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://aspekts.dev'),
  title: 'Marcus Kamuntu — Full Stack Developer & Founder',
  description: "Marcus 'aspekts' Kamuntu — founder of Sendix AI Ltd. and Yarn Development, ML engineer, and Computer Science student at Dundee specialising in AI and Data Science. Seeking software engineering placement 2026–27.",
  keywords: ['Marcus Kamuntu', 'aspekts', 'full stack developer', 'software engineer', 'React', 'TypeScript', 'Yarn Development', 'Sendix', 'GovTech', 'University of Dundee', 'AI', 'Data Science'],
  authors: [{ name: 'Marcus Kamuntu', url: 'https://github.com/aspekts' }],
  creator: 'Marcus Kamuntu',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    url: 'https://aspekts.dev/',
    title: 'Marcus Kamuntu — Full Stack Developer & Founder',
    description: "Founder of Sendix AI Ltd. and Yarn Development. ML engineer and Computer Science student at Dundee.",
    siteName: 'Marcus Kamuntu Portfolio',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Marcus Kamuntu' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Marcus Kamuntu — Full Stack Developer & Founder',
    description: "Founder of Sendix AI Ltd. and Yarn Development. ML engineer and Computer Science student at Dundee.",
    creator: '@aspekts',
    images: ['/og-image.png'],
  },
  alternates: { canonical: 'https://aspekts.dev/' },
  icons: { icon: '/favicon.ico' },
  other: { 'theme-color': '#0D0D0F' },
};

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Marcus Kamuntu',
  alternateName: 'aspekts',
  url: 'https://aspekts.dev',
  image: 'https://aspekts.dev/og-image.png',
  jobTitle: 'Full Stack Developer & Founder',
  description: 'Founder of Sendix AI Ltd. and Yarn Development. Full Stack Developer and Computer Science student at University of Dundee.',
  email: 'mail@aspekts.dev',
  sameAs: ['https://github.com/aspekts', 'https://linkedin.com/in/mkamuntu'],
  worksFor: { '@type': 'Organization', name: 'Sendix AI Ltd.' },
  alumniOf: { '@type': 'EducationalOrganization', name: 'University of Dundee' },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Marcus Kamuntu',
  alternateName: 'aspekts.dev',
  url: 'https://aspekts.dev',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${bricolageGrotesque.variable} ${onest.variable} ${jetbrainsMono.variable}`}
      style={{ colorScheme: 'dark' }}
    >
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      </head>
      <body className="bg-void text-white font-sans">{children}</body>
    </html>
  );
}
