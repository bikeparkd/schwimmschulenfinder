
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Schwimmschule } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Star, 
  Phone, 
  Globe, 
  MapPin, 
  Clock,
  Navigation
} from "lucide-react";
import Header from "@/components/Header";
import StarRating from "@/components/StarRating";
import { useToast } from "@/hooks/use-toast";

const SchwimmschuleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [schule, setSchule] = useState<Schwimmschule | null>(null);
  const [loading, setLoading] = useState(true);

  // Fallback image URL
  const fallbackImage = "/lovable-uploads/8548741e-86c1-492f-a522-2eb9ee6ca9d3.png";

  useEffect(() => {
    if (id) {
      fetchSchuleDetails(id);
    }
  }, [id]);

  const fetchSchuleDetails = async (placeId: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from("schwimmschule")
        .select("*")
        .eq('place_id', placeId)
        .single();
      
      if (error) {
        throw error;
      }

      // Format the data
      const formattedSchule: Schwimmschule = {
        id: data.place_id,
        name: data.name || "Unnamed",
        website: data.website,
        rating: data.rating,
        reviews: data.reviews,
        phone: data.phone,
        hours: data.hours,
        detailed_address: data.detailed_address,
        address: data.address,
        google_maps_url: data.link,
        about: data.about,
        featured_reviews: data.featured_reviews,
        featured_image: data.featured_image
      };

      setSchule(formattedSchule);
    } catch (error) {
      console.error("Error loading school details:", error);
      toast({
        title: t('error'),
        description: "Fehler beim Laden der Schuldetails",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header onMenuClick={() => {}} />
        <div className="flex-1 flex items-center justify-center">
          <p>{t('loading')}...</p>
        </div>
      </div>
    );
  }

  if (!schule) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header onMenuClick={() => {}} />
        <div className="flex-1 flex items-center justify-center">
          <p>Schwimmschule nicht gefunden</p>
        </div>
      </div>
    );
  }

  // Parse data
  const rating = schule.rating ? parseFloat(schule.rating.replace(',', '.')) : 0;
  const reviewCount = schule.reviews ? parseInt(schule.reviews, 10) : 0;
  
  const parseData = (data: any) => {
    if (typeof data === 'string') {
      try {
        return JSON.parse(data);
      } catch {
        return null;
      }
    }
    return data;
  };

  const hours = parseData(schule.hours);
  const aboutData = parseData(schule.about);
  const detailedAddress = parseData(schule.detailed_address);
  const featuredReviews = parseData(schule.featured_reviews);

  const features = aboutData?.features || [];

  // Helper function to safely render hours in a compact format like the reference
  const renderCompactHours = (hoursData: any) => {
    if (!hoursData || typeof hoursData !== 'object') return null;
    
    const dayAbbreviations = {
      monday: 'Mo',
      tuesday: 'Di', 
      wednesday: 'Mi',
      thursday: 'Do',
      friday: 'Fr',
      saturday: 'Sa',
      sunday: 'So'
    };

    const dayNames = {
      monday: 'Montag',
      tuesday: 'Dienstag', 
      wednesday: 'Mittwoch',
      thursday: 'Donnerstag',
      friday: 'Freitag',
      saturday: 'Samstag',
      sunday: 'Sonntag'
    };

    return Object.entries(hoursData).map(([day, time]) => {
      // Handle both string times and object times
      let timeString = '';
      if (typeof time === 'string') {
        timeString = time;
      } else if (typeof time === 'object' && time !== null) {
        // If time is an object, try to extract meaningful information
        if ('times' in time && Array.isArray(time.times)) {
          timeString = time.times.join(', ');
        } else if ('day' in time && 'times' in time) {
          timeString = Array.isArray(time.times) ? time.times.join(', ') : String(time.times);
        } else {
          timeString = 'Geschlossen';
        }
      } else {
        timeString = 'Geschlossen';
      }

      return (
        <div key={day} className="text-sm text-gray-600">
          <span className="font-medium">{dayAbbreviations[day as keyof typeof dayAbbreviations] || day}:</span> {timeString}
        </div>
      );
    });
  };

  const handleBackClick = () => {
    navigate('/schwimmschulen');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header onMenuClick={() => {}} />
      
      <main className="flex-1 container mx-auto max-w-4xl p-4">
        {/* Back button */}
        <div className="mb-4">
          <Button 
            variant="outline" 
            onClick={handleBackClick}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Zurück
          </Button>
        </div>

        <div className="space-y-6">
          {/* Main info card */}
          <Card>
            <div className="flex flex-col">
              {/* Image section */}
              <div className="w-full">
                <div className="relative h-64 md:h-80">
                  <img
                    src={schule.featured_image || fallbackImage}
                    alt={schule.name}
                    className="w-full h-full object-cover rounded-t-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = fallbackImage;
                    }}
                  />
                </div>
              </div>
              
              {/* Content section */}
              <div className="p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-3">
                    {schule.name}
                  </CardTitle>
                  
                  {/* Rating and Reviews */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
                    <StarRating rating={rating} count={reviewCount} />
                  </div>
                </CardHeader>
                
                <CardContent className="p-0 space-y-4">
                  {/* Address */}
                  {schule.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{schule.address}</span>
                    </div>
                  )}
                  
                  {/* Opening Hours - prominently displayed like in reference */}
                  {hours && (
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div className="space-y-1">
                        {renderCompactHours(hours)}
                      </div>
                    </div>
                  )}

                  {/* Phone */}
                  {schule.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-gray-500 flex-shrink-0" />
                      <a href={`tel:${schule.phone}`} className="text-blue-600 hover:underline">
                        {schule.phone}
                      </a>
                    </div>
                  )}
                  
                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    {schule.website && (
                      <Button variant="outline" className="flex items-center gap-2 justify-center" asChild>
                        <a href={schule.website} target="_blank" rel="noopener noreferrer">
                          <Globe className="h-4 w-4" />
                          Website
                        </a>
                      </Button>
                    )}
                    
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 justify-center">
                      <MapPin className="h-4 w-4" />
                      Auf der Karte anzeigen
                    </Button>
                  </div>
                </CardContent>
              </div>
            </div>
          </Card>

          {/* Features */}
          {features.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ausstattung & Merkmale</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {features.map((feature: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Featured Reviews */}
          {featuredReviews && featuredReviews.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Bewertungen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {featuredReviews.slice(0, 3).map((review: any, index: number) => (
                    <div key={index} className="border-b last:border-b-0 pb-4 last:pb-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < (review.rating || 5) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        {review.author && (
                          <span className="text-sm font-medium text-gray-700">
                            {review.author}
                          </span>
                        )}
                      </div>
                      {review.text && (
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {review.text}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default SchwimmschuleDetail;
