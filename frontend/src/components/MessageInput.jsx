import { useState, useEffect } from "react";

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
    if (sentence.length === 0) {
      setRecommended([]);
      return;
    }

    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
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
    <div className="message-input-container">
      {/* Current message being composed */}
      <div className="compose-area">
        <h3 className="section-title">Componer Mensaje</h3>
        <div className="sentence-strip">
          {sentence.length === 0 && (
            <div className="sentence-placeholder">
              Selecciona pictogramas para componer tu mensaje...
            </div>
          )}
          {sentence.map((p, idx) => (
            <div
              key={`${p.id}-${idx}`}
              className="pictogram-card"
              onClick={() => removePictogram(idx)}
              title="Clic para eliminar"
            >
              <img src={p.url || p.imagen} alt={p.palabra} />
              <span>{p.palabra}</span>
            </div>
          ))}
        </div>

        <button
          className="btn-send"
          onClick={handleSend}
          disabled={sentence.length === 0}
        >
          Enviar Mensaje
        </button>
      </div>

      {/* Recommendations */}
      {loading && (
        <div className="recommendations">
          <h4 className="section-title">Sugerencias</h4>
          <div className="loading-spinner"></div>
        </div>
      )}

      {!loading && recommended.length > 0 && (
        <div className="recommendations">
          <h4 className="section-title">Sugerencias</h4>
          <div className="pictogram-grid">
            {recommended.map(p => (
              <div
                key={p.id}
                className="pictogram-card"
                onClick={() => addPictogram(p)}
              >
                <img src={p.url} alt={p.palabra} />
                <span>{p.palabra}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pictogram Search */}
      <div className="search-section">
        <button
          className="search-toggle"
          onClick={() => setShowSearch(!showSearch)}
        >
          {showSearch ? "▼ Ocultar Buscar Pictogramas" : "▶ Buscar Pictogramas"}
        </button>

        {showSearch && (
          <div className="search-area">
            <div className="search-container">
              <input
                className="search-input"
                placeholder="Buscar pictograma..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchPictograms()}
              />
              <button className="btn-search" onClick={searchPictograms}>
                🔍 Buscar
              </button>
            </div>

            {searchResults.length > 0 && (
              <div className="pictogram-grid">
                {searchResults.map(p => (
                  <div
                    key={p.id}
                    className="pictogram-card"
                    onClick={() => {
                      addPictogram(p);
                      setSearchQuery("");
                      setSearchResults([]);
                    }}
                  >
                    <img src={p.url || p.imagen} alt={p.palabra} />
                    <span>{p.palabra}</span>
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
