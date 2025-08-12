
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const RegistrationButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => navigate('/register-schwimmschule')}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
    >
      <Plus className="h-4 w-4" />
      <span className="hidden sm:inline">Schwimmschule eintragen</span>
      <span className="sm:hidden">Eintragen</span>
    </Button>
  );
};

export default RegistrationButton;
