
import { Badge } from "@/components/ui/badge";
import { Settings } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface SchoolFeaturesProps {
  features: string[];
}

const SchoolFeatures = ({ features }: SchoolFeaturesProps) => {
  const { t } = useLanguage();

  if (!features || features.length === 0) return null;

  return (
    <div className="mb-4">
      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
        <Settings className="h-4 w-4" />
        {t('features')}:
      </h4>
      <div className="bg-gray-50 rounded-lg p-3">
        <div className="flex flex-wrap gap-2">
          {features.slice(0, 6).map((feature: string, index: number) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {feature}
            </Badge>
          ))}
          {features.length > 6 && (
            <Badge variant="outline" className="text-xs">
              +{features.length - 6}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchoolFeatures;
