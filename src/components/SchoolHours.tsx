
import { Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface SchoolHoursProps {
  hours: any;
}

const SchoolHours = ({ hours }: SchoolHoursProps) => {
  const { t } = useLanguage();

  // Parse hours data from database
  const parseHours = (hoursData: any) => {
    if (typeof hoursData === 'string') {
      try {
        return JSON.parse(hoursData);
      } catch {
        return null;
      }
    }
    return hoursData;
  };

  const parsedHours = parseHours(hours);

  // Helper function to render hours in correct weekday order
  const renderOrderedHours = (hoursData: any) => {
    if (!hoursData || !Array.isArray(hoursData)) return null;
    
    console.log("Hours data from database:", hoursData);
    
    // Weekday order and translations
    const weekdayOrder = [
      { key: 'montag', label: { de: 'Mo', en: 'Mon' } },
      { key: 'dienstag', label: { de: 'Di', en: 'Tue' } },
      { key: 'mittwoch', label: { de: 'Mi', en: 'Wed' } },
      { key: 'donnerstag', label: { de: 'Do', en: 'Thu' } },
      { key: 'freitag', label: { de: 'Fr', en: 'Fri' } },
      { key: 'samstag', label: { de: 'Sa', en: 'Sat' } },
      { key: 'sonntag', label: { de: 'So', en: 'Sun' } }
    ];

    // Get current day to highlight it
    const today = new Date().getDay();
    const todayIndex = today === 0 ? 6 : today - 1; // Convert Sunday=0 to Monday=0 system

    // Create a map from the database data
    const hoursMap: { [key: string]: string[] } = {};
    hoursData.forEach((dayData: any) => {
      if (dayData.day && dayData.times) {
        const dayKey = dayData.day.toLowerCase();
        hoursMap[dayKey] = Array.isArray(dayData.times) ? dayData.times : [dayData.times];
      }
    });

    const { language } = useLanguage();
    const closedText = language === 'de' ? 'Geschlossen' : 'Closed';

    return (
      <div className="grid grid-cols-1 gap-y-1 text-xs">
        {weekdayOrder.map(({ key, label }, index) => {
          const dayTimes = hoursMap[key];
          const isToday = index === todayIndex;
          
          let timeString = closedText;
          if (dayTimes && dayTimes.length > 0) {
            timeString = dayTimes.join(', ');
          }

          return (
            <div key={key} className={`flex justify-between text-xs ${isToday ? 'font-medium text-blue-600' : 'text-gray-600'}`}>
              <span className="font-medium min-w-[32px]">{label[language as keyof typeof label]}:</span>
              <span className="flex-1 text-right">{timeString}</span>
            </div>
          );
        })}
      </div>
    );
  };

  if (!parsedHours) return null;

  return (
    <div className="mb-4">
      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
        <Clock className="h-4 w-4" />
        {t('openingHours')}:
      </h4>
      <div className="bg-gray-50 rounded-lg p-3">
        {renderOrderedHours(parsedHours)}
      </div>
    </div>
  );
};

export default SchoolHours;
