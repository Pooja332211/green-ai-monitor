import os
import httpx
import asyncio
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

async def list_models():
    url = f"https://generativelanguage.googleapis.com/v1beta/models?key={API_KEY}"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            models = response.json()
            print("Available Models:")
            for m in models.get('models', []):
                print(f"- {m['name']}")
        else:
            print("Error:", response.text)

if __name__ == "__main__":
    asyncio.run(list_models())
