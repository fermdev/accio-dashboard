
import urllib.request
import json

def probe():
    print("Probing creator search API using GET and headers...")
    url = "https://go-api.accessprotocol.co/hub/search?sort=featured&page=0&per_page=10"
    
    req = urllib.request.Request(url, method='GET')
    req.add_header('Origin', 'https://hub.accessprotocol.co')
    req.add_header('Referer', 'https://hub.accessprotocol.co/')
    
    try:
        with urllib.request.urlopen(req) as response:
            status = response.getcode()
            print(f"Status Code: {status}")
            body = response.read().decode('utf-8')
            parsed = json.loads(body)
            print("Successfully parsed JSON.")
            
            if 'data' in parsed and len(parsed['data']) > 0:
                first_creator = parsed['data'][0]
                print("First creator in list:")
                print(json.dumps(first_creator, indent=2))
                
                # Check if specific fields exist
                print(f"Keys available: {list(first_creator.keys())}")
            else:
                print("No data found in response.")
                print(f"Raw body: {body[:500]}")
    except Exception as e:
        print(f"Probe failed: {e}")

if __name__ == "__main__":
    probe()
