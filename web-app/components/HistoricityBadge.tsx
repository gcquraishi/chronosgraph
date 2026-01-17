import { HistoricalFigure } from "@/lib/types";

interface Props {
  status?: 'Historical' | 'Fictional' | 'Disputed';
  isFictional?: boolean; // Fallback
}

export default function HistoricityBadge({ status, isFictional }: Props) {
  // Normalize status
  const finalStatus = status || (isFictional ? 'Fictional' : 'Historical');

  const styles = {
    Historical: "bg-green-500/20 text-green-300 border-green-500/30",
    Fictional: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    Disputed: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  };

  return (
    <span className={`px-2 py-1 text-xs rounded-full border ${styles[finalStatus]}`}>
      {finalStatus}
    </span>
  );
}
