import { useState, useEffect } from "react";
import PictogramSelector from "./components/PictogramSelector";
import SentenceBuilder from "./components/SentenceBuilder";
import RecommendedPictograms from "./components/RecommendedPictograms";
import "./App.css";

export default function App() {
  const [sentence, setSentence] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(false);

  const API = "http://localhost:8000";

  // Se llama automáticamente cuando cambia la oración
  useEffect(() => {
    console.log("useEffect triggered, sentence:", sentence);
    if (sentence.length === 0) {
      setRecommended([]);
      return;
    }

    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API}/recommend`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            selected: sentence.map(s => s.palabra)   // tu backend recibe esto
          })
        });

        const data = await res.json();
        console.log("RESPONSE FROM BACKEND:", data);

        // ❗️ EL CAMPO CORRECTO ES "recommended"
        if (data.recommended) {
          setRecommended(
            data.recommended.map(r => ({
              id: r.id,
              palabra: r.palabra,
              url: r.url   // 📌 este es el nombre que devuelve tu backend
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

  const addPictogram = (p) => {
    setSentence(prev => [...prev, p]);
  };

  const removePictogram = (index) => {
    const newSentence = [...sentence];
    newSentence.splice(index, 1);
    setSentence(newSentence);
  };

  return (
    <div className="app-container">
      <div className="app-header">
        <h1>Pictogram Chat</h1>
      </div>

      <SentenceBuilder sentence={sentence} onRemove={removePictogram} />

      <RecommendedPictograms recommended={recommended} onSelect={addPictogram} loading={loading} />

      <PictogramSelector onSelect={addPictogram} />
    </div>
  );
}
