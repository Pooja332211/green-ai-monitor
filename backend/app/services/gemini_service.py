import os
import httpx
import asyncio
import random
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Multiple free models to try (ordered by reliability)
OPENROUTER_MODELS = [
    "mistralai/mistral-7b-instruct:free",
    "huggingfaceh4/zephyr-7b-beta:free",
    "openchat/openchat-7b:free",
    "google/gemma-2-9b-it:free",
]

# Offline responses when API fails (Green AI themed)
OFFLINE_RESPONSES = [
    "Affirmative. Carbon tracking protocols are active. Current emission readings are within optimal parameters. How may I assist with your sustainability analysis?",
    "System Status: Online. I am the Green AI Core. My primary function is to monitor and reduce carbon emissions from machine learning operations. What would you like to analyze?",
    "Neural pathways synchronized. I can help you understand CO2 emissions, optimize model training, or provide sustainability recommendations. Please specify your query.",
    "Protocol engaged. The Green AI Monitor is designed to track energy consumption and carbon footprint of AI workloads. Ask me about reducing emissions or analyzing your models.",
    "Diagnostic complete. All systems nominal. I am ready to assist with emission analysis, optimization strategies, or sustainability metrics. Please proceed with your inquiry."
]

async def get_chat_response(message: str) -> str:
    """
    Send a message to the AI API. Falls back to offline responses if API fails.
    """
    if not GEMINI_API_KEY:
        return random.choice(OFFLINE_RESPONSES)

    system_instruction = (
        "You are the Green AI Monitor System Core, a robotic AI assistant. "
        "Help users track and reduce carbon emissions from AI models. "
        "Be concise, technical, robotic. Use terms like 'Affirmative', 'Analyzing', 'Protocol'."
    )

    is_openrouter = GEMINI_API_KEY.startswith("sk-or-")

    if is_openrouter:
        url = "https://openrouter.ai/api/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {GEMINI_API_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "Green AI Monitor"
        }

        # Try each model once (no retries to be faster)
        for model in OPENROUTER_MODELS:
            payload = {
                "model": model,
                "messages": [
                    {"role": "system", "content": system_instruction},
                    {"role": "user", "content": message}
                ],
                "max_tokens": 200
            }

            try:
                async with httpx.AsyncClient() as client:
                    response = await client.post(url, json=payload, headers=headers, timeout=10.0)
                    
                    if response.status_code == 200:
                        data = response.json()
                        return data["choices"][0]["message"]["content"]
                    # If rate limited or error, try next model immediately
            except Exception:
                continue

        # All API attempts failed - return intelligent offline response
        return get_offline_response(message)

    else:
        # Google Native API
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={GEMINI_API_KEY}"
        headers = {"Content-Type": "application/json"}
        payload = {
            "contents": [{"parts": [{"text": f"{system_instruction}\n\nUser: {message}"}]}]
        }

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(url, json=payload, headers=headers, timeout=15.0)
                if response.status_code == 200:
                    data = response.json()
                    return data["candidates"][0]["content"]["parts"][0]["text"]
        except Exception:
            pass

        return get_offline_response(message)


def get_offline_response(message: str) -> str:
    """Generate contextual offline response based on user message."""
    msg_lower = message.lower()
    
    if any(word in msg_lower for word in ["hello", "hi", "hey", "greet"]):
        return "Greetings, operator. Green AI Core online. How may I assist with your carbon monitoring today?"
    elif any(word in msg_lower for word in ["co2", "carbon", "emission"]):
        return "Analyzing carbon metrics. Typical AI training produces 0.1-1.0 kg CO2 per hour depending on hardware. Recommend using efficient batch sizes and early stopping to minimize emissions."
    elif any(word in msg_lower for word in ["reduce", "optimize", "lower"]):
        return "Optimization Protocol: 1) Reduce batch size to 32. 2) Enable mixed precision (FP16). 3) Use early stopping. 4) Consider model pruning. These can reduce emissions by 40-60%."
    elif any(word in msg_lower for word in ["how", "what", "explain"]):
        return "Affirmative. I track real-time power consumption and calculate CO2 emissions using regional grid factors. Each AI workload is monitored for energy efficiency."
    else:
        return random.choice(OFFLINE_RESPONSES)
