export default function ChatBox({ sentence, reply, onSend }) {
  const textSentence = sentence.map((p) => p.palabra).join(" ");

  return (
    <div style={{ marginTop: 20 }}>
      <h2>Enviar mensaje</h2>

      <p><strong>Oración:</strong> {textSentence}</p>

      <button onClick={onSend}>Enviar al backend</button>

      <h2>Respuesta del sistema:</h2>
      <p>{reply}</p>
    </div>
  );
}
