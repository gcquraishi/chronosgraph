'use client';

import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
      } else {
        // If empty, we might want to stay on search page or go home, but typically we just clear params
        // But if we are on home page, pushing to /search?q= is weird if empty.
        // Let's just handle non-empty for now or allow clearing.
        if (window.location.pathname === '/search' && searchTerm === '') {
             router.push('/search');
        }
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, router]);

  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for historical figures (e.g., Nero, Jesus, Vespasian)..."
        className="w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        autoFocus
      />
    </div>
  );
}
