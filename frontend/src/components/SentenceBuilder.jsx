export default function SentenceBuilder({ sentence, onRemove }) {
  return (
    <div>
      <h2 className="section-title">Oración</h2>

      <div className="sentence-strip">
        {sentence.length === 0 && <div className="sentence-placeholder">Selecciona pictogramas para formar una oración...</div>}

        {sentence.map((p, idx) => (
          <div
            key={`${p.id}-${idx}`}
            className="pictogram-card"
            onClick={() => onRemove(idx)}
            title="Clic para eliminar"
          >
            <img src={p.url || p.imagen} alt={p.palabra} />
            <span>{p.palabra}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
