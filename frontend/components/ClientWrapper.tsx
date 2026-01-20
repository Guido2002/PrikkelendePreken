'use client';

import { SearchProvider } from '@/components/SearchProvider';
import SearchModal from '@/components/SearchModal';
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';
import { SearchDocument } from '@/lib/search';

interface ClientWrapperProps {
  children: React.ReactNode;
  searchIndex: SearchDocument[];
}

export default function ClientWrapper({ children, searchIndex }: ClientWrapperProps) {
  return (
    <SearchProvider searchIndex={searchIndex}>
      {children}
      <SearchModal />
      <ServiceWorkerRegister />
    </SearchProvider>
  );
}
