
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { MessageCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface DetailedReview {
  review_text?: string;
  review_rating?: string;
  review_datetime_utc?: string;
  review_likes?: number;
  reviewer_name?: string;
  reviewer_url?: string;
  reviewer_profile_photo_url?: string;
  review_translated?: boolean;
  extracted_snippet?: string;
}

interface DetailedReviewCarouselProps {
  reviews: DetailedReview[];
}

const DetailedReviewCarousel = ({ reviews }: DetailedReviewCarouselProps) => {
  const { t } = useLanguage();

  if (!reviews || reviews.length === 0) return null;

  // Filter out reviews without text
  const reviewsWithText = reviews.filter(review => 
    review.review_text && review.review_text.trim() !== '' ||
    review.extracted_snippet && review.extracted_snippet.trim() !== ''
  );
  
  if (reviewsWithText.length === 0) return null;

  return (
    <div className="mb-4">
      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
        <MessageCircle className="h-4 w-4" />
        {t('reviews')}:
      </h4>
      <Carousel className="w-full">
        <CarouselContent>
          {reviewsWithText.slice(0, 5).map((review, index) => (
            <CarouselItem key={index}>
              <div className="bg-gray-50 rounded-lg p-3 border">
                <div className="flex items-center justify-between mb-2">
                  {review.reviewer_name && (
                    <span className="text-xs font-medium text-gray-700">
                      {review.reviewer_name}
                    </span>
                  )}
                  {review.review_datetime_utc && (
                    <span className="text-xs text-gray-500">
                      {new Date(review.review_datetime_utc).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                  "{review.review_text || review.extracted_snippet}"
                </p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {reviewsWithText.length > 1 && (
          <>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </>
        )}
      </Carousel>
    </div>
  );
};

export default DetailedReviewCarousel;
