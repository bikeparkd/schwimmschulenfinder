
import { LanguageProvider } from "@/contexts/LanguageContext";
import { SupabaseProvider } from "@/contexts/SupabaseContext";
import SchwimmschuleList from "./SchwimmschuleList";

const Index = () => {
  return (
    <LanguageProvider>
      <SupabaseProvider>
        <SchwimmschuleList />
      </SupabaseProvider>
    </LanguageProvider>
  );
};

export default Index;
