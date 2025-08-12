
import { useState, useEffect } from "react";
import { Filter } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSupabase } from "@/contexts/SupabaseContext";
import { 
  Filter as FilterIcon, 
  Search as SearchIcon,
  Star,
  MessageCircle,
  X,
  Navigation
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FilterSidebarProps {
  onFilterChange: (filters: Filter) => void;
  isOpen: boolean;
  onClose: () => void;
}

const FilterSidebar = ({ onFilterChange, isOpen, onClose }: FilterSidebarProps) => {
  const { t } = useLanguage();
  const { currentFilter } = useSupabase();
  
  const [search, setSearch] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [radius, setRadius] = useState<number>(25);
  const [minRating, setMinRating] = useState<number>(0);
  const [minReviews, setMinReviews] = useState<number>(0);
  
  // Radius options in kilometers
  const radiusOptions = [5, 10, 25, 50];

  // Initialize filters from currentFilter if available
  useEffect(() => {
    if (currentFilter) {
      setSearch(currentFilter.search);
      setLocation(currentFilter.location);
      setRadius(currentFilter.radius || 25);
      setMinRating(currentFilter.minRating || 0);
      setMinReviews(currentFilter.minReviews || 0);
    }
  }, [currentFilter]);

  // Apply filters whenever they change
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      const newFilters: Filter = {
        search,
        location,
        radius,
        minRating,
        minReviews
      };
      
      onFilterChange(newFilters);
    }, 500);
    
    return () => clearTimeout(debounceTimeout);
  }, [search, location, radius, minRating, minReviews, onFilterChange]);
  
  // Reset all filters
  const resetFilters = () => {
    setSearch("");
    setLocation("");
    setRadius(25);
    setMinRating(0);
    setMinReviews(0);
  };

  // Display active filter badges
  const getActiveFilters = () => {
    const filters = [];
    
    if (search) filters.push({ label: `${t('search')}: ${search}`, key: 'search' });
    if (location) filters.push({ label: `${t('location')}: ${location} (${radius} km)`, key: 'location' });
    if (minRating > 0) filters.push({ label: `${t('minRating')}: ${minRating}+`, key: 'rating' });
    if (minReviews > 0) filters.push({ label: `${t('minReviews')}: ${minReviews}+`, key: 'reviews' });
    
    return filters;
  };
  
  const activeFilters = getActiveFilters();

  return (
    <div className={`fixed lg:static top-0 left-0 h-full bg-white shadow-lg z-50 ${isOpen ? "block" : "hidden lg:block"} overflow-auto w-full max-w-[350px] lg:h-auto lg:max-h-screen`}>
      <div className="p-4 border-b lg:sticky lg:top-0 bg-white z-10 flex justify-between items-center">
        <div className="flex items-center">
          <FilterIcon className="mr-2 text-primary" size={20} />
          <h2 className="text-lg font-medium">{t('filter')}</h2>
        </div>
        <div className="flex gap-2">
          {activeFilters.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resetFilters}
              className="text-xs"
            >
              {t('reset')}
            </Button>
          )}
          <button 
            className="lg:hidden text-gray-500 hover:text-gray-800"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>
      </div>
      
      {/* Active filter display */}
      {activeFilters.length > 0 && (
        <div className="p-4 border-b">
          <div className="flex flex-wrap gap-2">
            {activeFilters.map(filter => (
              <Badge key={filter.key} variant="outline" className="py-1 px-2">
                {filter.label}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      <div className="p-4">
        {/* Keyword Search */}
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <SearchIcon size={16} className="mr-2 text-gray-500" />
            <h3 className="font-medium">{t('keywordSearch')}</h3>
          </div>
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full"
          />
        </div>
        
        {/* Location/ZIP Search with Radius */}
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <Navigation size={16} className="mr-2 text-gray-500" />
            <h3 className="font-medium">PLZ oder Ort</h3>
          </div>
          <div className="space-y-3">
            <Input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="z.B. 10115 oder Berlin"
              className="w-full"
            />
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Umkreis: {radius} km
              </label>
              <Select value={radius.toString()} onValueChange={(value) => setRadius(parseInt(value))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Radius wählen" />
                </SelectTrigger>
                <SelectContent>
                  {radiusOptions.map(option => (
                    <SelectItem key={option} value={option.toString()}>
                      {option} km
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Minimum Rating */}
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <Star size={16} className="mr-2 text-gray-500" />
            <h3 className="font-medium flex justify-between w-full">
              <span>{t('minRating')}</span>
              <span className="text-sm text-gray-500">{minRating}+ {t('stars')}</span>
            </h3>
          </div>
          <div className="flex items-center">
            <span className="w-5 text-xs">0</span>
            <input
              type="range"
              min={0}
              max={5}
              step={0.5}
              value={minRating}
              onChange={(e) => setMinRating(parseFloat(e.target.value))}
              className="w-full mx-2"
            />
            <span className="w-5 text-xs">5</span>
          </div>
        </div>
        
        {/* Minimum Reviews */}
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <MessageCircle size={16} className="mr-2 text-gray-500" />
            <h3 className="font-medium flex justify-between w-full">
              <span>{t('minReviews')}</span>
              <span className="text-sm text-gray-500">{minReviews}+ {t('reviews')}</span>
            </h3>
          </div>
          <div className="flex items-center">
            <span className="w-5 text-xs">0</span>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={minReviews}
              onChange={(e) => setMinReviews(parseInt(e.target.value))}
              className="w-full mx-2"
            />
            <span className="w-8 text-xs">100+</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
