import { Suspense } from 'react';
import { getBaconNetworkData } from '@/lib/bacon-network-data';
import GraphExplorer from '@/components/GraphExplorer';
import PathQueryInterface from '@/components/PathQueryInterface';

export default async function Dashboard() {
  let baconNetworkData: any = { nodes: [], links: [] };

  try {
    baconNetworkData = getBaconNetworkData();
  } catch (error) {
    console.error('Failed to generate Bacon network data:', error);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Minimal Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 text-center">
            ChronosGraph
          </h1>
          <p className="text-center text-gray-600 mt-1">
            Explore historical connections through media portrayals
          </p>
        </div>
      </div>

      {/* Graph-First Hero */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Path Query Interface - Above Graph */}
          <div className="mb-6">
            <Suspense fallback={
              <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
                <div className="h-24 bg-gray-100 rounded"></div>
              </div>
            }>
              <PathQueryInterface />
            </Suspense>
          </div>

          {/* Interactive Graph - The Star */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <Suspense fallback={
              <div className="flex items-center justify-center" style={{ minHeight: '600px' }}>
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading graph...</p>
                </div>
              </div>
            }>
              <GraphExplorer
                nodes={baconNetworkData.nodes}
                links={baconNetworkData.links}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
