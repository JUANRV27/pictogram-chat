import { useState } from "react";

export function useSentence() {
  const [sentence, setSentence] = useState([]);

  const addPictogram = (pictogram) => {
    setSentence([...sentence, pictogram]);
  };

  const removeLast = () => {
    setSentence(sentence.slice(0, -1));
  };

  // lógica simple de recomendación por ahora
  const recommend = () => {
    if (sentence.length === 0) return [];

    const last = sentence[sentence.length - 1].word;

    const rules = {
      "yo": ["quiero", "necesito"],
      "quiero": ["comer", "jugar", "ir"],
      "comer": ["arroz", "pollo", "pizza"],
      "ir": ["casa", "parque", "baño"]
    };

    return rules[last] || [];
  };

  return {
    sentence,
    addPictogram,
    removeLast,
    recommend
  };
}
