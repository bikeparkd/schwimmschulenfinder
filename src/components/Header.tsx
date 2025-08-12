
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";
import { Menu } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const { t } = useLanguage();
  
  return (
    <header className="bg-primary text-white py-3 px-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <button 
            className="mr-3 lg:hidden"
            onClick={onMenuClick}
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center">
            {/* Wave icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
              <path d="M2 12H4C8.42 12 12 15.58 12 20C12 15.58 15.58 12 20 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 7H4C8.42 7 12 10.58 12 15C12 10.58 15.58 7 20 7H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17H4C8.42 17 12 20.58 12 25C12 20.58 15.58 17 20 17H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h1 className="text-xl font-bold">{t('appName')}</h1>
          </div>
        </div>
        
        <div>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
};

export default Header;
