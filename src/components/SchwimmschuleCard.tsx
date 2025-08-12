
import { Schwimmschule } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SchoolRating from "./SchoolRating";
import SchoolHours from "./SchoolHours";
import SchoolFeatures from "./SchoolFeatures";
import SchoolActions from "./SchoolActions";
import DetailedReviewCarousel from "./DetailedReviewCarousel";

interface SchwimmschuleCardProps {
  schwimmschule: Schwimmschule;
}

const SchwimmschuleCard = ({ schwimmschule }: SchwimmschuleCardProps) => {
  const navigate = useNavigate();
  
  // Fallback image URL
  const fallbackImage = "/lovable-uploads/8548741e-86c1-492f-a522-2eb9ee6ca9d3.png";
  
  // Parse rating
  const rating = schwimmschule.rating ? parseFloat(schwimmschule.rating.replace(',', '.')) : 0;
  const reviewCount = schwimmschule.reviews ? parseInt(schwimmschule.reviews, 10) : 0;
  
  // Parse about data
  const parseAbout = (about: any) => {
    if (typeof about === 'string') {
      try {
        return JSON.parse(about);
      } catch {
        return null;
      }
    }
    return about;
  };
  
  const aboutData = parseAbout(schwimmschule.about);
  const features = aboutData?.features || [];

  // Parse detailed reviews
  const parseDetailedReviews = (reviews: any) => {
    if (typeof reviews === 'string') {
      try {
        return JSON.parse(reviews);
      } catch {
        return [];
      }
    }
    return Array.isArray(reviews) ? reviews : [];
  };

  const detailedReviews = parseDetailedReviews(schwimmschule.detailed_reviews);

  const handleDetailsClick = () => {
    if (schwimmschule.id) {
      navigate(`/schwimmschule/${schwimmschule.id}`);
    }
  };

  const handlePhoneClick = () => {
    if (schwimmschule.phone) {
      window.location.href = `tel:${schwimmschule.phone}`;
    }
  };

  return (
    <Card className="w-full hover:shadow-lg transition-shadow h-[480px] flex flex-col">
      <div className="flex flex-col lg:flex-row h-full">
        {/* Image section - Fixed height */}
        <div className="w-full lg:w-1/3">
          <div className="relative h-48 lg:h-full">
            <img
              src={schwimmschule.featured_image || fallbackImage}
              alt={schwimmschule.name}
              className="w-full h-full object-cover rounded-t-lg lg:rounded-l-lg lg:rounded-t-none cursor-pointer"
              onClick={handleDetailsClick}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = fallbackImage;
              }}
            />
          </div>
        </div>
        
        {/* Content section - Flex layout with overflow control */}
        <div className="flex-1 p-4 flex flex-col min-h-0">
          <CardHeader className="p-0 mb-3 flex-shrink-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div className="flex-1 min-w-0">
                <CardTitle 
                  className="text-lg font-bold text-gray-900 mb-2 cursor-pointer hover:text-blue-600 transition-colors line-clamp-2"
                  onClick={handleDetailsClick}
                >
                  {schwimmschule.name}
                </CardTitle>
                
                <SchoolRating 
                  rating={rating} 
                  reviewCount={reviewCount} 
                  distance={schwimmschule.distance_km} 
                />
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0 flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Address - Fixed height */}
            {(schwimmschule.address || schwimmschule.city) && (
              <div className="flex items-start gap-2 mb-3 flex-shrink-0">
                <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-600 line-clamp-1">
                  {schwimmschule.address || `${schwimmschule.street || ''}, ${schwimmschule.zip || ''} ${schwimmschule.city || ''}`}
                </span>
              </div>
            )}
            
            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto space-y-3 min-h-0">
              {/* Opening Hours */}
              <SchoolHours hours={schwimmschule.hours || schwimmschule.workday_timing} />
              
              {/* Categories for imported data */}
              {schwimmschule.categories && (
                <div className="flex flex-wrap gap-1">
                  {schwimmschule.categories.split(',').slice(0, 3).map((category, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {category.trim()}
                    </span>
                  ))}
                </div>
              )}
              
              {/* Features */}
              <SchoolFeatures features={features} />
              
              {/* Detailed Review Carousel */}
              <DetailedReviewCarousel reviews={detailedReviews} />
            </div>
            
            {/* Contact and Actions - Fixed at bottom */}
            <div className="mt-3 flex-shrink-0">
              <SchoolActions
                phone={schwimmschule.phone}
                website={schwimmschule.website}
                onDetailsClick={handleDetailsClick}
                onPhoneClick={handlePhoneClick}
              />
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
};

export default SchwimmschuleCard;
