import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Filter } from "@/types";
import SearchBar from "@/components/SearchBar";
import SchuleList from "@/components/SchuleList";
import LeafletMap from "@/components/LeafletMap";
import Header from "@/components/Header";
import FilterSidebar from "@/components/FilterSidebar";
import RegistrationButton from "@/components/RegistrationButton";
import { useImportedSchulData } from "@/hooks/useImportedSchulData";
import { Badge } from "@/components/ui/badge";

const LocationSchwimmschulen = () => {
  const { t } = useLanguage();
  const { stadt, zielgruppe } = useParams();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | undefined>();
  const [currentFilters, setCurrentFilters] = useState<Filter>({
    search: "",
    location: stadt || "",
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

  // Parse city name from URL (handle place_id URLs and compound names)
  const parseStadtName = (stadtParam: string | undefined): string => {
    if (!stadtParam) return "";
    
    // If it's a place_id (starts with ChIJ), find the city name from the filtered results
    if (stadtParam.startsWith('ChIJ')) {
      const schoolWithMatchingId = filteredSchulen.find(schule => schule.id === stadtParam);
      return schoolWithMatchingId?.city || "";
    }
    
    // Otherwise, parse as normal city name
    return stadtParam.split('-')[0].replace(/\b\w/g, l => l.toUpperCase());
  };

  const parseZielgruppe = (zielgruppeParam: string | undefined): string => {
    if (!zielgruppeParam) return "";
    const mapping: { [key: string]: string } = {
      'kleinkinder': 'Kleinkinder',
      'kinder': 'Kinder', 
      'erwachsene': 'Erwachsene',
      'babys': 'Babys',
      'anfaenger': 'Anfänger',
      'fortgeschrittene': 'Fortgeschrittene'
    };
    return mapping[zielgruppeParam.toLowerCase()] || zielgruppeParam;
  };

  const cityName = parseStadtName(stadt);
  const targetGroup = parseZielgruppe(zielgruppe);

  // Generate dynamic SEO content
  const generateSEOContent = () => {
    const pathname = window.location.pathname;
    let courseType = "Schwimmkurse";
    let description = "Finden Sie die besten Schwimmschulen";

    if (pathname.includes("/schwimmkurs")) {
      courseType = "Schwimmkurse";
      description = "Entdecken Sie professionelle Schwimmkurse";
    } else if (pathname.includes("/schwimmschule")) {
      courseType = "Schwimmschulen";
      description = "Finden Sie die besten Schwimmschulen";
    } else if (pathname.includes("/babyschwimmen")) {
      courseType = "Babyschwimmen";
      description = "Spielerisches Babyschwimmen ab 3 Monaten";
    } else if (pathname.includes("/kinderkurse")) {
      courseType = "Kinderschwimmkurse";
      description = "Schwimmkurse für Kinder von 3-11 Jahren";
    } else if (pathname.includes("/anfaengerkurs")) {
      courseType = "Anfängerkurse";
      description = "Schwimmen lernen für Anfänger jeden Alters";
    }

    return { courseType, description };
  };

  const { courseType, description } = generateSEOContent();

  // Initial data fetch
  useEffect(() => {
    fetchSchulen();
  }, []);

  // Apply location filter when URL params change
  useEffect(() => {
    if (stadt) {
      const newFilters = { 
        ...currentFilters, 
        location: cityName,
        search: searchTerm 
      };
      setCurrentFilters(newFilters);
      applyFilters(newFilters);
    }
  }, [stadt, cityName, searchTerm, applyFilters]);

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
    const newFilters = { 
      ...currentFilters, 
      search: searchTerm,
      location: cityName 
    };
    setCurrentFilters(newFilters);
    applyFilters(newFilters);
  }, [searchTerm, cityName, applyFilters]);

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
              {courseType} {cityName && `in ${cityName}`}
              {targetGroup && ` für ${targetGroup}`}
            </h1>
            <p className="text-base sm:text-lg text-gray-600 mb-4">
              {description} {cityName && `in ${cityName}`}
              {targetGroup && ` speziell für ${targetGroup}`}. 
              Vergleichen Sie Bewertungen, Preise und Verfügbarkeit von über 3000 Schwimmschulen.
            </p>
            
            {/* Breadcrumb navigation */}
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <a href="/" className="hover:text-primary">Home</a>
              <span>›</span>
              <span className="capitalize">{courseType}</span>
              {cityName && (
                <>
                  <span>›</span>
                  <span>{cityName}</span>
                </>
              )}
              {targetGroup && (
                <>
                  <span>›</span>
                  <Badge variant="secondary">{targetGroup}</Badge>
                </>
              )}
            </nav>
          </div>

          {/* Results count and registration button */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-medium text-gray-700">
              <span className="font-semibold text-primary">{filteredSchulen.length}</span> {courseType} {cityName && `in ${cityName}`} gefunden
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

          {/* Local SEO FAQ Section */}
          {cityName && (
            <section className="mt-12 bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">
                Häufige Fragen zu {courseType} in {cityName}
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900">
                    Wo kann mein Kind schwimmen lernen in {cityName}?
                  </h3>
                  <p className="text-gray-600 mt-1">
                    In {cityName} finden Sie {filteredSchulen.length} qualifizierte Schwimmschulen, 
                    die professionelle Schwimmkurse für Kinder und Erwachsene anbieten.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    Was kosten Schwimmkurse in {cityName}?
                  </h3>
                  <p className="text-gray-600 mt-1">
                    Die Preise variieren je nach Anbieter und Kursart. Kontaktieren Sie die 
                    Schwimmschulen direkt für aktuelle Preise und Verfügbarkeiten.
                  </p>
                </div>
              </div>
            </section>
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

export default LocationSchwimmschulen;