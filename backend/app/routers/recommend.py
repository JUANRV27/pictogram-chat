from fastapi import APIRouter
from core.nlp import nlp
from core.arasaac import search_pictograms
from core.rules import NEXT_POS_RULES, POS_SEEDS, SEMANTIC_RULES

router = APIRouter()

@router.post("/recommend")
def recommend(data: dict):
    words = data.get("selected", [])

    if not words:
        return {
            "expected_pos": ["PRON"],
            "options": ["yo", "tú", "él", "ella"]
        }

    last = words[-1]
    doc = nlp(last)
    pos = doc[0].pos_

    expected = NEXT_POS_RULES.get(pos, ["NOUN"])

    # 1. Semantic Context (Specific Rules)
    if last.lower() in SEMANTIC_RULES:
        candidates = SEMANTIC_RULES[last.lower()]
    
    # 2. Grammatical Fallback (General Rules)
    else:
        candidates = []
        for cat in expected:
            candidates.extend(POS_SEEDS.get(cat, []))

    pictos = []
    for w in candidates:
        result = search_pictograms(w)
        if result:
            picto_id = result[0]["_id"]
            pictos.append({
                "palabra": w,
                "id": picto_id,
                "url": f"https://static.arasaac.org/pictograms/{picto_id}/{picto_id}_300.png",
                "keywords": result[0]["keywords"]
            })

    return {
        "expected_pos": expected,
        "recommended": pictos
    }
