"""
Fallback recommendations expanded with comprehensive AAC vocabulary.
Based on 10k LLM-generated AAC corpus for maximum coverage.
"""

# Simple starter words when no context
STARTER_WORDS = [
    "yo", "tú", "él", "ella", "nosotros", "ellos",
    "quiero", "necesito", "tengo", "puedo", "me", "gusta",
    "comer", "jugar", "ir", "ver", "hacer", "dormir"
]

# Common follow-up words by category (AMPLIADO)
COMMON_FOLLOWUPS = {
    # After pronouns
    "yo": ["quiero", "necesito", "tengo", "puedo", "voy", "me", "estoy", "siento"],
    "tú": ["quieres", "necesitas", "tienes", "puedes", "vas", "te", "estás"],
    "él": ["quiere", "necesita", "tiene", "puede", "va", "se", "está"],
    "ella": ["quiere", "necesita", "tiene", "puede", "va", "se", "está"],
    "nosotros": ["queremos", "necesitamos", "tenemos", "podemos", "vamos", "nos", "estamos"],
    "ellos": ["quieren", "necesitan", "tienen", "pueden", "van", "se", "están"],
    
    # After common verbs
    "quiero": ["agua", "comer", "jugar", "dormir", "ir", "mi", "un", "tomar", "estar", "beber", "descansar", "sentarme"],
    "necesito": ["agua", "ayuda", "comer", "descansar", "ir", "respirar", "sentarme", "mi", "calma", "silencio"],
    "tengo": ["hambre", "sed", "sueño", "frío", "calor", "dolor", "miedo", "ganas", "cansancio"],
    "puedo": ["comer", "beber", "jugar", "ir", "ayudar", "caminar", "sentarme", "levantarme", "descansar"],
    "me": ["gusta", "duele", "siento", "falta"],
    "gusta": ["jugar", "comer", "correr", "cantar", "bailar", "pintar", "dibujar", "leer"],
    
    # After actions
    "comer": ["pan", "arroz", "fruta", "sopa", "pollo", "pescado", "algo", "más", "despacio", "tranquilo"],
    "beber": ["agua", "jugo", "leche", "algo", "más", "despacio"],
    "tomar": ["agua", "jugo", "leche", "té", "aire", "un", "mi", "medicina"],
    "jugar": ["con", "afuera", "adentro", "contigo", "solo", "tranquilo", "un", "pelota"],
    "ir": ["al", "a", "casa", "baño", "afuera", "contigo", "solo", "despacio"],
    "ver": ["televisión", "dibujos", "película", "animales", "algo"],
    "hacer": ["ejercicio", "un", "algo", "dibujo", "manualidades"],
    "dormir": ["ahora", "un", "más", "tranquilo", "contigo"],
    "caminar": ["despacio", "contigo", "solo", "afuera", "un"],
    "sentarme": ["aquí", "ahora", "contigo", "solo", "en"],
    "descansar": ["ahora", "aquí", "un", "tranquilo", "contigo"],
    "respirar": ["despacio", "profundo", "tranquilo", "mejor", "hondo"],
    
    # After objects/places
    "agua": ["fría", "caliente", "ahora", "más", "tibia"],
    "casa": ["ahora", "pronto", "contigo"],
    "baño": ["ahora", "urgente", "ya"],
    "pan": ["con", "más", "suave", "tostado"],
    "arroz": ["con", "blanco", "caliente"],
    "sopa": ["caliente", "suave", "más"],
    
    # After adjectives/states
    "hambre": ["ahora", "fuerte", "mucha"],
    "sed": ["ahora", "fuerte", "mucha"],
    "dolor": ["aquí", "fuerte", "en", "de"],
    "frío": ["ahora", "mucho", "en"],
    "calor": ["ahora", "mucho", "en"],
    
    # Prepositions
    "con": ["mamá", "papá", "amigos", "familia", "agua", "mi"],
    "para": ["casa", "jugar", "comer", "ir", "mi"],
    "en": ["casa", "la", "mi", "el", "un"],
    "a": ["casa", "la", "mi", "comer", "jugar"],
    "al": ["baño", "parque", "colegio"],
    
    # Possessives
    "mi": ["agua", "comida", "manta", "silla", "cama", "ropa", "mochila", "abrigo", "medicina"],
    "tu": ["agua", "comida", "manta", "silla", "ayuda"],
    "su": ["agua", "comida", "manta", "ayuda"],
    
    # Common AAC phrases starts
    "más": ["agua", "comida", "pan", "jugo", "silencio", "espacio", "tiempo"],
    "menos": ["ruido", "luz", "calor"],
    "muy": ["feliz", "cansado", "tranquilo", "bien"],
    
    # Emotions/states
    "estoy": ["feliz", "triste", "cansado", "bien", "mal", "nervioso", "tranquilo"],
    "siento": ["bien", "mal", "feliz", "triste", "cansado", "nervioso"],
    "feliz": ["ahora", "contigo", "hoy"],
    "triste": ["ahora", "hoy"],
    "cansado": ["ahora", "hoy", "físico", "mental"],
}

# AAC common words by frequency (from 10k corpus)
FREQUENT_AAC_WORDS = [
    # Top pronouns/verbs
    "yo", "quiero", "necesito", "tengo", "agua", "mi", "comer", "tomar",
    # Actions
    "ir", "jugar", "dormir", "descansar", "sentarme", "levantarme", "caminar",
    # Objects
    "comida", "pan", "arroz", "sopa", "fruta", "leche", "jugo",
    # Places/things
    "baño", "casa", "manta", "silla", "cama", "ropa", "abrigo",
    # States
    "hambre", "sed", "sueño", "dolor", "calor", "frío",
    # Modifiers
    "más", "menos", "ahora", "aquí", "contigo", "solo", "tranquilo"
]

def get_fallback_suggestions(words: list, num_suggestions: int = 12):
    """
    Get comprehensive fallback suggestions based on AAC patterns.
    
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
        suggestions = COMMON_FOLLOWUPS[last_word][:num_suggestions]
        
        # If not enough, add frequent words
        if len(suggestions) < num_suggestions:
            for word in FREQUENT_AAC_WORDS:
                if word not in suggestions and word != last_word:
                    suggestions.append(word)
                    if len(suggestions) >= num_suggestions:
                        break
        
        return suggestions[:num_suggestions]
    
    # For unknown words, return most frequent AAC words
    suggestions = [w for w in FREQUENT_AAC_WORDS if w != last_word]
    return suggestions[:num_suggestions]

