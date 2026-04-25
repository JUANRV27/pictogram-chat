from fastapi import APIRouter
from app.core.rules import POS_SEEDS
from app.core.arasaac import search_pictograms
import random

router = APIRouter()

@router.get("/quiz/generate")
def generate_quiz():
    # 1. Select a random category and word (Correct Answer)
    # We prefer NOUNs and VERBs for pictograms as they are more visual
    categories = ["NOUN", "VERB", "ADJ"]
    cat = random.choice(categories)
    
    # Flatten list of words from the category
    words = POS_SEEDS.get(cat, [])
    if not words:
        words = POS_SEEDS["NOUN"] # Fallback
        
    correct_word = random.choice(words)
    
    # 2. Find pictogram for correct word
    correct_picto_data = search_pictograms(correct_word)
    
    # Retry if no pictogram found (should be rare with our seeds)
    attempts = 0
    while not correct_picto_data and attempts < 5:
        correct_word = random.choice(words)
        correct_picto_data = search_pictograms(correct_word)
        attempts += 1
        
    if not correct_picto_data:
        return {"error": "Could not generate quiz"}

    correct_id = correct_picto_data[0]["_id"]
    correct_option = {
        "palabra": correct_word,
        "id": correct_id,
        "url": f"https://static.arasaac.org/pictograms/{correct_id}/{correct_id}_300.png",
        "is_correct": True
    }

    # 3. Select 3 Distractors
    # Get all available words excluding the correct one
    all_words = []
    for c in categories:
        all_words.extend(POS_SEEDS.get(c, []))
    
    distractors = []
    while len(distractors) < 3:
        w = random.choice(all_words)
        if w != correct_word and w not in [d["palabra"] for d in distractors]:
            # Verify it has a pictogram
            res = search_pictograms(w)
            if res:
                pid = res[0]["_id"]
                distractors.append({
                    "palabra": w,
                    "id": pid,
                    "url": f"https://static.arasaac.org/pictograms/{pid}/{pid}_300.png",
                    "is_correct": False
                })

    # 4. Combine and Shuffle
    options = [correct_option] + distractors
    random.shuffle(options)

    return {
        "question": f"¿Cuál es el pictograma de '{correct_word.upper()}'?",
        "correct_word": correct_word,
        "options": options
    }
