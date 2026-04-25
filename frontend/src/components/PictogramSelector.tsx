import { useState } from "react";

export default function PictogramSelector({ onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const API = "https://api.arasaac.org/v1/pictograms";

  const search = async () => {
    if (!query.trim()) return;
    const res = await fetch(`${API}/es/search/${query}`);
    const data = await res.json();

    const mapped = data.slice(0, 12).map(item => ({
      id: item._id,
      palabra: item.keywords?.[0]?.keyword || query,
      imagen: `${API}/${item._id}?download=false`
    }));

    setResults(mapped);
  };

  return (
    <div>
      <h2 className="section-title">Buscar pictogramas</h2>

      <div className="search-container">
        <input
          className="search-input"
          placeholder="Buscar pictograma..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
        />

        <button onClick={search}>Buscar</button>
      </div>

      <div className="pictogram-grid">
        {results.map(p => (
          <div key={p.id} className="pictogram-card" onClick={() => onSelect(p)}>
            <img src={p.imagen} alt={p.palabra} />
            <span>{p.palabra}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
