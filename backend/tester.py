import time
import requests

API_URL = "http://127.0.0.1:5000/api/ask"
TEST_QUERY = "Explain Kolb's 4 learning styles?"

def main():
    print(f"Sending test query: {TEST_QUERY}")
    start = time.time()
    response = requests.post(API_URL, json={"query": TEST_QUERY})
    elapsed = time.time() - start
    if response.ok:
        data = response.json()
        print(f"Response: {data}")
    else:
        print(f"Error: {response.status_code} {response.text}")
    print(f"Elapsed time: {elapsed:.2f} seconds")

if __name__ == "__main__":
    main()