'use client';

import { useState } from 'react';

export default function PathQueryInterface() {
  const [fromPerson, setFromPerson] = useState('Kevin Bacon');
  const [viaPerson, setViaPerson] = useState('Francis Bacon (painter)');
  const [toPerson, setToPerson] = useState('Francis Bacon (statesman)');
  const [isQuerying, setIsQuerying] = useState(false);

  const handleQuery = async () => {
    setIsQuerying(true);

    // TODO: Implement actual path query logic
    // This will query Neo4j for paths: FROM (X) -> VIA (Y) -> TO (Z)
    console.log('Querying path:', { fromPerson, viaPerson, toPerson });

    // Simulate API call
    setTimeout(() => {
      setIsQuerying(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isQuerying) {
      handleQuery();
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6">
        {/* Query Description */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Find Historical Paths
          </h2>
          <p className="text-sm text-gray-500">
            Get me from X to Z by way of Y
          </p>
        </div>

        {/* Three-Field Query Interface */}
        <div className="flex flex-col md:flex-row gap-4 items-end">
          {/* From Field */}
          <div className="flex-1">
            <label
              htmlFor="from-person"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              From
            </label>
            <input
              id="from-person"
              type="text"
              value={fromPerson}
              onChange={(e) => setFromPerson(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter starting person..."
              disabled={isQuerying}
            />
          </div>

          {/* Via Field */}
          <div className="flex-1">
            <label
              htmlFor="via-person"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Via
            </label>
            <input
              id="via-person"
              type="text"
              value={viaPerson}
              onChange={(e) => setViaPerson(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter intermediate person..."
              disabled={isQuerying}
            />
          </div>

          {/* To Field */}
          <div className="flex-1">
            <label
              htmlFor="to-person"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              To
            </label>
            <input
              id="to-person"
              type="text"
              value={toPerson}
              onChange={(e) => setToPerson(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter destination person..."
              disabled={isQuerying}
            />
          </div>

          {/* Query Button */}
          <button
            onClick={handleQuery}
            disabled={isQuerying || !fromPerson || !viaPerson || !toPerson}
            className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isQuerying ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Finding...
              </span>
            ) : (
              'Find Path'
            )}
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-4 text-xs text-gray-500 text-center">
          Press Enter to search or click Find Path
        </div>
      </div>
    </div>
  );
}
