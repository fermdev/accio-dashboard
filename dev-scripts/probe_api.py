
import urllib.request
import json

def probe():
    print("Probing creator search API using Python urllib...")
    url = "https://go-api.accessprotocol.co/hub/search"
    data = {
        "sort": "featured",
        "page": 0,
        "per_page": 200
    }
    
    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), method='POST')
    req.add_header('Content-Type', 'application/json')
    
    try:
        with urllib.request.urlopen(req) as response:
            status = response.getcode()
            print(f"Status Code: {status}")
            body = response.read().decode('utf-8')
            parsed = json.loads(body)
            with open('creators_list.json', 'w') as f:
                json.dump(parsed, f, indent=2)
            print("Data saved to creators_list.json")
            if 'data' in parsed:
                print(f"Found {len(parsed['data'])} creators.")
    except Exception as e:
        print(f"Probe failed: {e}")

if __name__ == "__main__":
    probe()
