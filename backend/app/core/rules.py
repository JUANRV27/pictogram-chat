NEXT_POS_RULES = {
    "PRON": ["VERB", "CONJ"],
    "VERB": ["NOUN", "DET", "PRON", "ADP", "CONJ"],
    "DET": ["NOUN"],
    "NOUN": ["VERB", "ADJ", "ADP", "CONJ"],
    "ADJ": ["NOUN", "CONJ"],
    "ADP": ["NOUN", "DET", "PRON"],
    "CCONJ": ["NOUN", "VERB", "PRON", "DET"],
    "SCONJ": ["NOUN", "VERB", "PRON", "DET"],
}

POS_SEEDS = {
    "VERB": [
        "querer", "ir", "comer", "hacer", "necesitar", "jugar", "dormir", 
        "beber", "ver", "escuchar", "caminar", "correr", "saltar", "dibujar", "leer"
    ],
    "NOUN": [
        "pizza", "perro", "casa", "playa", "agua", "manzana", "pelota", 
        "coche", "cama", "silla", "mesa", "colegio", "parque", "baño", 
        "ropa", "zapato", "galleta", "leche", "pan"
    ],
    "DET": ["el", "la", "los", "las", "un", "una"],
    "PRON": ["yo", "tú", "él", "ella", "nosotros", "ellos"],
    "ADJ": ["grande", "pequeño", "rojo", "azul", "feliz", "triste", "bueno", "malo", "rico"],
    "ADP": ["a", "de", "en", "con", "para", "por"],
    "CONJ": ["y", "o", "pero", "porque", "también"]
}

SEMANTIC_RULES = {
    "comer": ["pizza", "manzana", "pan", "galleta", "fruta", "carne", "pescado", "helado"],
    "beber": ["agua", "leche", "zumo", "refresco", "batido"],
    "ir": ["casa", "colegio", "parque", "playa", "baño", "calle", "cine", "tienda"],
    "jugar": ["pelota", "muñeca", "coche", "puzzle", "videojuego", "escondite"],
    "ver": ["tele", "pelicula", "libro", "tablet", "dibujos"],
    "escuchar": ["musica", "radio", "cuento", "cancion"],
    "querer": ["jugar", "comer", "beber", "ir", "dormir", "ver"]
}
