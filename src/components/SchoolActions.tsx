
import { Button } from "@/components/ui/button";
import { Phone, Globe } from "lucide-react";

interface SchoolActionsProps {
  phone?: string;
  website?: string;
  onDetailsClick: () => void;
  onPhoneClick: () => void;
}

const SchoolActions = ({ phone, website, onDetailsClick, onPhoneClick }: SchoolActionsProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t">
      <div className="flex flex-wrap gap-2">
        {phone && (
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={onPhoneClick}
          >
            <Phone className="h-4 w-4" />
            Anrufen
          </Button>
        )}
        
        {website && (
          <Button variant="outline" size="sm" className="flex items-center gap-2" asChild>
            <a href={website} target="_blank" rel="noopener noreferrer">
              <Globe className="h-4 w-4" />
              Website
            </a>
          </Button>
        )}
      </div>
      
      <Button 
        className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
        onClick={onDetailsClick}
      >
        Details anzeigen
      </Button>
    </div>
  );
};

export default SchoolActions;
