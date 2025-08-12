
/// <reference types="vite/client" />

declare global {
  interface Window {
    google: typeof google;
  }
}

declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: HTMLElement, opts?: MapOptions);
      setOptions(options: MapOptions): void;
      setCenter(latlng: LatLng | LatLngLiteral): void;
      getCenter(): LatLng;
      setZoom(zoom: number): void;
      getZoom(): number;
      fitBounds(bounds: LatLngBounds): void;
      addListener(eventName: string, handler: () => void): void;
    }

    interface MapOptions {
      center?: LatLng | LatLngLiteral;
      zoom?: number;
      styles?: MapTypeStyle[];
      mapTypeControl?: boolean;
      streetViewControl?: boolean;
      fullscreenControl?: boolean;
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    class LatLng {
      constructor(lat: number, lng: number);
      lat(): number;
      lng(): number;
    }

    class LatLngBounds {
      constructor();
      extend(point: LatLng | LatLngLiteral): void;
    }

    class Marker {
      constructor(opts?: MarkerOptions);
      setPosition(latlng: LatLng | LatLngLiteral): void;
      setMap(map: Map | null): void;
      addListener(eventName: string, handler: () => void): void;
    }

    interface MarkerOptions {
      position?: LatLng | LatLngLiteral;
      map?: Map;
      title?: string;
      icon?: string | Icon | Symbol;
      zIndex?: number;
    }

    interface Icon {
      url: string;
      scaledSize?: Size;
      anchor?: Point;
      path?: string;
    }

    interface Symbol {
      path: string | SymbolPath;
      scale?: number;
      fillColor?: string;
      fillOpacity?: number;
      strokeColor?: string;
      strokeWeight?: number;
    }

    enum SymbolPath {
      CIRCLE = 0,
      FORWARD_CLOSED_ARROW = 1,
      FORWARD_OPEN_ARROW = 2,
      BACKWARD_CLOSED_ARROW = 3,
      BACKWARD_OPEN_ARROW = 4
    }

    class Size {
      constructor(width: number, height: number);
    }

    class Point {
      constructor(x: number, y: number);
    }

    interface MapTypeStyle {
      featureType?: string;
      elementType?: string;
      stylers?: Array<{ [key: string]: any }>;
    }

    namespace event {
      function addListener(instance: any, eventName: string, handler: () => void): any;
      function removeListener(listener: any): void;
    }
  }
}
