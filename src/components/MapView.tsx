import { useState, useEffect, useRef } from "react";
import { Schwimmschule } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, MapPin, Navigation, Phone } from "lucide-react";
import StarRating from "./StarRating";
import { useNavigate } from "react-router-dom";

interface MapViewProps {
  schulen: Schwimmschule[];
  isOpen: boolean;
  onClose: () => void;
  userLocation?: { lat: number; lng: number };
}

const MapView = ({ schulen, isOpen, onClose, userLocation }: MapViewProps) => {
  const navigate = useNavigate();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const markers = useRef<google.maps.Marker[]>([]);
  const [selectedSchule, setSelectedSchule] = useState<Schwimmschule | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isLoadingMap, setIsLoadingMap] = useState(true);

  // Initialize Google Maps
  useEffect(() => {
    if (!isOpen || !mapContainer.current) return;

    const loadGoogleMaps = () => {
      // Check if Google Maps is already loaded
      if (window.google && window.google.maps) {
        initializeMap();
        return;
      }

      // Get API key from environment variable
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      
      if (!apiKey) {
        console.error('Google Maps API key is not configured');
        setIsLoadingMap(false);
        return;
      }

      // Create script element to load Google Maps
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        if (window.google && window.google.maps) {
          initializeMap();
        } else {
          setIsLoadingMap(false);
          console.error('Google Maps failed to load');
        }
      };
      
      script.onerror = () => {
        setIsLoadingMap(false);
        console.error('Failed to load Google Maps script');
      };

      document.head.appendChild(script);

      // Cleanup function
      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    };

    const cleanup = loadGoogleMaps();
    return cleanup;
  }, [isOpen]);

  const initializeMap = () => {
    if (!mapContainer.current || !window.google) return;

    setIsLoadingMap(false);

    // Default to Germany center if no user location and no schools
    let center = { lat: 51.1657, lng: 10.4515 };
    let zoom = 6;

    if (userLocation) {
      center = userLocation;
      zoom = 12;
    } else if (schulen.length > 0) {
      // Use first school location as center
      const firstSchool = schulen[0];
      const coordinates = getSchoolCoordinates(firstSchool);
      if (coordinates) {
        center = coordinates;
        zoom = 10;
      }
    }

    map.current = new google.maps.Map(mapContainer.current, {
      zoom: zoom,
      center: center,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }]
        }
      ],
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false
    });

    setIsMapLoaded(true);
  };

  // Helper function to get coordinates from school data
  const getSchoolCoordinates = (schule: Schwimmschule) => {
    try {
      const coordinates = typeof schule.detailed_address === 'string' 
        ? JSON.parse(schule.detailed_address) 
        : schule.detailed_address;
      
      if (coordinates && coordinates.lat && coordinates.lng) {
        return { lat: coordinates.lat, lng: coordinates.lng };
      }
    } catch (error) {
      console.error('Error parsing coordinates for school:', schule.name, error);
    }
    return null;
  };

  // Add markers when map is loaded and schools change
  useEffect(() => {
    if (!isMapLoaded || !map.current || !window.google) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.setMap(null));
    markers.current = [];

    // Add user location marker if available
    if (userLocation) {
      const userMarker = new google.maps.Marker({
        position: userLocation,
        map: map.current,
        title: "Ihr Standort",
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#4285F4",
          fillOpacity: 1,
          strokeColor: "white",
          strokeWeight: 2
        },
        zIndex: 1000
      });
      markers.current.push(userMarker);
    }

    // Add school markers
    const bounds = new google.maps.LatLngBounds();
    let hasValidCoordinates = false;

    schulen.forEach((schule) => {
      const coordinates = getSchoolCoordinates(schule);

      if (coordinates) {
        const marker = new google.maps.Marker({
          position: coordinates,
          map: map.current,
          title: schule.name,
          icon: {
            url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
              <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 0C7.163 0 0 7.163 0 16c0 14 16 24 16 24s16-10 16-24c0-8.837-7.163-16-16-16z" fill="#1E40AF"/>
                <circle cx="16" cy="16" r="6" fill="white"/>
              </svg>
            `),
            scaledSize: new google.maps.Size(32, 40),
            anchor: new google.maps.Point(16, 40)
          }
        });

        marker.addListener('click', () => {
          setSelectedSchule(schule);
        });

        markers.current.push(marker);
        bounds.extend(coordinates);
        hasValidCoordinates = true;
      }
    });

    // Include user location in bounds
    if (userLocation) {
      bounds.extend(userLocation);
      hasValidCoordinates = true;
    }

    // Fit map to show all markers
    if (hasValidCoordinates && markers.current.length > 1) {
      map.current.fitBounds(bounds);
      
      // Ensure minimum zoom level
      const listener = google.maps.event.addListener(map.current, "idle", () => {
        if (map.current!.getZoom()! > 15) {
          map.current!.setZoom(15);
        }
        google.maps.event.removeListener(listener);
      });
    }
  }, [isMapLoaded, schulen, userLocation]);

  if (!isOpen) return null;

  const handleDetailsClick = (schule: Schwimmschule) => {
    if (schule.id) {
      onClose();
      navigate(`/schwimmschule/${schule.id}`);
    }
  };

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  return (
    <div className="fixed inset-0 z-50 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <h2 className="text-lg font-semibold">Kartenansicht</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Map container */}
      <div className="relative flex-1 h-full">
        {/* Loading/Fallback message */}
        {(isLoadingMap || !isMapLoaded || !apiKey) && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
            <div className="text-center p-8">
              <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                {!apiKey ? "Google Maps API-Schlüssel fehlt" : isLoadingMap ? "Karte wird geladen..." : "Kartenansicht"}
              </h3>
              <p className="text-gray-500 text-sm">
                {!apiKey 
                  ? "Bitte setzen Sie die Umgebungsvariable VITE_GOOGLE_MAPS_API_KEY."
                  : isLoadingMap 
                    ? "Die Karte wird geladen, bitte warten Sie einen Moment."
                    : "Für die Kartenansicht ist eine Google Maps API-Schlüssel erforderlich."
                }
              </p>
            </div>
          </div>
        )}
        
        {/* Google Maps container */}
        <div ref={mapContainer} className="absolute inset-0" />

        {/* Selected school info card */}
        {selectedSchule && (
          <div className="absolute bottom-4 left-4 right-4 md:left-auto md:w-80">
            <Card className="shadow-lg">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg leading-tight">
                    {selectedSchule.name}
                  </h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedSchule(null)}
                    className="p-1 h-auto"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-2">
                  <StarRating 
                    rating={selectedSchule.rating ? parseFloat(selectedSchule.rating.replace(',', '.')) : 0}
                    count={selectedSchule.reviews ? parseInt(selectedSchule.reviews, 10) : 0}
                  />
                  {selectedSchule.distance_km && (
                    <>
                      <span className="text-gray-400">•</span>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Navigation size={12} />
                        <span>{selectedSchule.distance_km.toFixed(1)} km</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Address */}
                {selectedSchule.address && (
                  <p className="text-sm text-gray-600 mb-3">{selectedSchule.address}</p>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2">
                  {selectedSchule.phone && (
                    <Button variant="outline" size="sm" className="flex items-center gap-2 flex-1">
                      <Phone className="h-4 w-4" />
                      <a href={`tel:${selectedSchule.phone}`} className="text-current no-underline">
                        Anrufen
                      </a>
                    </Button>
                  )}
                  
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                    size="sm"
                    onClick={() => handleDetailsClick(selectedSchule)}
                  >
                    Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapView;
