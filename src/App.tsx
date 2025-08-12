
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { SupabaseProvider } from "@/contexts/SupabaseContext";
import Homepage from "./pages/Homepage";
import SchwimmschuleList from "./pages/SchwimmschuleList";
import SchwimmschuleDetail from "./pages/SchwimmschuleDetail";
import RegisterSchwimmschule from "./pages/RegisterSchwimmschule";
import CourseList from "./pages/CourseList";
import NotFound from "./pages/NotFound";
import LocationSchwimmschulen from "./pages/LocationSchwimmschulen";
import AppHeader from "./components/AppHeader";
import AppFooter from "./components/AppFooter";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <SupabaseProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <div className="min-h-screen flex flex-col">
              <AppHeader />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Homepage />} />
                  
                  {/* SEO-optimized URL structure */}
                  <Route path="/schwimmkurs" element={<LocationSchwimmschulen />} />
                  <Route path="/schwimmkurs/:stadt" element={<LocationSchwimmschulen />} />
                  <Route path="/schwimmschule" element={<LocationSchwimmschulen />} />
                  <Route path="/schwimmschule/:stadt" element={<LocationSchwimmschulen />} />
                  <Route path="/babyschwimmen" element={<LocationSchwimmschulen />} />
                  <Route path="/babyschwimmen/:stadt" element={<LocationSchwimmschulen />} />
                  <Route path="/kinderkurse" element={<LocationSchwimmschulen />} />
                  <Route path="/kinderkurse/:stadt" element={<LocationSchwimmschulen />} />
                  <Route path="/anfaengerkurs" element={<LocationSchwimmschulen />} />
                  <Route path="/anfaengerkurs/:stadt" element={<LocationSchwimmschulen />} />
                  
                  {/* Combined targeting: location + audience */}
                  <Route path="/schwimmkurs/:stadt-:zielgruppe" element={<LocationSchwimmschulen />} />
                  <Route path="/schwimmschule/:stadt-:zielgruppe" element={<LocationSchwimmschulen />} />
                  
                  {/* Legacy and detail routes */}
                  <Route path="/schwimmschulen" element={<SchwimmschuleList />} />
                  <Route path="/anbieter/:id" element={<SchwimmschuleDetail />} />
                  <Route path="/schwimmschule/:id/courses" element={<CourseList />} />
                  <Route path="/registrierung" element={<RegisterSchwimmschule />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <AppFooter />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </SupabaseProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
