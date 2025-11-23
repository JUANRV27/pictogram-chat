export async function sendSentence(sentenceArray) {
  const response = await fetch("http://localhost:8000/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      sentence: sentenceArray
    })
  });

  if (!response.ok) {
    throw new Error("Error al comunicarse con el backend");
  }

  return await response.json();
}
