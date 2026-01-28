# ragcore/generate.py
import os,json,requests

SYSTEM = """You are a precise assistant. 
- Use ONLY provided context to answer.
- If missing info, say what’s missing.
- Cite sources inline as [n] where n indexes the context list.
- Do NOT include filenames in your answer, only use the citation numbers."""

BASE_URL = os.getenv("BASE_URL", "https://nala.ntu.edu.sg") 
API_KEY = os.getenv("API_KEY", "pk_LearnUS_176q45") 
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.2:3b") 

def build_prompt(query: str, context_chunks: list[dict]):
    ctx = []
    for i, c in enumerate(context_chunks, 1):
        src = c["chunk"]["meta"].get("filename", "unknown")
        ctx.append(f"[{i}] ({src})\n{c['chunk']['text']}")
    ctx_txt = "\n\n".join(ctx)
    user = f"Question: {query}\n\nContext:\n{ctx_txt}\n\nAnswer with citations like [1], [2]."
    return SYSTEM, user

def call_llm(query: str, context_chunks: list[dict], model=None):
    """
    Call Ollama API for LLM generation
    """
    system, user = build_prompt(query, context_chunks)
    
    # Use Ollama's chat API endpoint
    url = f"{OLLAMA_BASE_URL}/api/chat"
    
    messages = [
        {"role": "system", "content": system},
        {"role": "user", "content": user}
    ]
    
    payload = {
        "model": model or OLLAMA_MODEL,
        "messages": messages,
        "stream": False,
        "options": {
            "temperature": 0.7
        }
    }
    
    r = requests.post(url, json=payload, timeout=60)
    r.raise_for_status()
    
    response_data = r.json()
    return response_data.get("message", {}).get("content", "")
