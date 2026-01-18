import { Suspense } from 'react';
import CreatorContent from './CreatorContent';

export default function CreatorContributePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background text-foreground flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div></div>}>
      <CreatorContent />
    </Suspense>
  );
}
