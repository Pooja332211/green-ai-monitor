from nlp_utils import load_intents, match_intent
from rules import get_response

def chat():
    """Run the chatbot in console mode."""
    print("Green AI Monitor Chatbot: Hello! Ask me about emissions, why they're important, or how to reduce CO2. Type 'quit' to exit.")
    while True:
        try:
            user_input = input("You: ").strip()
            if not user_input:
                continue
            if user_input.lower() in ['quit', 'exit', 'bye', 'goodbye']:
                print("Bot: Goodbye! Stay green!")
                break
            intent = match_intent(user_input, intents)
            response = get_response(intent, user_input, intents)
            print(f"Bot: {response}")
        except KeyboardInterrupt:
            print("\nBot: Goodbye!")
            break

if __name__ == "__main__":
    intents = load_intents('intents.json')
    chat()