import { useState, useEffect, useRef } from "react";
import { Schwimmschule } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, MapPin, Navigation, Phone } from "lucide-react";
import StarRating from "./StarRating";
import { useNavigate } from "react-router-dom";

interface LeafletMapProps {
  schulen: Schwimmschule[];
  isOpen: boolean;
  onClose: () => void;
  userLocation?: { lat: number; lng: number };
}

const LeafletMap = ({ schulen, isOpen, onClose, userLocation }: LeafletMapProps) => {
  const navigate = useNavigate();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const markers = useRef<any[]>([]);
  const [selectedSchule, setSelectedSchule] = useState<Schwimmschule | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isLoadingMap, setIsLoadingMap] = useState(true);
  const [leafletInstance, setLeafletInstance] = useState<any>(null);

  // Initialize Leaflet
  useEffect(() => {
    if (!isOpen || !mapContainer.current) return;

    const loadLeaflet = async () => {
      try {
        // Dynamic import of Leaflet
        const leafletModule = await import('leaflet');
        setLeafletInstance(leafletModule.default);
        
        // Load Leaflet CSS
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
          link.crossOrigin = '';
          document.head.appendChild(link);
        }

        setIsLoadingMap(false);
        initializeMap(leafletModule.default);
      } catch (error) {
        console.error('Failed to load Leaflet:', error);
        setIsLoadingMap(false);
      }
    };

    loadLeaflet();

    return () => {
      // Cleanup
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [isOpen]);

  const initializeMap = (L: any) => {
    if (!mapContainer.current || map.current) return;

    // Default to Germany center if no user location and no schools
    let center = [51.1657, 10.4515];
    let zoom = 6;

    if (userLocation) {
      center = [userLocation.lat, userLocation.lng];
      zoom = 12;
    } else if (schulen.length > 0) {
      // Try to find a school with coordinates to center the map
      for (const schule of schulen) {
        const coordinates = getSchoolCoordinates(schule);
        if (coordinates) {
          center = [coordinates.lat, coordinates.lng];
          zoom = 10;
          break;
        }
      }
    }

    // Initialize map
    map.current = L.map(mapContainer.current, {
      center: center,
      zoom: zoom,
      zoomControl: true,
      scrollWheelZoom: true,
      dragging: true,
      tap: true,
      touchZoom: true
    });

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map.current);

    setIsMapLoaded(true);
  };

  // Enhanced helper function to get coordinates from school data
  const getSchoolCoordinates = (schule: Schwimmschule) => {
    console.log("Processing school:", schule.name);
    console.log("Raw coordinates data:", schule.coordinates);
    
    // Helper function to safely parse JSON
    const safeJsonParse = (value: any) => {
      if (typeof value === 'string') {
        try {
          return JSON.parse(value);
        } catch (e) {
          console.log("Failed to parse JSON:", value);
          return null;
        }
      }
      return value;
    };

    // Helper function to extract coordinates from an object
    const extractCoordinates = (obj: any) => {
      if (!obj) return null;
      
      // Try different coordinate field names - prioritize latitude/longitude from Supabase
      const lat = obj.latitude || obj.lat || obj.Lat || obj.Latitude;
      const lng = obj.longitude || obj.lng || obj.lon || obj.Lng || obj.Longitude || obj.Lon;
      
      if (lat && lng && !isNaN(lat) && !isNaN(lng) &&
          lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        console.log("Successfully extracted coordinates:", { lat: parseFloat(lat), lng: parseFloat(lng) });
        return { lat: parseFloat(lat), lng: parseFloat(lng) };
      }
      return null;
    };

    // Try multiple coordinate sources
    const coordinateSources = [
      // Source 1: coordinates field (primary from Supabase)
      () => {
        const coords = safeJsonParse(schule.coordinates);
        console.log("Parsed coordinates:", coords);
        return extractCoordinates(coords);
      },
      
      // Source 2: detailed_address field
      () => {
        const address = safeJsonParse(schule.detailed_address);
        console.log("Detailed address:", address);
        return extractCoordinates(address);
      },
      
      // Source 3: Try to extract from address string using regex (German postal codes)
      () => {
        if (schule.address) {
          // Extract postal code from address
          const postalMatch = schule.address.match(/\b(\d{5})\b/);
          if (postalMatch) {
            const postalCode = postalMatch[1];
            console.log("Extracted postal code:", postalCode, "from address:", schule.address);
            
            // For now, return approximate coordinates for some major German cities
            // This is a fallback - in production you'd want to use a geocoding service
            const postalCodeCoords: { [key: string]: { lat: number; lng: number } } = {
              '10115': { lat: 52.5200, lng: 13.4050 }, // Berlin
              '80331': { lat: 48.1351, lng: 11.5820 }, // Munich
              '20095': { lat: 53.5511, lng: 9.9937 },  // Hamburg
              '50667': { lat: 50.9375, lng: 6.9603 },  // Cologne
              '60311': { lat: 50.1109, lng: 8.6821 },  // Frankfurt
              '70173': { lat: 48.7758, lng: 9.1829 },  // Stuttgart
              '40213': { lat: 51.2277, lng: 6.7735 },  // Düsseldorf
              '04109': { lat: 51.3397, lng: 12.3731 }, // Leipzig
              '01067': { lat: 51.0504, lng: 13.7373 }, // Dresden
              '30159': { lat: 52.3759, lng: 9.7320 },  // Hannover
              // Add more postal codes as needed
            };
            
            if (postalCodeCoords[postalCode]) {
              console.log("Using fallback coordinates for postal code:", postalCode);
              return postalCodeCoords[postalCode];
            }
          }
        }
        return null;
      }
    ];

    // Try each coordinate source
    for (const getCoords of coordinateSources) {
      try {
        const coords = getCoords();
        if (coords) {
          console.log("Found valid coordinates for", schule.name, ":", coords);
          return coords;
        }
      } catch (error) {
        console.error('Error processing coordinates for school:', schule.name, error);
      }
    }
    
    console.warn("No valid coordinates found for school:", schule.name);
    return null;
  };

  // Add markers when map is loaded and schools change
  useEffect(() => {
    if (!isMapLoaded || !map.current || !leafletInstance || !schulen.length) return;

    console.log("Adding markers for", schulen.length, "schools");

    // Clear existing markers
    markers.current.forEach(marker => map.current.removeLayer(marker));
    markers.current = [];

    // Create custom icon
    const createCustomIcon = (isUser = false) => {
      const iconHtml = isUser 
        ? `<div style="width: 20px; height: 20px; background: #4285F4; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`
        : `<div style="width: 32px; height: 40px; position: relative;">
             <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M16 0C7.163 0 0 7.163 0 16c0 14 16 24 16 24s16-10 16-24c0-8.837-7.163-16-16-16z" fill="#1E40AF"/>
               <circle cx="16" cy="16" r="6" fill="white"/>
             </svg>
           </div>`;

      return leafletInstance.divIcon({
        html: iconHtml,
        className: 'custom-div-icon',
        iconSize: isUser ? [20, 20] : [32, 40],
        iconAnchor: isUser ? [10, 10] : [16, 40],
        popupAnchor: [0, isUser ? -10 : -40]
      });
    };

    // Add user location marker if available
    if (userLocation) {
      const userMarker = leafletInstance.marker([userLocation.lat, userLocation.lng], {
        icon: createCustomIcon(true)
      }).addTo(map.current);
      
      userMarker.bindPopup("Ihr Standort");
      markers.current.push(userMarker);
    }

    // Add school markers
    const bounds = leafletInstance.latLngBounds();
    let hasValidCoordinates = false;
    let markerCount = 0;

    schulen.forEach((schule) => {
      const coordinates = getSchoolCoordinates(schule);

      if (coordinates) {
        markerCount++;
        const marker = leafletInstance.marker([coordinates.lat, coordinates.lng], {
          icon: createCustomIcon(false)
        }).addTo(map.current);

        // Create popup content
        const popupContent = `
          <div style="min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-weight: 600; font-size: 16px;">${schule.name}</h3>
            ${schule.address ? `<p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">${schule.address}</p>` : ''}
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              ${schule.rating ? `<span style="font-size: 14px;">⭐ ${schule.rating}</span>` : ''}
              ${schule.reviews ? `<span style="color: #666; font-size: 12px;">(${schule.reviews} Bewertungen)</span>` : ''}
            </div>
            <button onclick="window.selectSchule('${schule.id}')" style="background: #1E40AF; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">Details anzeigen</button>
          </div>
        `;

        marker.bindPopup(popupContent);
        
        // Add click handler
        marker.on('click', () => {
          setSelectedSchule(schule);
        });

        markers.current.push(marker);
        bounds.extend([coordinates.lat, coordinates.lng]);
        hasValidCoordinates = true;
      }
    });

    console.log(`Successfully added ${markerCount} markers out of ${schulen.length} schools`);

    // Include user location in bounds
    if (userLocation) {
      bounds.extend([userLocation.lat, userLocation.lng]);
      hasValidCoordinates = true;
    }

    // Fit map to show all markers
    if (hasValidCoordinates && markers.current.length > 0) {
      map.current.fitBounds(bounds, { padding: [20, 20] });
      
      // Ensure minimum zoom level
      setTimeout(() => {
        if (map.current.getZoom() > 15) {
          map.current.setZoom(15);
        }
      }, 100);
    }

    // Global function for popup buttons
    (window as any).selectSchule = (schuleId: string) => {
      const schule = schulen.find(s => s.id === schuleId);
      if (schule) {
        setSelectedSchule(schule);
      }
    };

  }, [isMapLoaded, schulen, userLocation, leafletInstance]);

  if (!isOpen) return null;

  const handleDetailsClick = (schule: Schwimmschule) => {
    if (schule.id) {
      onClose();
      navigate(`/schwimmschule/${schule.id}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <h2 className="text-lg font-semibold">Kartenansicht - Schwimmkurse in der Nähe</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Map container */}
      <div className="relative flex-1 h-full">
        {/* Loading/Fallback message */}
        {isLoadingMap && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
            <div className="text-center p-8">
              <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Karte wird geladen...
              </h3>
              <p className="text-gray-500 text-sm">
                Die interaktive Karte wird geladen, bitte warten Sie einen Moment.
              </p>
            </div>
          </div>
        )}
        
        {/* Leaflet Map container */}
        <div 
          ref={mapContainer} 
          className="absolute inset-0 z-0"
          style={{ height: '100%', width: '100%' }}
        />

        {/* Selected school info card */}
        {selectedSchule && (
          <div className="absolute bottom-4 left-4 right-4 md:left-auto md:w-80 z-20">
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

export default LeafletMap;
