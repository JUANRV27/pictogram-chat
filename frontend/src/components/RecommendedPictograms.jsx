export default function RecommendedPictograms({ recommended, onSelect, loading }) {
  if (loading) {
    return (
      <div>
        <h3 className="section-title">Sugerencias</h3>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!recommended || recommended.length === 0) return null;

  return (
    <div>
      <h3 className="section-title">Sugerencias</h3>

      <div className="pictogram-grid">
        {recommended.map(p => (
          <div key={p.id} className="pictogram-card" onClick={() => onSelect(p)}>
            <img src={p.url} alt={p.palabra} />
            <span>{p.palabra}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
