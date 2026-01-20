'use client';

import dynamic from 'next/dynamic';
import { SearchProvider } from '@/components/SearchProvider';
import { SearchDocument } from '@/lib/search';

const SearchModal = dynamic(() => import('@/components/SearchModal'), {
  ssr: false,
});

interface ClientWrapperProps {
  children: React.ReactNode;
  searchIndex: SearchDocument[];
}

export default function ClientWrapper({ children, searchIndex }: ClientWrapperProps) {
  return (
    <SearchProvider searchIndex={searchIndex}>
      {children}
      <SearchModal />
    </SearchProvider>
  );
}
