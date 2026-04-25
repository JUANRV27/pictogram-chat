import { SentenceBuilder } from "@/components/SentenceBuilder";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Builder = () => {
  const navigate = useNavigate();
  return (
    <div className="container mx-auto p-4">
      <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Volver
      </Button>
      <h1 className="text-3xl font-bold mb-6 text-center gradient-primary bg-clip-text text-transparent">
        Constructor de Oraciones
      </h1>
      <SentenceBuilder />
    </div>
  );
};

export default Builder;
