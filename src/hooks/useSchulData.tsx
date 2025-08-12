import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Schwimmschule, Filter, Coordinates } from "@/types";
import { useToast } from "@/components/ui/use-toast";

export const useSchulData = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [schulen, setSchulen] = useState<Schwimmschule[]>([]);
  const [filteredSchulen, setFilteredSchulen] = useState<Schwimmschule[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const PAGE_SIZE = 10;

  // Get coordinates from postal code or city name
  const getCoordinatesFromLocation = async (locationInput: string): Promise<Coordinates | null> => {
    try {
      console.log("Searching for location:", locationInput);
      
      const isPostalCode = /^\d+$/.test(locationInput.trim());
      
      if (isPostalCode) {
        console.log("Searching by postal code");
        const { data, error } = await supabase.rpc('get_coordinates_by_postal_code', {
          postal_code_input: locationInput.trim()
        });
        
        console.log("Postal code search result:", data, error);
        
        if (error) {
          console.error("Error getting coordinates for postal code:", error);
          return null;
        }
        
        if (data && data.length > 0) {
          console.log("Found coordinates:", data[0]);
          return {
            latitude: data[0].latitude,
            longitude: data[0].longitude
          };
        }
      } else {
        console.log("Searching by city name");
        const { data, error } = await supabase
          .from('geolocations')
          .select('latitude, longitude')
          .ilike('country', `%${locationInput}%`)
          .limit(1);
        
        console.log("City name search result:", data, error);
        
        if (error) {
          console.error("Error getting coordinates for city:", error);
          return null;
        }
        
        if (data && data.length > 0) {
          return {
            latitude: data[0].latitude,
            longitude: data[0].longitude
          };
        }
      }
      
      console.log("No coordinates found for location:", locationInput);
      return null;
    } catch (error) {
      console.error("Error in getCoordinatesFromLocation:", error);
      return null;
    }
  };

  // Format data helper
  const formatSchoolData = (data: any[]): Schwimmschule[] => {
    return data?.map(item => ({
      id: item.place_id,
      name: item.name || "Unnamed",
      website: item.website,
      rating: item.rating,
      reviews: item.reviews,
      phone: item.phone,
      hours: item.hours,
      detailed_address: item.detailed_address,
      address: item.address,
      google_maps_url: item.link,
      about: item.about,
      featured_reviews: item.featured_reviews,
      detailed_reviews: item.detailed_reviews,
      featured_image: item.featured_image,
      distance_km: item.distance_km,
      coordinates: item.coordinates
    })) as Schwimmschule[];
  };

  // Improved sorting by quality (rating and review count)
  const sortSchoolsByQuality = (schools: Schwimmschule[]): Schwimmschule[] => {
    return schools.sort((a, b) => {
      const aRating = parseFloat(a.rating?.replace(',', '.') || "0");
      const bRating = parseFloat(b.rating?.replace(',', '.') || "0");
      const aReviews = parseInt(a.reviews || "0", 10);
      const bReviews = parseInt(b.reviews || "0", 10);
      
      // Calculate a quality score: rating * log(reviews + 1) to give higher weight to places with more reviews
      const aScore = aRating * Math.log(aReviews + 1);
      const bScore = bRating * Math.log(bReviews + 1);
      
      // If significant difference in quality score, sort by that
      if (Math.abs(bScore - aScore) > 0.5) {
        return bScore - aScore;
      }
      
      // Otherwise, prioritize by rating first
      if (Math.abs(bRating - aRating) > 0.1) {
        return bRating - aRating;
      }
      
      // Then by number of reviews
      return bReviews - aReviews;
    });
  };

  // Check if search term is postal code
  const isPostalCodeSearch = (term: string) => {
    return /^\d{4,5}$/.test(term.trim());
  };

  // Fetch initial data
  const fetchSchulen = async () => {
    try {
      setLoading(true);
      setInitialLoading(true);
      
      const { data, error, count } = await supabase
        .from("schwimmschule")
        .select("*", { count: 'exact' })
        .range(0, PAGE_SIZE - 1);
      
      if (error) {
        throw error;
      }
      
      const formattedData = formatSchoolData(data);
      const sortedData = sortSchoolsByQuality(formattedData);
      
      setSchulen(sortedData);
      setFilteredSchulen(sortedData);
      setHasMore((count || 0) > PAGE_SIZE);
    } catch (error) {
      console.error("Error loading schools:", error);
      toast({
        title: 'Fehler',
        description: 'Fehler beim Laden der Schwimmschulen',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  // Fetch more data
  const fetchMoreSchulen = async () => {
    if (!hasMore || loading) return;
    
    try {
      setLoading(true);
      
      const start = page * PAGE_SIZE;
      const end = start + PAGE_SIZE - 1;
      
      const { data, error, count } = await supabase
        .from("schwimmschule")
        .select("*", { count: 'exact' })
        .range(start, end);
      
      if (error) {
        throw error;
      }
      
      const formattedData = formatSchoolData(data);
      
      if (data.length === 0) {
        setHasMore(false);
      } else {
        setSchulen(prev => [...prev, ...formattedData]);
        setHasMore((count || 0) > end + 1);
      }
    } catch (error) {
      console.error("Error loading more schools:", error);
      toast({
        title: 'Fehler',
        description: 'Fehler beim Laden weiterer Schwimmschulen',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  const applyFilters = useCallback(async (filters: Filter) => {
    try {
      setLoading(true);
      console.log("Applying filters:", filters);
      
      let queryData: Schwimmschule[] = [];
      
      // Check if search term is a postal code
      if (filters.search.trim() !== "" && isPostalCodeSearch(filters.search)) {
        console.log("Search term is postal code, doing enhanced location search");
        const coordinates = await getCoordinatesFromLocation(filters.search);
        
        if (coordinates) {
          // First get radius results
          const { data: radiusData, error: radiusError } = await supabase.rpc('search_schwimmschule_by_location', {
            search_lat: coordinates.latitude,
            search_lon: coordinates.longitude,
            radius_km: filters.radius || 25
          });
          
          if (radiusError) {
            console.error("Error in postal code radius search:", radiusError);
          }
          
          // Also get all schools and filter by postal code or city
          const { data: allData, error: allError } = await supabase
            .from("schwimmschule")
            .select("*");
          
          if (allError) {
            console.error("Error fetching all schools:", allError);
            queryData = formatSchoolData(radiusData || []);
          } else {
            // Combine radius results with postal code matches
            const radiusResults = formatSchoolData(radiusData || []);
            const allResults = formatSchoolData(allData || []);
            
            // Find schools that match the postal code in address or detailed_address
            const postalCodeMatches = allResults.filter(school => {
              const searchTerm = filters.search.toLowerCase();
              const address = school.address?.toLowerCase() || "";
              
              let detailedAddress = "";
              if (typeof school.detailed_address === 'string') {
                try {
                  const parsed = JSON.parse(school.detailed_address);
                  detailedAddress = `${parsed.street || ""} ${parsed.city || ""} ${parsed.postal_code || ""}`.toLowerCase();
                } catch (e) {
                  detailedAddress = school.detailed_address.toLowerCase();
                }
              }
              
              return address.includes(searchTerm) || detailedAddress.includes(searchTerm);
            });
            
            // Combine and deduplicate
            const combined = [...radiusResults];
            postalCodeMatches.forEach(match => {
              if (!combined.find(existing => existing.id === match.id)) {
                combined.push(match);
              }
            });
            
            queryData = combined;
            console.log("Combined postal code search results:", queryData.length);
          }
        } else {
          queryData = [...schulen];
        }
      }
      // If location filter is provided, use radius-based search
      else if (filters.location.trim() !== "") {
        console.log("Using location filter");
        const coordinates = await getCoordinatesFromLocation(filters.location);
        
        if (coordinates) {
          const { data, error } = await supabase.rpc('search_schwimmschule_by_location', {
            search_lat: coordinates.latitude,
            search_lon: coordinates.longitude,
            radius_km: filters.radius || 25
          });
          
          if (error) {
            console.error("Error in radius search:", error);
            queryData = schulen;
          } else {
            queryData = formatSchoolData(data || []);
          }
        } else {
          // Fallback to text-based location search
          const { data, error } = await supabase
            .from("schwimmschule")
            .select("*")
            .or(`address.ilike.%${filters.location}%,detailed_address->>city.ilike.%${filters.location}%`);
          
          if (error) {
            console.error("Error in location search:", error);
            queryData = schulen;
          } else {
            queryData = formatSchoolData(data || []);
          }
        }
      } else {
        queryData = [...schulen];
      }
      
      // Apply other filters
      let filtered = queryData;
      
      // Search filter (name and address) - but skip if we already did postal code search
      if (filters.search.trim() !== "" && !isPostalCodeSearch(filters.search)) {
        const lowercaseSearch = filters.search.toLowerCase();
        filtered = filtered.filter(schule => {
          const detailedAddress = typeof schule.detailed_address === 'string' 
            ? JSON.parse(schule.detailed_address) 
            : schule.detailed_address;
          
          return (
            schule.name?.toLowerCase().includes(lowercaseSearch) ||
            schule.address?.toLowerCase().includes(lowercaseSearch) ||
            (detailedAddress?.street && detailedAddress.street.toLowerCase().includes(lowercaseSearch)) ||
            (detailedAddress?.city && detailedAddress.city.toLowerCase().includes(lowercaseSearch))
          );
        });
      }
      
      // Rating filter
      if (filters.minRating && filters.minRating > 0) {
        filtered = filtered.filter(schule => {
          const rating = parseFloat(schule.rating?.replace(',', '.') || "0");
          return rating >= filters.minRating!;
        });
      }
      
      // Reviews count filter
      if (filters.minReviews && filters.minReviews > 0) {
        filtered = filtered.filter(schule => {
          const reviewCount = parseInt(schule.reviews || "0", 10);
          return reviewCount >= filters.minReviews!;
        });
      }
      
      // Sort by quality
      const sortedFiltered = sortSchoolsByQuality(filtered);
      
      console.log("Final filtered results:", sortedFiltered.length);
      setFilteredSchulen(sortedFiltered);
    } catch (error) {
      console.error("Error applying filters:", error);
      setFilteredSchulen(schulen);
    } finally {
      setLoading(false);
    }
  }, [schulen]);

  return {
    loading,
    schulen,
    filteredSchulen,
    page,
    hasMore,
    initialLoading,
    fetchSchulen,
    fetchMoreSchulen,
    applyFilters,
    setPage
  };
};
