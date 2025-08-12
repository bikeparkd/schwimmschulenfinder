
import { Navigation } from "lucide-react";
import StarRating from "./StarRating";

interface SchoolRatingProps {
  rating: number;
  reviewCount: number;
  distance?: number;
}

const SchoolRating = ({ rating, reviewCount, distance }: SchoolRatingProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
      <StarRating rating={rating} count={reviewCount} />
      {distance && (
        <>
          <span className="hidden sm:block text-gray-400">•</span>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Navigation size={14} />
            <span>{distance.toFixed(1)} km entfernt</span>
          </div>
        </>
      )}
    </div>
  );
};

export default SchoolRating;
