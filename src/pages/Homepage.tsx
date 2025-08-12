import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  MapPin, 
  Star, 
  Users, 
  Shield, 
  Clock,
  TrendingUp,
  Award,
  ArrowRight,
  Check,
  Play
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Homepage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const features = [
    {
      icon: Search,
      title: "Smart-Suche",
      description: "Finden Sie mit unserer intelligenten Suche die perfekte Schwimmschule in Ihrer Nähe"
    },
    {
      icon: MapPin,
      title: "Standort-basiert",
      description: "Entfernung und Erreichbarkeit werden automatisch für Sie berechnet"
    },
    {
      icon: Star,
      title: "Echte Bewertungen",
      description: "Über 10.000 verifizierte Bewertungen von echten Kunden"
    },
    {
      icon: Shield,
      title: "Geprüfte Schulen",
      description: "Alle Schwimmschulen sind zertifiziert und regelmäßig überprüft"
    }
  ];

  const stats = [
    { number: "500+", label: "Schwimmschulen", icon: TrendingUp },
    { number: "50.000+", label: "Zufriedene Kunden", icon: Users },
    { number: "98%", label: "Erfolgsquote", icon: Award },
    { number: "24/7", label: "Support", icon: Clock }
  ];

  const benefits = [
    "Kostenloser Vergleich aller Anbieter",
    "Direkter Kontakt zu Schwimmschulen", 
    "Flexible Terminbuchung online",
    "Geld-zurück-Garantie bei Unzufriedenheit",
    "Persönliche Beratung durch Experten",
    "Mobile App für unterwegs"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
              🏆 #1 Plattform für Schwimmkurse in Deutschland
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Schwimmkurse in der Nähe
              </span>
              <br />
              <span className="text-2xl md:text-4xl lg:text-5xl font-medium text-blue-100">
                einfach finden & buchen
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-10 text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Entdecken Sie über 500 zertifizierte Schwimmschulen mit echten Bewertungen. 
              Kostenloser Vergleich, sofortige Verfügbarkeit, persönliche Beratung.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-6 text-lg rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                onClick={() => navigate('/schwimmschulen')}
              >
                <Search className="mr-2 h-5 w-5" />
                Jetzt Schwimmkurs finden
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-6 text-lg rounded-full backdrop-blur-sm"
              >
                <Play className="mr-2 h-5 w-5" />
                Demo ansehen
              </Button>
            </div>
            
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                    {stat.number}
                  </div>
                  <div className="text-blue-100 text-sm">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Wave Decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Warum SwimFind die beste Wahl ist
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Wir revolutionieren die Art, wie Sie Schwimmkurse finden und buchen
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-gray-50">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">
                  ✨ Premium-Service
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Alles was Sie brauchen, an einem Ort
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Von der Suche bis zur Buchung - wir begleiten Sie durch den gesamten Prozess und sorgen für das beste Schwimmkurs-Erlebnis.
                </p>
                
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="text-gray-700 font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
                
                <Button 
                  className="mt-8 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold px-8 py-3 rounded-full hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  onClick={() => navigate('/schwimmschulen')}
                >
                  Kostenlos starten
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
              
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl p-8 text-white shadow-2xl">
                  <h3 className="text-2xl font-bold mb-6">Schwimmkurs in 3 Schritten</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">1</div>
                      <div>
                        <div className="font-semibold">Standort eingeben</div>
                        <div className="text-blue-100 text-sm">PLZ oder Ort für lokale Suche</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">2</div>
                      <div>
                        <div className="font-semibold">Schulen vergleichen</div>
                        <div className="text-blue-100 text-sm">Bewertungen, Preise und Angebote</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">3</div>
                      <div>
                        <div className="font-semibold">Direkt buchen</div>
                        <div className="text-blue-100 text-sm">Online oder telefonisch kontaktieren</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Bereit für Ihren Schwimmkurs?
          </h2>
          <p className="text-xl mb-10 text-blue-100 max-w-2xl mx-auto">
            Schließen Sie sich über 50.000 zufriedenen Kunden an und finden Sie noch heute den perfekten Schwimmkurs.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-6 text-lg rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              onClick={() => navigate('/schwimmschulen')}
            >
              <Search className="mr-2 h-5 w-5" />
              Schwimmkurs finden
            </Button>
            
            <Button 
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-6 text-lg rounded-full backdrop-blur-sm"
              onClick={() => navigate('/registrierung')}
            >
              Schwimmschule registrieren
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;