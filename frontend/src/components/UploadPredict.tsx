import { useState } from "react";
import type { ChangeEvent } from "react";


interface Prediction {
  class_id: number;
  class_name: string;
  confidence: number;
}

export default function UploadPredict() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setPrediction(null);
  };

  const handleUpload = async () => {
    if (!file) return alert("Selecciona un archivo primero");

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${import.meta.env.VITE_AI_URL}/api/predict`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Error en la petición");

      const data: Prediction = await res.json();
      setPrediction(data);
    } catch (err) {
      console.error(err);
      alert("Error al predecir la imagen");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setPreview(null);
    setPrediction(null);
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", textAlign: "center" }}>
      <label htmlFor="fileInput">Selecciona un pictograma</label>
      <input type="file" id="fileInput" onChange={handleFileChange} style={{
        alignContent:"center", display:"flex",
      }}/>
      <br />
      {preview && (
        <div style={{ margin: "10px 0" }}>
          <img
            src={preview}
            alt="Preview"
            style={{ width: 200, height: 200, objectFit: "contain", border: "1px solid #ccc" }}
          />
        </div>
      )}

      <button onClick={handleUpload} disabled={loading} style={{ marginRight: 10 }}>
        {loading ? "Prediciendo..." : "Predecir"}
      </button>

      <button onClick={handleClear}>Limpiar</button>

      {prediction && (
        <div style={{ marginTop: 20, color: "#333", textAlign: "left" }}>
          <h3>Predicción:</h3>
          <p><strong>ID:</strong> {prediction.class_id}</p>
          <p><strong>Clase:</strong> {prediction.class_name}</p>
          <p><strong>Confianza:</strong> {prediction.confidence}</p>
        </div>
      )}
    </div>
  );
}
