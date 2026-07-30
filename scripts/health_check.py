import urllib.request
import json
import sys

def check_system_health():
    url = "http://127.0.0.1:8000/api/v1/model-info"
    try:
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req) as response:
            if response.status == 200:
                data = json.loads(response.read().decode('utf-8'))
                print("FinPulse AI Service Status: OPERATIONAL")
                print(f"Active Regressor: {data.get('active_regressor')}")
                print(f"Active Classifier: {data.get('active_classifier')}")
                sys.exit(0)
            else:
                print(f"Health Check Failed with Status Code: {response.status}")
                sys.exit(1)
    except Exception as e:
        print(f"Health Check Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    check_system_health()
