
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter as FilterIcon, X, Map } from "lucide-react";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onFilterToggle: () => void;
  onMapOpen: () => void;
}

const SearchBar = ({ searchTerm, onSearchChange, onFilterToggle, onMapOpen }: SearchBarProps) => {
  const resetSearch = () => {
    onSearchChange("");
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-6">
      <div className="relative flex-grow">
        <Search className="absolute left-2.5 top-2.5 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Schwimmkurse in der Nähe suchen - Namen, PLZ oder Ort eingeben..."
          className="pl-10 pr-10"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Schwimmkurse in der Nähe suchen"
        />
        {searchTerm && (
          <button 
            className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
            onClick={resetSearch}
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={onFilterToggle}
        >
          <FilterIcon className="h-5 w-5" />
          <span className="hidden sm:inline">Filter</span>
        </Button>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={onMapOpen}
        >
          <Map className="h-5 w-5" />
          <span className="hidden sm:inline">Karte</span>
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
