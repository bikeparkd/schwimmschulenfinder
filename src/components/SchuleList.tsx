
import { useRef, useCallback } from "react";
import { Schwimmschule } from "@/types";
import SchwimmschuleCard from "./SchwimmschuleCard";
import { List } from "lucide-react";

interface SchuleListProps {
  schulen: Schwimmschule[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

const SchuleList = ({ schulen, loading, hasMore, onLoadMore }: SchuleListProps) => {
  const observer = useRef<IntersectionObserver | null>(null);
  
  const lastSchuleElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        onLoadMore();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, onLoadMore]);

  if (schulen.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <List className="h-16 w-16 text-gray-300 mb-4" />
        <h3 className="text-gray-500 text-lg font-medium mb-2">Keine Schwimmkurse in der Nähe gefunden</h3>
        <p className="text-gray-400 text-sm">
          Erweitern Sie den Suchradius oder versuchen Sie andere Orte, um mehr Schwimmschulen zu finden.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {schulen.map((schule, index) => {
        if (schulen.length === index + 1) {
          return (
            <div ref={lastSchuleElementRef} key={schule.id || `school-${index}`}>
              <SchwimmschuleCard schwimmschule={schule} />
            </div>
          );
        } else {
          return (
            <div key={schule.id || `school-${index}`}>
              <SchwimmschuleCard schwimmschule={schule} />
            </div>
          );
        }
      })}
      
      {loading && hasMore && (
        <div className="flex justify-center my-6">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <p className="text-gray-600">Weitere Ergebnisse werden geladen...</p>
          </div>
        </div>
      )}
      
      {!hasMore && schulen.length > 0 && (
        <div className="text-center my-6 text-gray-500">
          Alle Ergebnisse angezeigt
        </div>
      )}
    </div>
  );
};

export default SchuleList;
