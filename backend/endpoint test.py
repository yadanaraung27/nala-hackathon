import os 
import requests 
BASE_URL = os.getenv("BASE_URL", "https://nala.ntu.edu.sg") 
API_KEY = os.getenv("API_KEY", "pk_LearnUS_176q45") 
def get_topic_list(chatbot_id=3, timeout=15): 
    url = f"{BASE_URL}/api/topiclist" 
    headers = {"X-API-Key": API_KEY} 
    params = {"chatbot_id": chatbot_id} 
    resp = requests.get(url, headers=headers, params=params, timeout=timeout) 
    try: 
        resp.raise_for_status() 
    except requests.HTTPError: 
        try: 
            print("Error body:", resp.json()) 
        except Exception: 
            print("Error text:", resp.text) 
        raise 
    data = resp.json() 
    print("Chatbot:", data.get("chatbot_id")) 
    print("Topics:", data.get("topic_list"))

    return data

def get_chat_history(chatbot_id: int, **filters): 
    url = f"{BASE_URL}/api/chathistory" 
    headers = {"X-API-Key": API_KEY} 
    params = {"chatbot_id": chatbot_id, **filters} 
    r = requests.get(url, headers=headers, params=params, timeout=20) 
    try: 
        r.raise_for_status() 
    except requests.HTTPError: 
        try: print("Error body:", r.json()) 
        except Exception: print("Error text:", r.text)
        raise 
    data = r.json() 
    print(f"Returned {len(data)} rows") 
    return data


if __name__ == "__main__":
    get_chat_history(3, limit=5, order="desc")
