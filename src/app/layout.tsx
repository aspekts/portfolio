import type { Metadata } from 'next';
import { Condiment } from 'next/font/google';
import './globals.css';

const condiment = Condiment({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-condiment',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://aspekts.dev'),
  title: 'Marcus Kamuntu - Full Stack Developer | Portfolio',
  description: "Marcus 'aspekts' Kamuntu is a full stack developer, CEO of Yarn Development, and Computer Science student specializing in AI and Data Science. Seeking software engineering placement opportunities.",
  keywords: ['Marcus Kamuntu', 'aspekts', 'full stack developer', 'software engineer', 'web developer', 'React', 'Node.js', 'TypeScript', 'Yarn Development', 'portfolio', 'University of Dundee', 'AI', 'Data Science'],
  authors: [{ name: 'Marcus Kamuntu', url: 'https://github.com/aspekts' }],
  creator: 'Marcus Kamuntu',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    url: 'https://aspekts.dev/',
    title: 'Marcus Kamuntu - Full Stack Developer | Portfolio',
    description: "Marcus 'aspekts' Kamuntu is a full stack developer, CEO of Yarn Development, and Computer Science student specializing in AI and Data Science.",
    siteName: 'Marcus Kamuntu Portfolio',
    locale: 'en_GB',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Marcus Kamuntu - Full Stack Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Marcus Kamuntu - Full Stack Developer | Portfolio',
    description: "Marcus 'aspekts' Kamuntu is a full stack developer, CEO of Yarn Development, and Computer Science student specializing in AI and Data Science.",
    creator: '@aspekts',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://aspekts.dev/',
  },
  icons: {
    icon: '/favicon.ico',
  },
  other: {
    'theme-color': '#1f2937',
  },
};

// JSON-LD Structured Data
const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Marcus Kamuntu',
  alternateName: 'aspekts',
  url: 'https://aspekts.dev',
  image: 'https://aspekts.dev/og-image.png',
  jobTitle: 'Full Stack Developer',
  description: 'Full Stack Developer and Computer Science student specializing in AI and Data Science at University of Dundee',
  email: 'mail@aspekts.dev',
  sameAs: [
    'https://github.com/aspekts',
    'https://linkedin.com/in/mkamuntu',
  ],
  worksFor: {
    '@type': 'Organization',
    name: 'Yarn Development',
    url: 'https://aspekts.dev',
  },
  alumniOf: {
    '@type': 'EducationalOrganization',
    name: 'University of Dundee',
  },
  knowsAbout: [
    'Full Stack Development',
    'React',
    'Node.js',
    'TypeScript',
    'Java',
    'Python',
    'AI',
    'Data Science',
    'System Architecture',
  ],
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Marcus Kamuntu Portfolio',
  alternateName: 'aspekts.dev',
  url: 'https://aspekts.dev',
  description: 'Portfolio website of Marcus Kamuntu, a full stack developer and Computer Science student',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={condiment.variable} style={{ colorScheme: 'dark' }}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="bg-gray-900 text-white">{children}</body>
    </html>
  );
}
