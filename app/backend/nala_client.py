import requests

BASE_URL = "https://nala.ntu.edu.sg/api"
TOKEN = "workshop3test123"
HEADERS = {"Authorization": f"Bearer {TOKEN}"}

def get_topic_list():
    r = requests.get(f"{BASE_URL}/topiclist", headers=HEADERS, timeout=10)
    if r.status_code == 401:
        raise RuntimeError("Unauthorized: bad token")
    r.raise_for_status()
    return r.json()

def get_chat_history():
    r = requests.get(f"{BASE_URL}/chathistory", headers=HEADERS, timeout=10)
    if r.status_code == 401:
        raise RuntimeError("Unauthorized: bad token")
    r.raise_for_status()
    return r.json()

if __name__ == "__main__":
    print("Topic List:", get_topic_list())
    print("Chat History (30 items):", get_chat_history()[:2], "...")
