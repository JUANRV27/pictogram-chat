"""
Entrenamiento de modelo N-gram para predicción AAC.
Entrena trigrams y 4-grams con el corpus generado.
Tiempo: ~10 minutos en CPU.
"""

import pickle
from collections import defaultdict, Counter
from pathlib import Path

class NGramModel:
    """Modelo N-gram MEJORADO con 5-grams e interpolación"""
    
    def __init__(self, n=5):
        self.n = n
        self.bigrams = defaultdict(Counter)    # (w1,) -> {w2: count}
        self.trigrams = defaultdict(Counter)   # (w1, w2) -> {w3: count}
        self.fourgrams = defaultdict(Counter)  # (w1, w2, w3) -> {w4: count}
        self.fivegrams = defaultdict(Counter)  # (w1, w2, w3, w4) -> {w5: count}
        self.vocab = set()
    
    def train(self, sentences):
        """Entrena el modelo con lista de frases"""
        print(f"Entrenando N-gram mejorado (hasta {self.n}-grams)...")
        
        for sentence in sentences:
            words = ["<START>"] + sentence.lower().split() + ["<END>"]
            self.vocab.update(words)
            
            # Bigrams: (w1,) -> w2
            for i in range(len(words) - 1):
                context = (words[i],)
                next_word = words[i+1]
                self.bigrams[context][next_word] += 1
            
            # Trigrams: (w1, w2) -> w3
            for i in range(len(words) - 2):
                context = (words[i], words[i+1])
                next_word = words[i+2]
                self.trigrams[context][next_word] += 1
            
            # 4-grams: (w1, w2, w3) -> w4
            if len(words) >= 4:
                for i in range(len(words) - 3):
                    context = (words[i], words[i+1], words[i+2])
                    next_word = words[i+3]
                    self.fourgrams[context][next_word] += 1
            
            # 5-grams: (w1, w2, w3, w4) -> w5
            if len(words) >= 5:
                for i in range(len(words) - 4):
                    context = (words[i], words[i+1], words[i+2], words[i+3])
                    next_word = words[i+4]
                    self.fivegrams[context][next_word] += 1
        
        print(f"✓ Vocabulario: {len(self.vocab)} palabras")
        print(f"✓ Bigrams: {len(self.bigrams)} contextos")
        print(f"✓ Trigrams: {len(self.trigrams)} contextos")
        print(f"✓ 4-grams: {len(self.fourgrams)} contextos")
        print(f"✓ 5-grams: {len(self.fivegrams)} contextos")
    
    def predict(self, context_words, top_k=15):
        """
        Predice próximas palabras usando INTERPOLACIÓN entre n-grams.
        Combina múltiples órdenes con pesos en lugar de simple fallback.
        
        Args:
            context_words: Lista de palabras ["yo", "quiero"]
            top_k: Número de predicciones
        
        Returns:
            Lista de palabras predichas
        """
        if not context_words:
            # Sin contexto, retornar palabras iniciales más comunes
            all_starts = []
            for ctx, words in self.trigrams.items():
                if ctx[0] == "<START>":
                    all_starts.extend([(w, c) for w, c in words.items()])
            
            if all_starts:
                starts_counter = Counter(dict(all_starts))
                return [w for w, c in starts_counter.most_common(top_k) if w != "<END>"]
            return []
        
        # Preparar contexto (lowercase)
        context = [w.lower() for w in context_words]
        
        # === INTERPOLACIÓN: Combinar todos los n-grams con pesos ===
        scores = defaultdict(float)
        
        # 5-gram (40% peso) - más específico
        if len(context) >= 4:
            ctx_5 = tuple(context[-4:])
            if ctx_5 in self.fivegrams:
                total = sum(self.fivegrams[ctx_5].values())
                for word, count in self.fivegrams[ctx_5].items():
                    if word not in ["<START>", "<END>"]:
                        prob = count / total
                        scores[word] += prob * 0.40  # 40% peso
        
        # 4-gram (30% peso)
        if len(context) >= 3:
            ctx_4 = tuple(context[-3:])
            if ctx_4 in self.fourgrams:
                total = sum(self.fourgrams[ctx_4].values())
                for word, count in self.fourgrams[ctx_4].items():
                    if word not in ["<START>", "<END>"]:
                        prob = count / total
                        scores[word] += prob * 0.30  # 30% peso
        
        # Trigram (20% peso)
        if len(context) >= 2:
            ctx_3 = tuple(context[-2:])
            if ctx_3 in self.trigrams:
                total = sum(self.trigrams[ctx_3].values())
                for word, count in self.trigrams[ctx_3].items():
                    if word not in ["<START>", "<END>"]:
                        prob = count / total
                        scores[word] += prob * 0.20  # 20% peso
        
        # Bigram (10% peso) - más general
        if len(context) >= 1:
            ctx_2 = (context[-1],)
            if ctx_2 in self.bigrams:
                total = sum(self.bigrams[ctx_2].values())
                for word, count in self.bigrams[ctx_2].items():
                    if word not in ["<START>", "<END>"]:
                        prob = count / total
                        scores[word] += prob * 0.10  # 10% peso
        
        # Ordenar por score combinado
        ranked = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        predictions = [word for word, score in ranked[:top_k]]
        
        return predictions
    
    def save(self, path):
        """Guarda el modelo"""
        data = {
            'bigrams': dict(self.bigrams),
            'trigrams': dict(self.trigrams),
            'fourgrams': dict(self.fourgrams),
            'fivegrams': dict(self.fivegrams),
            'vocab': self.vocab,
            'n': self.n
        }
        with open(path, 'wb') as f:
            pickle.dump(data, f)
        
        # Mostrar tamaño
        size_mb = path.stat().st_size / (1024 * 1024)
        print(f"✓ Modelo guardado: {path}")
        print(f"  Tamaño: {size_mb:.1f} MB")
    
    @classmethod
    def load(cls, path):
        """Carga el modelo"""
        with open(path, 'rb') as f:
            data = pickle.load(f)
        
        model = cls(n=data['n'])
        model.bigrams = defaultdict(Counter, data.get('bigrams', {}))
        model.trigrams = defaultdict(Counter, data['trigrams'])
        model.fourgrams = defaultdict(Counter, data['fourgrams'])
        model.fivegrams = defaultdict(Counter, data.get('fivegrams', {}))
        model.vocab = data['vocab']
        
        return model

def evaluar_modelo(model, test_cases):
    """Evalúa el modelo con casos de prueba"""
    print("\nEvaluando modelo...")
    
    correctos = 0
    total = 0
    
    for contexto, esperadas in test_cases:
        predicciones = model.predict(contexto.split(), top_k=12)
        
        # Verificar si alguna palabra esperada está en top-12
        encontrada = any(esp in predicciones for esp in esperadas)
        if encontrada:
            correctos += 1
        total += 1
        
        print(f"\n  Contexto: '{contexto}'")
        print(f"  Esperadas: {esperadas}")
        print(f"  Predichas: {predicciones[:5]}...")
        print(f"  ✓ Match" if encontrada else "  ✗ No match")
    
    accuracy = (correctos / total) * 100 if total > 0 else 0
    print(f"\n✓ Accuracy Top-12: {accuracy:.1f}% ({correctos}/{total})")
    
    return accuracy

def main():
    """Entrena y guarda el modelo N-gram"""
    # Rutas
    data_dir = Path(__file__).parent.parent / "data"
    models_dir = Path(__file__).parent.parent / "app" / "models_ml"
    models_dir.mkdir(exist_ok=True)
    
    # Cargar corpus
    train_file = data_dir / "train.txt"
    if not train_file.exists():
        print("❌ Error: Ejecuta primero generate_corpus.py")
        return
    
    print(f"Cargando corpus desde {train_file}...")
    with open(train_file, 'r', encoding='utf-8') as f:
        sentences = [line.strip() for line in f if line.strip()]
    
    print(f"✓ {len(sentences)} frases cargadas\n")
    
    # Entrenar modelo
    model = NGramModel(n=5)  # Usar 5-grams
    model.train(sentences)
    
    # Guardar modelo
    model_path = models_dir / "ngram.pkl"
    model.save(model_path)
    
    # Casos de prueba
    test_cases = [
        ("yo quiero", ["comer", "jugar", "ir", "agua", "pizza"]),
        ("necesito", ["ayuda", "agua", "baño", "ir"]),
        ("tengo", ["hambre", "sed", "sueño", "frío", "calor"]),
        ("me gusta", ["jugar", "comer", "pizza", "música"]),
        ("voy a", ["casa", "colegio", "parque", "comer"]),
    ]
    
    # Evaluar
    accuracy = evaluar_modelo(model, test_cases)
    
    print(f"\n✓ Entrenamiento completo!")
    print(f"  Modelo: {model_path}")
    print(f"  Accuracy estimado: {accuracy:.1f}%")

if __name__ == "__main__":
    main()
