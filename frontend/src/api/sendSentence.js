
const API_URL = import.meta.env.VITE_API_URL

export async function sendSentence(sentenceArray) {
  const response = await fetch(`${API_URL}/predict`, {
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
