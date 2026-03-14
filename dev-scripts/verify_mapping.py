
import urllib.request
import json

def probe():
    print("Fetching registry sample to check address mapping...")
    # Using the search API
    url = "https://go-api.accessprotocol.co/hub/search?sort=featured&page=0&per_page=100"
    
    req = urllib.request.Request(url, method='GET')
    req.add_header('Origin', 'https://hub.accessprotocol.co')
    req.add_header('Referer', 'https://hub.accessprotocol.co/')
    
    try:
        with urllib.request.urlopen(req) as response:
            body = response.read().decode('utf-8')
            parsed = json.loads(body)
            
            if 'data' in parsed:
                budds = next((c for c in parsed['data'] if "Budds" in c.get('name', '')), None)
                if budds:
                    print("Found Hey Its Budds!")
                    print(json.dumps(budds, indent=2))
                else:
                    print("Hey Its Budds not found in first 100 featured creators.")
                    # Print mapping of first 5
                    for i, c in enumerate(parsed['data'][:5]):
                        print(f"{i}: {c.get('name')} -> {c.get('pubkey')}")
            else:
                print("No data in response.")
    except Exception as e:
        print(f"Probe failed: {e}")

if __name__ == "__main__":
    probe()
