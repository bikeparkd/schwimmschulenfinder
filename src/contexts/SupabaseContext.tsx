
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { Course, Filter, Provider } from '@/types';
import { toast } from 'sonner';

interface SupabaseContextType {
  supabase: SupabaseClient | null;
  user: User | null;
  loading: boolean;
  courses: Course[];
  filteredCourses: Course[];
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  fetchCourses: () => Promise<void>;
  filterCourses: (filters: Filter) => void;
  currentFilter: Filter | null;
}

const defaultContext: SupabaseContextType = {
  supabase: null,
  user: null,
  loading: true,
  courses: [],
  filteredCourses: [],
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  fetchCourses: async () => {},
  filterCourses: () => {},
  currentFilter: null,
};

const SupabaseContext = createContext<SupabaseContextType>(defaultContext);

export const useSupabase = () => useContext(SupabaseContext);

interface SupabaseProviderProps {
  children: ReactNode;
}

export const SupabaseProvider = ({ children }: SupabaseProviderProps) => {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [currentFilter, setCurrentFilter] = useState<Filter | null>(null);

  // Initialize Supabase client
  useEffect(() => {
    // Normally we'd use environment variables here
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      const client = createClient(supabaseUrl, supabaseKey);
      setSupabase(client);

      const getUser = async () => {
        try {
          const { data, error } = await client.auth.getSession();
          
          if (error) {
            console.error("Error getting session:", error);
            setLoading(false);
            return;
          }
          
          if (data && data.session) {
            setUser(data.session.user);
          }
        } catch (error) {
          console.error("Failed to get user:", error);
        } finally {
          setLoading(false);
        }
      };

      getUser();
    } else {
      console.warn("Supabase URL or Key not found. Using mock data.");
      // Load mock data
      setLoading(false);
      fetchMockCourses();
    }
  }, []);

  const fetchMockCourses = () => {
    // Provide mock data similar to what's in the screenshot
    const mockCourses: Course[] = [
      {
        id: '1',
        title: 'Babyschwimmen "Wasserflöhe"',
        provider: 'schwimmschule-kaulquappen',
        providerName: 'Schwimmschule Kaulquappen',
        location: {
          city: 'Berlin',
          postalCode: '10115'
        },
        age: {
          min: 0.5,
          max: 2
        },
        level: 'Anfänger',
        price: 150.00,
        currency: '€',
        rating: 4.5,
        ratingCount: 2,
        isSponsored: true
      },
      {
        id: '2',
        title: 'Seepferdchen Kurs "Kleine Schwimmer"',
        provider: 'wasserwelt-potsdam',
        providerName: 'Wasserwelt Potsdam',
        location: {
          city: 'Potsdam',
          postalCode: '14471'
        },
        age: {
          min: 4,
          max: 6
        },
        level: 'Seepferdchen',
        price: 120.00,
        currency: '€',
        rating: 5.0,
        ratingCount: 1
      },
      {
        id: '3',
        title: 'Bronze Schwimmkurs für Fortgeschrittene',
        provider: 'aquafit-berlin',
        providerName: 'AquaFit Berlin',
        location: {
          city: 'Berlin',
          postalCode: '12555'
        },
        age: {
          min: 7,
          max: 10
        },
        level: 'Bronze',
        price: 180.00,
        currency: '€',
        rating: 4.5,
        ratingCount: 2
      }
    ];

    setCourses(mockCourses);
    setFilteredCourses(mockCourses);
  };

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      toast("Supabase not initialized");
      return;
    }
    
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      setUser(data.user);
      toast("Login successful!");
    } catch (error: any) {
      toast(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    if (!supabase) {
      toast("Supabase not initialized");
      return;
    }
    
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      
      if (error) throw error;
      
      toast("Registration successful! Check your email for confirmation.");
    } catch (error: any) {
      toast(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    if (!supabase) {
      toast("Supabase not initialized");
      return;
    }
    
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      toast("Logout successful!");
    } catch (error: any) {
      toast(error.message || "Logout failed");
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    if (!supabase) {
      fetchMockCourses();
      return;
    }
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('courses')
        .select('*');
        
      if (error) throw error;
      
      if (data) {
        setCourses(data as Course[]);
        setFilteredCourses(data as Course[]);
      }
    } catch (error: any) {
      toast(error.message || "Failed to fetch courses");
      fetchMockCourses();
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = (filters: Filter) => {
    setCurrentFilter(filters);
    
    let filtered = [...courses];
    
    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(searchTerm) || 
        course.provider.toLowerCase().includes(searchTerm) ||
        (course.description && course.description.toLowerCase().includes(searchTerm))
      );
    }
    
    // Apply location filter
    if (filters.location) {
      const locationTerm = filters.location.toLowerCase();
      filtered = filtered.filter(course => 
        course.location.city.toLowerCase().includes(locationTerm) || 
        course.location.postalCode.includes(locationTerm)
      );
    }
    
    setFilteredCourses(filtered);
  };

  return (
    <SupabaseContext.Provider
      value={{
        supabase,
        user,
        loading,
        courses,
        filteredCourses,
        signIn,
        signUp,
        signOut,
        fetchCourses,
        filterCourses,
        currentFilter
      }}
    >
      {children}
    </SupabaseContext.Provider>
  );
};
