import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Filter } from "@/types";
import SearchBar from "@/components/SearchBar";
import SchuleList from "@/components/SchuleList";
import LeafletMap from "@/components/LeafletMap";
import Header from "@/components/Header";
import FilterSidebar from "@/components/FilterSidebar";
import RegistrationButton from "@/components/RegistrationButton";
import { useImportedSchulData } from "@/hooks/useImportedSchulData";

const SchwimmschuleList = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | undefined>();
  const [currentFilters, setCurrentFilters] = useState<Filter>({
    search: "",
    location: "",
    radius: 25,
    minRating: 0,
    minReviews: 0
  });

  const {
    loading,
    filteredSchulen,
    page,
    hasMore,
    initialLoading,
    fetchSchulen,
    fetchMoreSchulen,
    applyFilters,
    setPage
  } = useImportedSchulData();
  
  // Initial data fetch
  useEffect(() => {
    fetchSchulen();
  }, []);
  
  // Fetch more data when page changes
  useEffect(() => {
    if (page > 0) {
      fetchMoreSchulen();
    }
  }, [page]);
  
  // Handle filter changes
  const handleFilterChange = useCallback((filters: Filter) => {
    setCurrentFilters(filters);
    applyFilters(filters);
  }, [applyFilters]);
  
  // Handle search term changes
  useEffect(() => {
    const newFilters = { ...currentFilters, search: searchTerm };
    setCurrentFilters(newFilters);
    applyFilters(newFilters);
  }, [searchTerm, applyFilters]);
  
  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log("Error getting location:", error);
        }
      );
    }
  }, []);

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onMenuClick={() => setFilterOpen(!filterOpen)} />
      
      <div className="flex flex-1">
        {/* Filter sidebar */}
        <FilterSidebar 
          onFilterChange={handleFilterChange}
          isOpen={filterOpen}
          onClose={() => setFilterOpen(false)}
        />
        
        <main className="flex-1 p-4 container mx-auto max-w-7xl">
          {/* Search bar */}
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onFilterToggle={() => setFilterOpen(!filterOpen)}
            onMapOpen={() => setMapOpen(true)}
          />
          
          {/* SEO-optimized hero section */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              Schwimmkurse in der Nähe finden
            </h1>
            <p className="text-base sm:text-lg text-gray-600 mb-4">
              Entdecken Sie die besten Schwimmschulen und Schwimmkurse in Ihrer Umgebung. 
              Vergleichen Sie Bewertungen, Preise und Verfügbarkeit von über 500 zertifizierten Schwimmschulen.
            </p>
          </div>

          {/* Results count and registration button */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-medium text-gray-700">
              <span className="font-semibold text-primary">{filteredSchulen.length}</span> Schwimmkurse {t('found')}
            </h2>
            <RegistrationButton />
          </div>
          
          {/* Loading state */}
          {initialLoading ? (
            <div className="flex justify-center items-center h-64">
              <p>{t('loading')}...</p>
            </div>
          ) : (
            <SchuleList
              schulen={filteredSchulen}
              loading={loading}
              hasMore={hasMore}
              onLoadMore={handleLoadMore}
            />
          )}
        </main>
      </div>

      {/* Leaflet Map view modal */}
      <LeafletMap 
        schulen={filteredSchulen}
        isOpen={mapOpen}
        onClose={() => setMapOpen(false)}
        userLocation={userLocation}
      />
    </div>
  );
};

export default SchwimmschuleList;
