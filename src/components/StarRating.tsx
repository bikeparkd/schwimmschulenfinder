
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  count: number;
}

const StarRating = ({ rating, count }: StarRatingProps) => {
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="star-filled" size={16} fill="#ffb800" />);
    }

    // Half star if needed
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="star-half relative">
          <Star size={16} className="text-gray-300" />
        </div>
      );
    }

    // Empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="text-gray-300" size={16} />);
    }

    return stars;
  };

  return (
    <div className="flex items-center">
      <div className="flex mr-1">{renderStars()}</div>
      <span className="text-sm text-gray-600">
        {rating.toFixed(1)} ({count})
      </span>
    </div>
  );
};

export default StarRating;
