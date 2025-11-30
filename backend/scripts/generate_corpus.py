"""
Script para generar corpus AAC en español.
Combina templates, vocabulario ARASAAC y frases reales.
Genera ~10,000 frases para entrenamiento.
"""

import json
import random
from pathlib import Path

# Vocabulario AAC categorizado
VOCABULARIO = {
    "pronombres": ["yo", "tú", "él", "ella", "nosotros", "ellos"],
    "verbos_deseo": ["quiero", "necesito", "deseo", "me gustaría"],
    "verbos_accion": ["comer", "beber", "jugar", "ir", "ver", "hacer", "dormir", "salir", "cantar", "bailar", "leer", "escribir", "dibujar", "correr", "nadar"],
    "verbos_estado": ["tengo", "siento", "estoy", "soy"],
    "sustantivos_comida": ["pizza", "pan", "manzana", "agua", "leche", "helado", "carne", "pescado", "pasta", "arroz", "fruta", "verdura", "sopa", "café", "té", "zumo", "galleta", "chocolate"],
    "sustantivos_lugares": ["casa", "colegio", "parque", "baño", "calle", "tienda", "playa", "hospital", "cine", "biblioteca", "iglesia", "restaurante"],
    "sustantivos_personas": ["mamá", "papá", "hermano", "hermana", "amigo", "amiga", "familia", "profesor", "médico", "abuelo", "abuela"],
    "sustantivos_objetos": ["pelota", "juguete", "libro", "lápiz", "televisión", "ordenador", "teléfono", "coche", "bicicleta", "música", "película"],
    "adjetivos_estado": ["hambre", "sed", "sueño", "frío", "calor", "miedo", "feliz", "triste", "cansado", "enfermo", "dolor"],
    "actividades": ["jugar", "ver televisión", "escuchar música", "leer", "dibujar", "pintar", "cantar", "bailar", "correr"],
    "adverbios": ["mucho", "poco", "muy", "ahora", "luego", "hoy", "mañana"],
    "preposiciones": ["con", "a", "en", "para", "sin"],
}

# Templates de frases AAC típicas
TEMPLATES = [
    # Deseos y necesidades
    "{pronombres} {verbos_deseo} {verbos_accion}",
    "{pronombres} {verbos_deseo} {sustantivos_comida}",
    "{pronombres} {verbos_deseo} ir a {sustantivos_lugares}",
    "{pronombres} {verbos_deseo} {verbos_accion} {sustantivos_comida}",
    "{pronombres} {verbos_deseo} {verbos_accion} con {sustantivos_personas}",
    
    # Estados
    "{pronombres} {verbos_estado} {adjetivos_estado}",
    "{pronombres} estoy {adjetivos_estado}",
    
    # Acciones
    "{pronombres} voy a {verbos_accion}",
    "{pronombres} voy a {sustantivos_lugares}",
    "{pronombres} {verbos_accion} {sustantivos_objetos}",
    
    # Gustos
    "me gusta {verbos_accion}",
    "me gusta {sustantivos_comida}",
    "me gusta {actividades}",
    "me gusta {verbos_accion} con {sustantivos_personas}",
    
    # Posesión
    "{pronombres} tengo {sustantivos_objetos}",
    
    # Completas
    "{pronombres} {verbos_deseo} {verbos_accion} {sustantivos_comida} con {sustantivos_personas}",
    "{pronombres} voy a {verbos_accion} en {sustantivos_lugares}",
    "puedo {verbos_accion}",
    "puedo ir a {sustantivos_lugares}",
]

# Frases AAC reales típicas
FRASES_REALES = [
    "yo quiero comer pizza",
    "necesito ir al baño",
    "tengo hambre",
    "tengo sed",
    "tengo sueño",
    "me gusta jugar",
    "quiero agua",
    "voy a casa",
    "quiero ver televisión",
    "me duele",
    "estoy cansado",
    "quiero dormir",
    "puedo jugar",
    "voy al colegio",
    "quiero mi mamá",
    "me gusta la música",
    "quiero salir",
    "tengo frío",
    "tengo calor",
    "estoy feliz",
    "estoy triste",
    "quiero más",
    "no quiero",
    "ayuda por favor",
    "gracias",
    "hola",
    "adiós",
]

def generar_con_templates(num_frases=7000):
    """Genera frases usando templates y vocabulario (rápido)"""
    print(f"  Generando {num_frases} frases...")
    frases = []
    
    for _ in range(num_frases):
        template = random.choice(TEMPLATES)
        frase = template
        
        # Reemplazar cada placeholder
        for vocab_key, palabras in VOCABULARIO.items():
            placeholder = f"{{{vocab_key}}}"
            if placeholder in frase:
                palabra = random.choice(palabras)
                frase = frase.replace(placeholder, palabra, 1)
        
        # Validar
        frase_limpia = frase.lower().strip()
        if len(frase_limpia.split()) >= 2 and '{' not in frase_limpia:
            frases.append(frase_limpia)
        
        # Progress
        if (_ + 1) % 2000 == 0:
            print(f"    {_ + 1}/{num_frases}...")
    
    # Deduplicar
    frases_unicas = list(set(frases))
    print(f"  ✓ {len(frases_unicas)} frases únicas")
    
    return frases_unicas

def expandir_frases_reales(num_variaciones=2000):
    """Crea variaciones de frases reales"""
    variaciones = set(FRASES_REALES)
    
    # Expandir con combinaciones
    for _ in range(num_variaciones):
        base = random.choice(FRASES_REALES)
        palabras = base.split()
        
        # Variación 1: Agregar adverbio
        if random.random() > 0.5 and len(palabras) < 6:
            adverbio = random.choice(VOCABULARIO["adverbios"])
            nueva = f"{base} {adverbio}"
            variaciones.add(nueva)
        
        # Variación 2: Cambiar pronombre
        if palabras[0] in VOCABULARIO["pronombres"]:
            nuevo_pronombre = random.choice(VOCABULARIO["pronombres"])
            nueva = " ".join([nuevo_pronombre] + palabras[1:])
            variaciones.add(nueva)
    
    return list(variaciones)

def agregar_corpus_general(num_frases=1000):
    """Agrega frases simples del español general"""
    frases_generales = [
        "buenos días",
        "buenas tardes",
        "buenas noches",
        "hasta luego",
        "por favor",
        "muchas gracias",
        "de nada",
        "lo siento",
        "perdón",
        "no entiendo",
        "sí quiero",
        "no quiero",
        "está bien",
        "no está bien",
        "me encanta",
        "no me gusta",
        "qué bonito",
        "qué rico",
        "hace frío",
        "hace calor",
        "llueve",
        "hace sol",
    ]
    
    # Expandir con vocabulario
    extras = []
    for _ in range(num_frases - len(frases_generales)):
        # Frases simples adicionales
        sustantivo = random.choice(VOCABULARIO["sustantivos_comida"] + 
                                   VOCABULARIO["sustantivos_objetos"])
        extras.append(f"me gusta {sustantivo}")
        
        verbo = random.choice(VOCABULARIO["verbos_accion"])
        extras.append(f"voy a {verbo}")
    
    return frases_generales + extras[:num_frases - len(frases_generales)]

def generar_corpus_completo():
    """Genera el corpus completo de ~25,000 frases (optimizado para mejor accuracy)"""
    print("Generando corpus AAC mejorado...")
    
    # 1. Frases de templates (80%)
    print("  - Generando con templates...")
    frases_templates = generar_con_templates(20000)  # Aumentado de 12000
    
    # 2. Variaciones de frases reales (15%)
    print("  - Expandiendo frases reales...")
    frases_reales = expandir_frases_reales(5000)  # Aumentado de 3000
    
    # 3. Corpus general (5%)
    print("  - Agregando corpus general...")
    frases_general = agregar_corpus_general(3000)  # Aumentado de 2000
    
    # Combinar y deduplicar
    corpus = list(set(frases_templates + frases_reales + frases_general))
    
    # Shuffle
    random.shuffle(corpus)
    
    print(f"\n✓ Corpus generado: {len(corpus)} frases únicas")
    
    return corpus

def guardar_corpus(corpus, output_dir="data"):
    """Guarda el corpus en archivos"""
    output_path = Path(__file__).parent.parent / output_dir
    output_path.mkdir(exist_ok=True)
    
    # Guardar corpus completo
    corpus_file = output_path / "aac_corpus.txt"
    with open(corpus_file, 'w', encoding='utf-8') as f:
        f.write('\n'.join(corpus))
    
    print(f"✓ Corpus guardado en: {corpus_file}")
    
    # Split train/val (90/10)
    split_idx = int(len(corpus) * 0.9)
    train = corpus[:split_idx]
    val = corpus[split_idx:]
    
    train_file = output_path / "train.txt"
    val_file = output_path / "val.txt"
    
    with open(train_file, 'w', encoding='utf-8') as f:
        f.write('\n'.join(train))
    
    with open(val_file, 'w', encoding='utf-8') as f:
        f.write('\n'.join(val))
    
    print(f"✓ Train: {len(train)} frases → {train_file}")
    print(f"✓ Val: {len(val)} frases → {val_file}")
    
    # Guardar vocabulario único
    vocab = set()
    for frase in corpus:
        vocab.update(frase.split())
    
    vocab_file = output_path / "vocab.txt"
    with open(vocab_file, 'w', encoding='utf-8') as f:
        f.write('\n'.join(sorted(vocab)))
    
    print(f"✓ Vocabulario: {len(vocab)} palabras únicas → {vocab_file}")
    
    # Estadísticas
    stats = {
        "total_frases": len(corpus),
        "vocabulario_size": len(vocab),
        "promedio_palabras": sum(len(f.split()) for f in corpus) / len(corpus),
        "train_size": len(train),
        "val_size": len(val)
    }
    
    stats_file = output_path / "stats.json"
    with open(stats_file, 'w', encoding='utf-8') as f:
        json.dump(stats, f, indent=2, ensure_ascii=False)
    
    print(f"\n✓ Estadísticas guardadas en: {stats_file}")
    print(f"  - Promedio palabras por frase: {stats['promedio_palabras']:.1f}")

if __name__ == "__main__":
    # Generar corpus
    corpus = generar_corpus_completo()
    
    # Mostrar ejemplos
    print("\nEjemplos de frases generadas:")
    for i, frase in enumerate(random.sample(corpus, 10), 1):
        print(f"  {i}. {frase}")
    
    # Guardar
    print("\nGuardando corpus...")
    guardar_corpus(corpus)
    
    print("\n✓ ¡Listo! Corpus AAC generado exitosamente.")
