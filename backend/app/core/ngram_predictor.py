"""
Predictor N-gram para uso en producción.
Carga modelo pre-entrenado y realiza predicciones rápidas.
"""

import pickle
from pathlib import Path
from collections import defaultdict, Counter

class NGramPredictor:
    """Predictor N-gram ligero y rápido"""
    
    def __init__(self, model_path=None):
        self.trigrams = defaultdict(Counter)
        self.fourgrams = defaultdict(Counter)
        self.vocab = set()
        
        if model_path:
            self.load(model_path)
    
    def load(self, path):
        """Carga modelo pre-entrenado"""
        path = Path(path)
        if not path.exists():
            raise FileNotFoundError(f"Modelo no encontrado: {path}")
        
        with open(path, 'rb') as f:
            data = pickle.load(f)
        
        self.trigrams = defaultdict(Counter, data.get('trigrams', {}))
        self.fourgrams = defaultdict(Counter, data.get('fourgrams', {}))
        self.vocab = data.get('vocab', set())
    
    def predict(self, context_words, top_k=15):
        """
        Predice próximas palabras.
        
        Args:
            context_words: Lista de palabras ["yo", "quiero"]
            top_k: Número de predicciones
        
        Returns:
            Lista de palabras predichas
        """
        if not context_words:
            return []
        
        context = [w.lower() for w in context_words]
        
        # Intentar 4-gram (más específico)
        if len(context) >= 3:
            ctx_4 = tuple(context[-3:])
            if ctx_4 in self.fourgrams:
                predictions = self.fourgrams[ctx_4].most_common(top_k * 2)
                filtered = [w for w, c in predictions if w not in ["<START>", "<END>"]]
                if len(filtered) >= top_k // 2:
                    return filtered[:top_k]
        
        # Fallback a trigram
        if len(context) >= 2:
            ctx_3 = tuple(context[-2:])
            if ctx_3 in self.trigrams:
                predictions = self.trigrams[ctx_3].most_common(top_k * 2)
                filtered = [w for w, c in predictions if w not in ["<START>", "<END>"]]
                return filtered[:top_k]
        
        return []

# Singleton global
_ngram_predictor = None

def get_ngram_predictor():
    """Obtiene instancia global del predictor"""
    global _ngram_predictor
    if _ngram_predictor is None:
        model_path = Path(__file__).parent.parent / "models_ml" / "ngram.pkl"
        if model_path.exists():
            _ngram_predictor = NGramPredictor(model_path)
        else:
            print(f"⚠️  Modelo N-gram no encontrado: {model_path}")
            _ngram_predictor = NGramPredictor()  # Predictor vacío
    return _ngram_predictor

def predict_next_words_ngram(context, num_words=15):
    """Función de conveniencia para predicción"""
    if isinstance(context, str):
        context = context.split()
    
    predictor = get_ngram_predictor()
    return predictor.predict(context, top_k=num_words)
