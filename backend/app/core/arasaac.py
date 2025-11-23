from fastapi import APIRouter

import requests
from functools import lru_cache

@lru_cache(maxsize=100)
def search_pictograms(word):
    url = f"https://api.arasaac.org/v1/pictograms/es/search/{word}"
    try:
        r = requests.get(url)
        return r.json()
    except:
        return []
