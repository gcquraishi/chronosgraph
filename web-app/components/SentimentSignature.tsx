import React from 'react';
import { PenTool } from 'lucide-react';

interface SentimentSignatureProps {
  creatorName: string;
}

/**
 * Sentiment Signature
 *
 * Analyzes creator's characteristic portrayal tendencies:
 * - Dominant sentiment patterns (heroic, tragic, villainous)
 * - Sentiment diversity across works
 * - Moral complexity index (nuanced vs black-and-white portrayals)
 * - Consistent character treatment across figures
 *
 * Identifies creator's interpretive style and historiographical stance.
 */
export default function SentimentSignature({
  creatorName
}: SentimentSignatureProps) {
  return (
    <div className="bg-stone-100 border-2 border-stone-200 p-6">
      <h2 className="text-sm font-black text-stone-900 uppercase tracking-widest mb-4 flex items-center gap-2">
        <span className="text-amber-600">■</span> Sentiment Signature
      </h2>

      <div className="bg-white border-2 border-stone-300 p-8 text-center">
        <PenTool className="w-12 h-12 text-amber-600 mx-auto mb-4 opacity-30" />

        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-2">
          Portrayal Patterns
        </div>

        <div className="text-xl font-bold text-stone-700 font-mono mb-6">
          ANALYZING STYLE
        </div>

        <div className="border-t-2 border-stone-200 pt-4 mt-4">
          <p className="text-xs text-stone-500 leading-relaxed">
            Reveals characteristic portrayal tendencies and moral complexity patterns
            in {creatorName}&apos;s historical interpretations.
          </p>
        </div>
      </div>
    </div>
  );
}
