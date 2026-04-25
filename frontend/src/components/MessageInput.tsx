import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Search, ChevronDown, ChevronUp, Sparkles } from "lucide-react";

export default function MessageInput({ onSend, recommendationApi }) {
  const [sentence, setSentence] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(false);

  // Search functionality
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const API = "https://api.arasaac.org/v1/pictograms";

  // Fetch recommendations when sentence changes
  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        const BACKEND_URL = import.meta.env.VITE_AI_URL || import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "http://localhost:8000";
        const res = await fetch(`${BACKEND_URL}/recommend`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            selected: sentence.map(s => s.palabra)
          })
        });

        const data = await res.json();
        if (data.recommended) {
          setRecommended(
            data.recommended.map(r => ({
              id: r.id,
              palabra: r.palabra,
              url: r.url
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [sentence]);

  const addPictogram = (picto) => {
    setSentence(prev => [...prev, picto]);
  };

  const removePictogram = (index) => {
    const newSentence = [...sentence];
    newSentence.splice(index, 1);
    setSentence(newSentence);
  };

  const handleSend = () => {
    if (sentence.length > 0) {
      onSend(sentence);
      setSentence([]);
      setRecommended([]);
    }
  };

  const searchPictograms = async () => {
    if (!searchQuery.trim()) return;

    try {
      const res = await fetch(`${API}/es/search/${searchQuery}`);
      const data = await res.json();

      const mapped = data.slice(0, 12).map(item => ({
        id: item._id,
        palabra: item.keywords?.[0]?.keyword || searchQuery,
        url: `${API}/${item._id}?download=false`,
        imagen: `${API}/${item._id}?download=false`
      }));

      setSearchResults(mapped);
    } catch (error) {
      console.error("Error searching pictograms:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Current message being composed */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
            Componer Mensaje
          </h3>
        </div>
        <div className="glass rounded-xl p-3 sm:p-4 min-h-[100px] flex flex-wrap items-center gap-2 border-2 border-primary/20 shadow-inner bg-background/50">
          {sentence.length === 0 && (
            <div className="text-muted-foreground italic text-center w-full opacity-70">
              Selecciona pictogramas para componer tu mensaje...
            </div>
          )}
          {sentence.map((p, idx) => (
            <div
              key={`${p.id}-${idx}`}
              className="bg-card border border-primary/30 rounded-lg p-2 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-destructive hover:bg-destructive/10 hover:shadow-md transition-all shadow-sm w-[80px] h-[80px] sm:w-[90px] sm:h-[90px] animate-fade-in group relative"
              onClick={() => removePictogram(idx)}
              title="Clic para eliminar"
            >
              <div className="absolute inset-0 bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center z-10">
                <span className="text-destructive font-bold text-xl drop-shadow-md">X</span>
              </div>
              <img src={p.url || p.imagen} alt={p.palabra} className="w-[45px] h-[45px] sm:w-[50px] sm:h-[50px] object-contain group-hover:opacity-50 transition-opacity" />
              <span className="text-xs font-semibold text-center leading-tight truncate w-full group-hover:opacity-50 transition-opacity">{p.palabra}</span>
            </div>
          ))}
        </div>

        <Button
          onClick={handleSend}
          disabled={sentence.length === 0}
          className="w-full mt-2 h-12 text-lg font-bold shadow-lg hover-lift bg-gradient-to-r from-primary to-secondary text-white border-0"
        >
          <Send className="w-5 h-5 mr-2" />
          Enviar Mensaje
        </Button>
      </div>

      {/* Recommendations */}
      <div className="flex flex-col gap-2 pt-2 border-t border-border/50">
        {(loading || recommended.length > 0) && (
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-primary" /> Sugerencias IA
          </h4>
        )}

        {loading && (
          <div className="flex justify-center p-4">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          </div>
        )}

        {!loading && recommended.length > 0 && (
          <div className="flex overflow-x-auto gap-2 pb-2 snap-x">
            {recommended.map(p => (
              <div
                key={p.id}
                className="snap-start flex-shrink-0 bg-card border border-border/50 hover:border-primary/50 hover:shadow-md rounded-lg p-2 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all w-[70px] h-[70px] sm:w-[80px] sm:h-[80px] hover:-translate-y-1"
                onClick={() => addPictogram(p)}
              >
                <img src={p.url} alt={p.palabra} className="w-[35px] h-[35px] sm:w-[40px] sm:h-[40px] object-contain" />
                <span className="text-[10px] sm:text-xs font-semibold text-center leading-tight truncate w-full">{p.palabra}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pictogram Search */}
      <div className="pt-2 border-t border-border/50">
        <Button
          variant="ghost"
          onClick={() => setShowSearch(!showSearch)}
          className="w-full flex justify-between items-center text-muted-foreground hover:text-foreground"
        >
          <span className="flex items-center gap-2"><Search className="w-4 h-4" /> Buscar Pictogramas</span>
          {showSearch ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>

        {showSearch && (
          <div className="mt-4 flex flex-col gap-4 animate-fade-in">
            <div className="flex gap-2">
              <Input
                placeholder="Ej. perro, casa, comer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchPictograms()}
                className="flex-1 bg-background/50 border-primary/20 focus-visible:ring-primary"
              />
              <Button onClick={searchPictograms} className="bg-primary hover:bg-primary/90 hover-lift">
                <Search className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Buscar</span>
              </Button>
            </div>

            {searchResults.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 max-h-[200px] overflow-y-auto pr-1">
                {searchResults.map(p => (
                  <div
                    key={p.id}
                    className="bg-card border border-border/50 hover:border-primary/50 hover:shadow-md rounded-lg p-2 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all hover:-translate-y-1"
                    onClick={() => {
                      addPictogram(p);
                      setSearchQuery("");
                      setSearchResults([]);
                      setShowSearch(false);
                    }}
                  >
                    <img src={p.url || p.imagen} alt={p.palabra} className="w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] object-contain" />
                    <span className="text-[10px] sm:text-xs font-semibold text-center leading-tight truncate w-full">{p.palabra}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
