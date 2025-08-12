import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Schwimmschule, Filter, Coordinates } from "@/types";
import { useToast } from "@/components/ui/use-toast";

export const useImportedSchulData = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [schulen, setSchulen] = useState<Schwimmschule[]>([]);
  const [filteredSchulen, setFilteredSchulen] = useState<Schwimmschule[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const PAGE_SIZE = 20; // Increased for better mobile performance

  // Get coordinates from postal code or city name
  const getCoordinatesFromLocation = async (locationInput: string): Promise<Coordinates | null> => {
    try {
      console.log("Searching for location:", locationInput);
      
      const isPostalCode = /^\d+$/.test(locationInput.trim());
      
      if (isPostalCode) {
        const { data, error } = await supabase.rpc('get_coordinates_by_postal_code', {
          postal_code_input: locationInput.trim()
        });
        
        if (error || !data || data.length === 0) return null;
        
        return {
          latitude: data[0].latitude,
          longitude: data[0].longitude
        };
      } else {
        const { data, error } = await supabase
          .from('geolocations')
          .select('latitude, longitude')
          .ilike('country', `%${locationInput}%`)
          .limit(1);
        
        if (error || !data || data.length === 0) return null;
        
        return {
          latitude: data[0].latitude,
          longitude: data[0].longitude
        };
      }
    } catch (error) {
      console.error("Error in getCoordinatesFromLocation:", error);
      return null;
    }
  };

  // Format imported data for frontend
  const formatImportedSchoolData = (data: any[]): Schwimmschule[] => {
    return data?.map(item => ({
      id: item.place_id || `imported-${item.id}`,
      name: item.name || "Unnamed",
      website: item.website,
      rating: item.rating?.toString() || "0",
      reviews: item.reviews?.toString() || "0", 
      phone: item.phone,
      hours: null, // Will need to parse if available
      detailed_address: null,
      address: `${item.street || ''}, ${item.zip || ''} ${item.city || ''}`.trim(),
      google_maps_url: item.link,
      about: { description: item.description || "" },
      featured_reviews: null,
      detailed_reviews: null,
      featured_image: item.featured_image,
      distance_km: null,
      coordinates: null,
      // Additional imported fields
      main_category: item.main_category,
      categories: item.categories,
      city: item.city,
      zip: item.zip,
      street: item.street,
      workday_timing: item.workday_timing,
      is_temporarily_closed: item.is_temporarily_closed === 'TRUE',
      owner_name: item.owner_name
    })) as Schwimmschule[];
  };

  // Enhanced sorting by relevance, rating and review count
  const sortSchoolsByRelevance = (schools: Schwimmschule[], searchLocation?: string): Schwimmschule[] => {
    return schools.sort((a, b) => {
      const aRating = parseFloat(a.rating?.replace(',', '.') || "0");
      const bRating = parseFloat(b.rating?.replace(',', '.') || "0");
      const aReviews = parseInt(a.reviews || "0", 10);
      const bReviews = parseInt(b.reviews || "0", 10);
      
      // Location relevance boost
      let aLocationScore = 0;
      let bLocationScore = 0;
      
      if (searchLocation) {
        const searchLower = searchLocation.toLowerCase();
        if (a.city?.toLowerCase().includes(searchLower)) aLocationScore += 10;
        if (b.city?.toLowerCase().includes(searchLower)) bLocationScore += 10;
        if (a.address?.toLowerCase().includes(searchLower)) aLocationScore += 5;
        if (b.address?.toLowerCase().includes(searchLower)) bLocationScore += 5;
      }
      
      // Category relevance (prioritize actual swimming schools)
      if (a.main_category === 'Schwimmschule') aLocationScore += 20;
      if (b.main_category === 'Schwimmschule') bLocationScore += 20;
      if (a.categories?.includes('Schwimmschule')) aLocationScore += 15;
      if (b.categories?.includes('Schwimmschule')) bLocationScore += 15;
      
      // Quality score with review weight
      const aQualityScore = aRating * Math.log(aReviews + 1) + aLocationScore;
      const bQualityScore = bRating * Math.log(bReviews + 1) + bLocationScore;
      
      return bQualityScore - aQualityScore;
    });
  };

  // Fetch initial data from imported table
  const fetchSchulen = async () => {
    try {
      setLoading(true);
      setInitialLoading(true);
      
      const { data, error, count } = await supabase
        .from("schwimmschulen_import")
        .select("*", { count: 'exact' })
        .order('rating', { ascending: false, nullsFirst: false })
        .range(0, PAGE_SIZE - 1);
      
      if (error) throw error;
      
      const formattedData = formatImportedSchoolData(data || []);
      const sortedData = sortSchoolsByRelevance(formattedData);
      
      setSchulen(sortedData);
      setFilteredSchulen(sortedData);
      setHasMore((count || 0) > PAGE_SIZE);
    } catch (error) {
      console.error("Error loading imported schools:", error);
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

  // Fetch more data for pagination
  const fetchMoreSchulen = async () => {
    if (!hasMore || loading) return;
    
    try {
      setLoading(true);
      
      const start = page * PAGE_SIZE;
      const end = start + PAGE_SIZE - 1;
      
      const { data, error, count } = await supabase
        .from("schwimmschulen_import")
        .select("*", { count: 'exact' })
        .order('rating', { ascending: false, nullsFirst: false })
        .range(start, end);
      
      if (error) throw error;
      
      const formattedData = formatImportedSchoolData(data || []);
      
      if (data?.length === 0) {
        setHasMore(false);
      } else {
        setSchulen(prev => [...prev, ...formattedData]);
        setHasMore((count || 0) > end + 1);
      }
    } catch (error) {
      console.error("Error loading more schools:", error);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters to imported data
  const applyFilters = useCallback(async (filters: Filter) => {
    try {
      setLoading(true);
      console.log("Applying filters to imported data:", filters);
      
      let query = supabase.from("schwimmschulen_import").select("*");
      
      // Location-based filtering
      if (filters.location.trim() !== "") {
        const location = filters.location.toLowerCase().trim();
        query = query.or(`city.ilike.%${location}%,address.ilike.%${location}%,zip.eq.${location}`);
      }
      
      // Search filtering
      if (filters.search.trim() !== "") {
        const search = filters.search.toLowerCase();
        query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,city.ilike.%${search}%,address.ilike.%${search}%`);
      }
      
      // Category filtering for better relevance
      query = query.or(`main_category.eq.Schwimmschule,categories.ilike.%Schwimmschule%,categories.ilike.%Babyschwimmschule%,categories.ilike.%Schwimmlehrer%`);
      
      const { data, error } = await query.limit(100); // Reasonable limit for mobile
      
      if (error) {
        console.error("Error applying filters:", error);
        setFilteredSchulen(schulen);
        return;
      }
      
      let filtered = formatImportedSchoolData(data || []);
      
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
      
      // Sort by relevance
      const sortedFiltered = sortSchoolsByRelevance(filtered, filters.location || filters.search);
      
      console.log("Filtered imported results:", sortedFiltered.length);
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