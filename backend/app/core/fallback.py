"""
Fallback recommendations for when GPT-2 is unavailable or context is empty.
Simple, reliable suggestions for common pictogram use cases.
"""

# Simple starter words when no context
STARTER_WORDS = [
    "yo", "tú", "quiero", "necesito", "gusta",
    "comer", "ir", "jugar", "ver", "hacer", "tengo", "puedo"
]

# Common follow-up words by category
COMMON_FOLLOWUPS = {
    # After pronouns
    "yo": ["quiero", "necesito", "voy", "tengo", "puedo", "soy", "como", "juego"],
    "tú": ["quieres", "necesitas", "vas", "tienes", "puedes", "eres", "comes", "juegas"],
    "él": ["quiere", "necesita", "va", "tiene", "puede", "es", "come", "juega"],
    "ella": ["quiere", "necesita", "va", "tiene", "puede", "es", "come", "juega"],
    
    # After common verbs
    "quiero": ["comer", "jugar", "ir", "dormir", "agua", "pizza", "ver", "hacer", "beber", "salir"],
    "necesito": ["ayuda", "agua", "baño", "comer", "dormir", "ir", "descansar", "hablar"],
    "gusta": ["pizza", "helado", "jugar", "ver", "música", "comer", "bailar", "cantar"],
    "voy": ["casa", "colegio", "parque", "baño", "calle", "tienda", "playa", "ir"],
    "tengo": ["hambre", "sed", "sueño", "frío", "calor", "miedo", "ganas", "dolor"],
    "puedo": ["ir", "comer", "jugar", "ayudar", "hacer", "ver", "salir"],
    
    # After actions
    "comer": ["pizza", "pan", "manzana", "carne", "pescado", "pasta", "arroz", "fruta", "helado"],
    "beber": ["agua", "leche", "zumo", "té", "café", "batido", "refresco"],
    "jugar": ["pelota", "parque", "amigos", "juguetes", "videojuegos", "balón", "muñeca"],
    "ir": ["casa", "colegio", "parque", "playa", "tienda", "baño", "calle", "cine"],
    "ver": ["televisión", "película", "dibujos", "vídeo", "libro", "fotos"],
    "hacer": ["tarea", "ejercicio", "comida", "deberes", "juego", "dibujo"],
    
    # Common combinations
    "con": ["amigos", "familia", "mamá", "papá", "hermano", "agua", "leche"],
    "para": ["casa", "colegio", "jugar", "comer", "ir"],
}

def get_fallback_suggestions(words: list, num_suggestions: int = 10):
    """
    Get simple fallback suggestions when GPT-2 is not available.
    
    Args:
        words: List of previously selected words
        num_suggestions: Number of suggestions to return
    
    Returns:
        List of suggested words
    """
    if not words:
        return STARTER_WORDS[:num_suggestions]
    
    last_word = words[-1].lower()
    
    # Check if we have specific follow-ups for this word
    if last_word in COMMON_FOLLOWUPS:
        suggestions = COMMON_FOLLOWUPS[last_word]
    else:
        # Generic common words based on common sentence patterns
        suggestions = [
            "y", "con", "para", "agua", "casa", "comer", 
            "jugar", "ir", "quiero", "pizza", "pelota", "amigos"
        ]
    
    return suggestions[:num_suggestions]
