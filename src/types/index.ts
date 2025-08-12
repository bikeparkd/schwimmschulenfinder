
export type Language = 'de' | 'en' | 'es' | 'it' | 'fr';

export interface Course {
  id: string;
  title: string;
  description?: string;
  provider: string;
  providerName: string;
  location: {
    city: string;
    postalCode: string;
    address?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  age: {
    min: number;
    max: number;
  };
  level: string;
  price: number;
  currency: string;
  rating: number;
  ratingCount: number;
  isSponsored?: boolean;
  images?: string[];
  startDate?: string;
  endDate?: string;
  schedule?: string[];
  duration?: number; // in minutes
  poolDetails?: {
    temperature?: number;
    depth?: string;
    facilities?: string[];
  };
  equipment?: string[];
  teacherDetails?: {
    name?: string;
    qualifications?: string[];
    photo?: string;
  };
  isFull?: boolean;
  hasWaitingList?: boolean;
  cancellationPolicy?: string;
  trialAvailable?: boolean;
}

export interface Filter {
  search: string;
  location: string;
  radius?: number;
  minRating?: number;
  minReviews?: number;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'parent' | 'provider' | 'admin';
  favorites?: string[];
}

export interface Provider {
  id: string;
  name: string;
  description?: string;
  contactInfo: {
    email: string;
    phone?: string;
    website?: string;
  };
  verified: boolean;
  locations?: {
    address: string;
    city: string;
    postalCode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  }[];
  qualifications?: string[];
  photos?: string[];
  courses?: string[];
  rating?: number;
  ratingCount?: number;
}

// Schwimmschule interface
export interface Schwimmschule {
  id?: string;
  name: string;
  website?: string;
  rating?: string;
  reviews?: string;
  phone?: string;
  hours?: any; // Can be string (JSON) or parsed object
  detailed_address?: any; // Can be string (JSON) or parsed object
  address?: string;
  google_maps_url?: string;
  about?: any; // Can be string (JSON) or parsed object
  featured_reviews?: any; // Can be string (JSON) or parsed object
  detailed_reviews?: any; // Can be string (JSON) or parsed object
  featured_image?: string;
  distance_km?: number; // Add distance field for radius search results
  coordinates?: any; // Add coordinates field to match database schema
  // Additional fields from imported data
  main_category?: string;
  categories?: string;
  city?: string;
  zip?: string;
  street?: string;
  workday_timing?: string;
  is_temporarily_closed?: boolean;
  owner_name?: string;
}

// Coordinates interface for geolocation
export interface Coordinates {
  latitude: number;
  longitude: number;
}
