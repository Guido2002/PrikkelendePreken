import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ClientWrapper from '@/components/ClientWrapper';
import { getSermons } from '@/lib/strapi';
import { buildSearchIndex } from '@/lib/searchIndex';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourusername.github.io';
const repoName = process.env.NEXT_PUBLIC_REPO_NAME || 'PrikkelendePreken';

export const metadata: Metadata = {
  metadataBase: new URL(`${siteUrl}/${repoName}`),
  title: {
    default: 'Prikkelende Preken - Preek Archief',
    template: '%s | Prikkelende Preken',
  },
  description: 'Luister naar en lees preken uit ons archief. Doorzoek preken op spreker, thema en bijbeltekst.',
  keywords: ['preken', 'sermons', 'bijbel', 'christelijk', 'archief', 'kerk'],
  authors: [{ name: 'Prikkelende Preken' }],
  openGraph: {
    type: 'website',
    locale: 'nl_NL',
    siteName: 'Prikkelende Preken',
    title: 'Prikkelende Preken - Preek Archief',
    description: 'Luister naar en lees preken uit ons archief.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

async function getSearchIndex() {
  try {
    // Fetch all sermons for search index
    const response = await getSermons({ page: 1, pageSize: 1000 });
    return buildSearchIndex(response.data);
  } catch (error) {
    console.error('Error building search index:', error);
    return [];
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchIndex = await getSearchIndex();

  return (
    <html lang="nl">
      <head>
        {/* Google Fonts for 70s typography */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Courier+Prime:ital,wght@0,400;0,700;1,400&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <ClientWrapper searchIndex={searchIndex}>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </ClientWrapper>
      </body>
    </html>
  );
}
