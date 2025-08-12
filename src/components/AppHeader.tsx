import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Search, MapPin, Phone, User } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";

const AppHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { href: "/", label: "Startseite" },
    { href: "/schwimmschulen", label: "Schwimmschulen finden" },
    { href: "/registrierung", label: "Schule registrieren" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              SwimFind
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSwitcher />
            
            <Button
              variant="outline"
              size="sm"
              className="border-blue-200 text-blue-600 hover:bg-blue-50"
              onClick={() => navigate('/schwimmschulen')}
            >
              <Search className="mr-2 h-4 w-4" />
              Suchen
            </Button>
            
            <Button
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700"
              onClick={() => navigate('/registrierung')}
            >
              <User className="mr-2 h-4 w-4" />
              Registrieren
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center space-x-2">
            <LanguageSwitcher />
            
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menü öffnen</span>
                </Button>
              </SheetTrigger>
              
              <SheetContent side="right" className="w-[300px]">
                <div className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="text-gray-600 hover:text-blue-600 font-medium py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                  
                  <div className="border-t pt-4 space-y-3">
                    <Button
                      variant="outline"
                      className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
                      onClick={() => {
                        navigate('/schwimmschulen');
                        setIsOpen(false);
                      }}
                    >
                      <Search className="mr-2 h-4 w-4" />
                      Schwimmschule suchen
                    </Button>
                    
                    <Button
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700"
                      onClick={() => {
                        navigate('/registrierung');
                        setIsOpen(false);
                      }}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Schule registrieren
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;