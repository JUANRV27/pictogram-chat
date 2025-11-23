import requests
import json

url = "http://localhost:8000/recommend"
data = {"selected": ["yo"]}

try:
    response = requests.post(url, json=data)
    response.raise_for_status()
    result = response.json()
    
    print("Status Code:", response.status_code)
    print("Response Keys:", result.keys())
    
    if "recommended" in result and len(result["recommended"]) > 0:
        first_rec = result["recommended"][0]
        print("First Recommendation Keys:", first_rec.keys())
        if "palabra" in first_rec and "url" in first_rec:
            print("SUCCESS: 'palabra' and 'url' fields found.")
            print("Sample URL:", first_rec["url"])
        else:
            print("FAILURE: Missing 'palabra' or 'url' fields.")
    else:
        print("WARNING: No recommendations returned.")
        
except Exception as e:
    print("Error:", e)
