
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Quote } from "lucide-react";

interface Review {
  author?: string;
  rating?: number;
  text?: string;
  time?: string;
}

interface ReviewCarouselProps {
  reviews: Review[];
}

const ReviewCarousel = ({ reviews }: ReviewCarouselProps) => {
  if (!reviews || reviews.length === 0) return null;

  // Filter out reviews without text
  const reviewsWithText = reviews.filter(review => review.text && review.text.trim() !== '');
  
  if (reviewsWithText.length === 0) return null;

  return (
    <div className="mb-4">
      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
        <Quote className="h-4 w-4" />
        Bewertungen:
      </h4>
      <Carousel className="w-full">
        <CarouselContent>
          {reviewsWithText.slice(0, 5).map((review, index) => (
            <CarouselItem key={index}>
              <div className="bg-gray-50 rounded-lg p-3 border">
                <div className="flex items-center justify-between mb-2">
                  {review.author && (
                    <span className="text-xs font-medium text-gray-700">
                      {review.author}
                    </span>
                  )}
                  {review.time && (
                    <span className="text-xs text-gray-500">{review.time}</span>
                  )}
                </div>
                <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                  "{review.text}"
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

export default ReviewCarousel;
