import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ClientWrapper from '@/components/ClientWrapper';
import { getSermons } from '@/lib/strapi';
import { buildSearchIndex } from '@/lib/searchIndex';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourusername.github.io';
const repoName = process.env.NEXT_PUBLIC_REPO_NAME || 'PrikkelendePreken';

export const metadata: Metadata = {
  metadataBase: new URL(`${siteUrl}/${repoName}`),
  title: {
    default: 'Prikkerende Preken - Preek Archief',
    template: '%s | Prikkerende Preken',
  },
  description: 'Luister naar en lees preken uit ons archief. Doorzoek preken op spreker, thema en bijbeltekst.',
  keywords: ['preken', 'sermons', 'bijbel', 'christelijk', 'archief', 'kerk'],
  authors: [{ name: 'Prikkerende Preken' }],
  openGraph: {
    type: 'website',
    locale: 'nl_NL',
    siteName: 'Prikkerende Preken',
    title: 'Prikkerende Preken - Preek Archief',
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
      <body className={`${inter.className} min-h-screen flex flex-col bg-warm-50`}>
        <ClientWrapper searchIndex={searchIndex}>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </ClientWrapper>
      </body>
    </html>
  );
}
