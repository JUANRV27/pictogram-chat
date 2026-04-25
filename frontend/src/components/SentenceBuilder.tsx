import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Delete } from "lucide-react";

interface Pictogram {
  id: number;
  palabra: string;
  url: string;
}

export const SentenceBuilder = () => {
  const [sentence, setSentence] = useState<Pictogram[]>([]);
  const [recommendations, setRecommendations] = useState<Pictogram[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchRecommendations = async (currentSentence: Pictogram[]) => {
    setLoading(true);
    try {
      const words = currentSentence.map(p => p.palabra);
      const response = await fetch(`${import.meta.env.VITE_AI_URL}/recommend/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selected: words }),
      });
      const data = await response.json();
      setRecommendations(data.recommended);
    } catch (error) {
      toast({ title: "Error", description: "No se pudieron cargar recomendaciones", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations([]);
  }, []);

  const handleSelect = (picto: Pictogram) => {
    const newSentence = [...sentence, picto];
    setSentence(newSentence);
    fetchRecommendations(newSentence);
  };

  const handleRemoveLast = () => {
    const newSentence = sentence.slice(0, -1);
    setSentence(newSentence);
    fetchRecommendations(newSentence);
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 min-h-[150px] flex flex-wrap gap-4 items-center bg-muted/50">
        {sentence.length === 0 && <span className="text-muted-foreground">Tu oración aparecerá aquí...</span>}
        {sentence.map((p, i) => (
          <div key={i} className="flex flex-col items-center animate-in fade-in zoom-in">
            <img src={p.url} alt={p.palabra} className="w-20 h-20" />
            <span className="text-sm font-bold capitalize">{p.palabra}</span>
          </div>
        ))}
        {sentence.length > 0 && (
          <Button variant="ghost" size="icon" onClick={handleRemoveLast} className="ml-auto">
            <Delete className="w-6 h-6 text-destructive" />
          </Button>
        )}
      </Card>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Sugerencias (IA Híbrida)</h3>
        {loading ? (
          <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
            {recommendations.map((picto) => (
              <Card 
                key={picto.id} 
                className="p-2 cursor-pointer hover:bg-accent transition-colors flex flex-col items-center"
                onClick={() => handleSelect(picto)}
              >
                <img src={picto.url} alt={picto.palabra} className="w-24 h-24" />
                <span className="capitalize mt-2 font-medium">{picto.palabra}</span>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
