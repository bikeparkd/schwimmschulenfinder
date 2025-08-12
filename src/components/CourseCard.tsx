
import { Course } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";
import StarRating from "./StarRating";
import { MapPin, Users } from "lucide-react";
import { formatPrice } from "@/i18n";

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Course Image Section */}
      <div className="relative bg-gray-200 h-40">
        {/* This would be the course image */}
        <div className="absolute inset-0 flex items-center justify-center text-3xl text-gray-400 font-semibold">
          {course.title}
        </div>
        
        {/* Sponsored Tag if applicable */}
        {course.isSponsored && (
          <div className="absolute top-2 right-2 bg-sponsored text-white text-xs py-1 px-2 rounded">
            {t('sponsored')}
          </div>
        )}
      </div>
      
      {/* Course Details Section */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-bold text-xl mb-1">{course.title}</h3>
        <p className="text-gray-600 mb-3">{course.providerName}</p>
        
        {/* Location */}
        <div className="flex items-center mb-2 text-gray-600">
          <MapPin size={16} className="mr-1" />
          <span>{course.location.city}, {course.location.postalCode}</span>
        </div>
        
        {/* Age Range */}
        <div className="flex items-center mb-2 text-gray-600">
          <Users size={16} className="mr-1" />
          <span>{t('age')}: {course.age.min} - {course.age.max} {t('years')}</span>
        </div>
        
        {/* Course Level */}
        <div className="mb-2 text-gray-600">
          <span>{t('level')}: {t(course.level.toLowerCase())}</span>
        </div>
        
        {/* Rating */}
        <div className="mb-4">
          <StarRating rating={course.rating} count={course.ratingCount} />
        </div>
        
        {/* Price and Details Button */}
        <div className="flex justify-between items-center pt-2 border-t">
          <div className="text-xl font-bold text-primary">
            {formatPrice(course.price, course.currency)}
          </div>
          <button className="bg-primary text-white py-2 px-4 rounded-md flex items-center">
            {t('details')}
            <span className="ml-2">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
