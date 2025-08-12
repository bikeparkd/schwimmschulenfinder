import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  Heart
} from "lucide-react";

const AppFooter = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Plattform",
      links: [
        { label: "Schwimmschulen finden", href: "/schwimmschulen" },
        { label: "Schule registrieren", href: "/registrierung" },
        { label: "Mobile App", href: "#" },
        { label: "API", href: "#" }
      ]
    },
    {
      title: "Support",
      links: [
        { label: "Hilfe-Center", href: "#" },
        { label: "Kontakt", href: "#" },
        { label: "FAQ", href: "#" },
        { label: "Live Chat", href: "#" }
      ]
    },
    {
      title: "Unternehmen",
      links: [
        { label: "Über uns", href: "#" },
        { label: "Karriere", href: "#" },
        { label: "Presse", href: "#" },
        { label: "Partner", href: "#" }
      ]
    },
    {
      title: "Rechtliches",
      links: [
        { label: "Datenschutz", href: "#" },
        { label: "AGB", href: "#" },
        { label: "Impressum", href: "#" },
        { label: "Cookies", href: "#" }
      ]
    }
  ];

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com/swimfind", label: "Facebook" },
    { icon: Twitter, href: "https://twitter.com/swimfind", label: "Twitter" },
    { icon: Instagram, href: "https://instagram.com/swimfind", label: "Instagram" },
    { icon: Youtube, href: "https://youtube.com/swimfind", label: "YouTube" }
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Bleiben Sie informiert
            </h3>
            <p className="text-gray-400 mb-6">
              Erhalten Sie die neuesten Schwimmkurs-Angebote und Tipps direkt in Ihr Postfach
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Ihre E-Mail-Adresse"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500"
              />
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 whitespace-nowrap">
                <Mail className="mr-2 h-4 w-4" />
                Anmelden
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold text-white">
                SwimFind
              </span>
            </Link>
            
            <p className="text-gray-400 mb-6 leading-relaxed">
              Deutschlands führende Plattform für Schwimmkurse. Wir verbinden Schwimmschüler mit den besten zertifizierten Schwimmschulen in ihrer Nähe.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-blue-400" />
                <span className="text-sm">info@swimfind.de</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-blue-400" />
                <span className="text-sm">+49 (0) 800 123 4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-blue-400" />
                <span className="text-sm">Berlin, Deutschland</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index} className="lg:col-span-1">
              <h4 className="text-white font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-1 text-sm text-gray-400">
              <span>© {currentYear} SwimFind. Entwickelt mit</span>
              <Heart className="h-4 w-4 text-red-500" />
              <span>in Deutschland.</span>
            </div>
            
            <div className="flex items-center space-x-4">
              {socialLinks.map((social, index) => (
                <Link
                  key={index}
                  to={social.href}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;