"""
Sistema Ensemble optimizado: N-gram (5-grams + interpolación) + Fallback.
Mejor accuracy con modelo estadístico optimizado.
"""

from app.core.ngram_predictor import predict_next_words_ngram
from app.core.fallback import get_fallback_suggestions

def predict_ensemble(context, num_words=15, use_fallback=True):
    """
    Predicción usando N-gram optimizado (5-grams + interpolación).
    
    Strategy:
    - N-gram (5-grams + interpolación): Predicción principal (54% Top-12)
    - Fallback expandido: Sugerencias contextuales AAC
    
    Args:
        context: String "yo quiero" o lista ["yo", "quiero"]
        num_words: Número de predicciones finales
        use_fallback: Usar fallback si modelos fallan
    
    Returns:
        Lista de palabras predichas ordenadas por score
    """
    # Normalizar input
    if isinstance(context, str):
        context_str = context
        context_list = context.split()
    else:
        context_list = context
        context_str = " ".join(context)
    
    # Caso especial: sin contexto
    if not context_list:
        if use_fallback:
            return get_fallback_suggestions([], num_suggestions=num_words)
        return []
    
    try:
        # Usar N-gram con interpolación (mejor modelo: 54%)
        predictions = predict_next_words_ngram(context_str, num_words=num_words)
        
        # Si obtenemos suficientes predicciones, retornar
        if len(predictions) >= num_words // 2:
            return predictions[:num_words]
        
        # Fallback si predicciones insuficientes
        if use_fallback:
            fallback_preds = get_fallback_suggestions(context_list, num_suggestions=num_words)
            # Combinar sin duplicados
            combined = predictions + [w for w in fallback_preds if w not in predictions]
            return combined[:num_words]
        
        return predictions[:num_words]
        
    except Exception as e:
        print(f"Error en ensemble: {e}")
        
        # Graceful degradation a fallback
        if use_fallback:
            return get_fallback_suggestions(context_list, num_suggestions=num_words)
        
        return []

def predict_next_words_cached(context: str, num_words: int = 15):
    """
    Versión con caché para compatibilidad con API actual.
    
    Args:
        context: String de contexto "yo quiero"
        num_words: Número de predicciones
    
    Returns:
        Lista de palabras predichas
    """
    return predict_ensemble(context, num_words=num_words, use_fallback=True)
