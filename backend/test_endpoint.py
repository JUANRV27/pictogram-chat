"""
Test rápido del endpoint recommend
"""
import requests
import json

# Test 1: Sin contexto (primera palabra)
print("=== Test 1: Sin contexto ===")
response = requests.post(
    "http://localhost:8000/recommend",
    json={"selected": []}
)
print(f"Status: {response.status_code}")
if response.status_code == 200:
    data = response.json()
    print(f"Pictogramas recomendados: {len(data.get('recommended', []))}")
    if data.get('recommended'):
        print(f"Primera palabra: {data['recommended'][0]['palabra']}")
print()

# Test 2: Con contexto "yo quiero"
print("=== Test 2: Contexto 'yo quiero' ===")
response = requests.post(
    "http://localhost:8000/recommend",
    json={"selected": ["yo", "quiero"]}
)
print(f"Status: {response.status_code}")
if response.status_code == 200:
    data = response.json()
    print(f"Pictogramas recomendados: {len(data.get('recommended', []))}")
    recommended_words = [p['palabra'] for p in data.get('recommended', [])]
    print(f"Palabras: {recommended_words[:5]}...")
print()

# Test 3: Con contexto "necesito"
print("=== Test 3: Contexto 'necesito' ===")
response = requests.post(
    "http://localhost:8000/recommend",
    json={"selected": ["necesito"]}
)
print(f"Status: {response.status_code}")
if response.status_code == 200:
    data = response.json()
    print(f"Pictogramas recomendados: {len(data.get('recommended', []))}")
    recommended_words = [p['palabra'] for p in data.get('recommended', [])]
    print(f"Palabras: {recommended_words[:5]}...")
