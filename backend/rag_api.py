from flask import Flask, request, jsonify
from flask_cors import CORS
import os

# Import your RAG pipeline functions
from ragcore.ingest import ingest_dir
from ragcore.embed import VectorIndex
from ragcore.retrieve import HybridRetriever
from ragcore.rerank import Reranker
from ragcore.orchestrate import detect_intent, rewrite_query, compress_context
from ragcore.generate import call_llm
from ragcore.verify import self_check

import os
import requests
import json
from collections import defaultdict
import time

BASE_URL = os.getenv("BASE_URL", "https://nala.ntu.edu.sg") 
API_KEY = os.getenv("API_KEY", "pk_LearnUS_176q45") 
API_URL = "http://127.0.0.1:5000/api/ask"

app = Flask(__name__)
CORS(app)

# Bootstrap index ONCE at startup
retriever, reranker = None, None
def llm(text, system=None, timeout_s=30):
    url = f"{BASE_URL}/api/llm"
    headers = {
        "X-API-Key": API_KEY,
        "Content-Type": "application/json",
    }
    payload = {"text": text}
    if system:
        payload["system"] = system
    r = requests.post(url, headers=headers, data=json.dumps(payload), timeout=timeout_s)
    if not r.ok:
        try:
            print("Error body:", r.json())
        except Exception:
            print("Error text:", r.text)
            r.raise_for_status()
    data = r.json()
    return data
    
def classify_bloom_taxonomy(msg_text):
    bloom_terms = ["Remember", "Understand", "Apply", "Analyze", "Evaluate", "Create"]
    system_prompt = (
        "You are a Bloom's taxonomy classifier. Given the following question, choose ONE term from this list that best fits the cognitive level required:\n"
        f"{bloom_terms}\n"
        "Return ONLY the term, exactly as it appears in the list."
    )
    data = llm(msg_text, system=system_prompt)
    llm_reply = data.get("text", "")
    reply_clean = llm_reply.strip().lower()
    bloom_level = None
    for term in bloom_terms:
        if term.lower() in reply_clean:
            bloom_level = term
            break
    if not bloom_level:
        bloom_level = "Unknown"
    return bloom_level
    
def print_chat_history(data):
    # Group by conversation
    convos = defaultdict(list)
    for msg in data:
        title = msg.get('convo_title', f"Conversation {msg.get('convo_id', '?')}")
        convos[title].append(msg)

    for title, messages in convos.items():
        print(f"=== Conversation: {title} ===")
        for m in messages:
            ts = m.get('msg_timestamp', '')
            sender = m.get('msg_sender', '')
            text = m.get('msg_text', '')
            # If text is a JSON string, parse it
            try:
                import json
                text_obj = json.loads(text)
                if isinstance(text_obj, list) and text_obj and 'text' in text_obj[0]:
                    text = text_obj[0]['text']
            except Exception:
                pass
            prefix = '' if sender == 'user' else '  '
            print(f"[{ts}] {sender}:\\n{prefix}{text}\\n")
            
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

    return data

def get_chat_history(chatbot_id: int, **filters): 
    url = f"{BASE_URL}/api/chathistory" 
    headers = {"X-API-Key": API_KEY} 
    params = {"chatbot_id": chatbot_id, **filters} 
    bloom_terms = ["Remember", "Understand", "Apply", "Analyze", "Evaluate", "Create"]
    r = requests.get(url, headers=headers, params=params, timeout=20) 
    try: 
        r.raise_for_status() 
    except requests.HTTPError: 
        try: 
            print("Error body:", r.json()) 
        except Exception: 
            print("Error text:", r.text)
            raise 
    data = r.json() 
    print(f"Returned {len(data)} rows")

    conversation_ids = []
    for msg in data:
        convo_id = msg.get('conversation_id') or msg.get('convo_id')
        if convo_id is not None:
            conversation_ids.append(convo_id)
    print("All conversation IDs:", conversation_ids)
    
    # Group messages by conversation title
    convos = defaultdict(list)
    for msg in data:
        title = msg.get('convo_title', f"Conversation {msg.get('convo_id', '?')}")
        convos[title].append(msg)

    results = []
    for title, messages in convos.items():
        print(f"Conversation Title: {title}")
        for msg in messages:
            msg_text = msg.get("msg_text", "")
            try:
                text_obj = json.loads(msg_text)
                if isinstance(text_obj, list) and text_obj and 'text' in text_obj[0]:
                    msg_text = text_obj[0]['text']
            except Exception:
                pass
            topic, llm_reply = determine_topic(msg_text)
            bloom_level = classify_bloom_taxonomy(msg_text)
            print(f"Detected topic: {topic}")
            msg_sender = msg.get("msg_sender", "")
            if msg_sender == "user":
               results.append({"msg_text": msg_text, "topic": topic, "bloom_level": bloom_level})
        print("-" * 40)

    bloom_counts = defaultdict(int)
    total = len(results)
    
    for item in results:
        bloom_counts[item["bloom_level"]] += 1
        
    print("Bloom's Taxonomy Level Percentages:")
    bloom_percentages = {}
    
    for level in bloom_terms:
        count = bloom_counts[level]
        percent = (count / total) * 100 if total > 0 else 0
        bloom_percentages[level] = percent
        print(f"{level}: {percent:.1f}% ({count}/{total})")

    # Now use bloom_percentages for all percentage calculations
    highest_level = max(bloom_percentages, key=bloom_percentages.get)
    lowest_level = min(bloom_percentages, key=bloom_percentages.get)
    highest_index = bloom_terms.index(highest_level)
    lowest_index = bloom_terms.index(lowest_level)
    diff = bloom_percentages[highest_level] - bloom_percentages[lowest_level]

    # Generate message
    if highest_index > lowest_index:
        custom_msg = (
            f"Your strongest cognitive skill is '{highest_level}' ({bloom_percentages[highest_level]:.1f}%), "
            f"which is {diff:.1f}% higher than your weakest skill '{lowest_level}' ({bloom_percentages[lowest_level]:.1f}%). "
            "This suggests you excel at higher-order thinking tasks!"
        )
    else:
        custom_msg = (
            f"Your strongest cognitive skill is '{highest_level}' ({bloom_percentages[highest_level]:.1f}%), "
            f"but it is at a lower Bloom's level than your weakest skill '{lowest_level}' ({bloom_percentages[lowest_level]:.1f}%). "
            "Consider practicing more higher-order thinking tasks."
        )
    print("Custom Bloom Analysis:", custom_msg)
    
    llm_reply = determine_topic_aptitude(results)
    print(llm_reply)
    return results,custom_msg, conversation_ids
   
def determine_topic_aptitude(results):
    # Count occurrences for each topic
    topic_counts = defaultdict(int)
    for item in results:
        topic = item.get("topic", "Unknown")
        topic_counts[topic] += 1

    # Prepare summary for LLM
    summary = "\n".join([f"{i+1}. {item['msg_text']} (Topic: {item['topic']})" for i, item in enumerate(results)])
    topic_list = list(set([item['topic'] for item in results if item['topic'] != "Unknown"]))
    if not topic_list:
        print("No valid topics found in chat history.")
        return None

    system_prompt = (
        "You are an aptitude analyzer. Given the following messages from a user to an LLM, each labeled with a topic, "
        "determine which topic the user is strongest at and which they are weakest at, based on the content and frequency. "
        f"Topics: {topic_list}\n"
        "Messages:\n"
        f"{summary}\n"
        "Return your answer as:\nStrongest: <topic>\nWeakest: <topic>\n"
    )

    # Send to LLM
    data = llm(summary, system=system_prompt)
    llm_reply = data.get("text", "")
    
    strongest = weakest = None
    for line in llm_reply.splitlines():
        if line.lower().startswith("strongest:"):
            strongest = line.split(":", 1)[1].strip()
        elif line.lower().startswith("weakest:"):
            weakest = line.split(":", 1)[1].strip()
            
    return strongest,weakest
    
def determine_topic(msg_content):
    #print(f"Classifying topic for: {msg_content}")
    topics = get_topic_list(3)
    start = time.time()
    topic_list = topics.get("topic_list", ["Unknown"])
    system_prompt = (
        "You are a topic classifier. Given the following message, choose ONE topic from this list that best fits the message:\n"
        f"{topic_list}\n"
        "Return ONLY the topic name, exactly as it appears in the list."
    )
    # Use the llm() function to send the request
    data = llm(msg_content, system=system_prompt)
    llm_reply = data.get("topic") or data.get("text") or ""
    reply_clean = llm_reply.strip().lower()
    topic = None
    for t in topic_list:
        if t.lower() in reply_clean:
            topic = t
            break
    if not topic:
        print(f"Could not match topic. LLM reply: {llm_reply}")
        topic = "Unknown"
    print(f"Topic: {topic}")
    elapsed = time.time() - start
    print(f"Elapsed time: {elapsed:.2f} seconds")
    return topic, llm_reply

# Global cache for analytics
weekly_topics_cache = None

def process_weekly_topics():
    chatbot_id = 3
    user_id = 20
    convo_id = 84
    topic_data = get_topic_list(chatbot_id)
    topic_list = topic_data.get("topic_list", ["Unknown"])
    results,bloom_message, conversation_ids = get_chat_history(chatbot_id, user_id=user_id, convo_id=convo_id)
    strongest, weakest = determine_topic_aptitude(results)
    return {
        "strongest": strongest,
        "weakest": weakest,
        "topic_list": topic_list,
        "bloom_message": bloom_message,
        "conversation_ids": conversation_ids
    }
    
def bootstrap_index(data_dir="data/raw"):
    global retriever, reranker
    chunks = ingest_dir(data_dir)
    index_path = "faiss.index"
    vec = VectorIndex("intfloat/e5-small-v2")
    if os.path.exists(index_path):
        vec.store = chunks
        vec.load_index(index_path)
    else:
        vec.build(chunks)
    vec.save_index(index_path)
    retriever = HybridRetriever(chunks, vec)
    reranker = Reranker("cross-encoder/ms-marco-MiniLM-L-6-v2")

def answer(query: str, retriever, reranker, top_k=8):
    intent = detect_intent(query)
    q2 = rewrite_query(query, intent)
    candidates = retriever.retrieve(q2, top_k=40)
    ranked = reranker.rerank(q2, candidates, top_k=top_k)
    ctx = compress_context(ranked, max_chars=3500)
    ans = call_llm(query, ctx, model=os.getenv("RAG_LLM", "gpt-4o-mini"))
    issues = self_check(ans, query)
    return ans, issues

@app.route('/api/ask', methods=['POST'])
def ask():
    data = request.get_json()
    user_query = data.get('query', '')
    if not user_query:
        return jsonify({'error': 'No query provided'}), 400
    if retriever is None or reranker is None:
        return jsonify({'error': 'RAG index not initialized'}), 500
    try:
        ans, issues = answer(user_query, retriever, reranker)
        return jsonify({'answer': ans, 'checks': issues})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/weekly_topics', methods=['GET'])
def weekly_topics():
    global weekly_topics_cache
    if weekly_topics_cache is None:
        # Fallback: process if not available
        weekly_topics_cache = process_weekly_topics()
    return jsonify(weekly_topics_cache)
    
if __name__ == '__main__':
    bootstrap_index("data/raw")  # or your actual data dir
    weekly_topics_cache = process_weekly_topics()
    app.run(debug=False, port=5000)  