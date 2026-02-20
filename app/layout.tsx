import type { Metadata } from 'next';
import '../src/index.css';

export const metadata: Metadata = {
  title: 'Marcus Kamuntu - Full Stack Developer | Portfolio',
  description: "Marcus 'aspekts' Kamuntu is a full stack developer, CEO of Yarn Development, and Computer Science student specializing in AI and Data Science. Seeking software engineering placement opportunities.",
  keywords: ['Marcus Kamuntu', 'aspekts', 'full stack developer', 'software engineer', 'web developer', 'React', 'Node.js', 'TypeScript', 'Yarn Development', 'portfolio', 'University of Dundee', 'AI', 'Data Science'],
  authors: [{ name: 'Marcus Kamuntu' }],
  creator: 'Marcus Kamuntu',
  publisher: 'Marcus Kamuntu',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    url: 'https://aspekts.dev/',
    title: 'Marcus Kamuntu - Full Stack Developer | Portfolio',
    description: "Marcus 'aspekts' Kamuntu is a full stack developer, CEO of Yarn Development, and Computer Science student specializing in AI and Data Science.",
    images: [
      {
        url: 'https://aspekts.dev/og-image.png',
        alt: 'Marcus Kamuntu Portfolio',
      },
    ],
    siteName: 'Marcus Kamuntu Portfolio',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@aspekts',
    creator: '@aspekts',
    title: 'Marcus Kamuntu - Full Stack Developer | Portfolio',
    description: "Marcus 'aspekts' Kamuntu is a full stack developer, CEO of Yarn Development, and Computer Science student specializing in AI and Data Science.",
    images: ['https://aspekts.dev/og-image.png'],
  },
  alternates: {
    canonical: 'https://aspekts.dev/',
  },
  other: {
    'theme-color': '#1f2937',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" style={{ colorScheme: 'dark' }}>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
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
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Marcus Kamuntu Portfolio',
              alternateName: 'aspekts.dev',
              url: 'https://aspekts.dev',
              description: 'Portfolio website of Marcus Kamuntu, a full stack developer and Computer Science student',
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
