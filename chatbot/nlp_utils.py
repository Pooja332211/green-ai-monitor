import json
import re
import nltk
from nltk.tokenize import word_tokenize

# Download NLTK data if not present (run once)
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

def load_intents(file_path):
    """Load intents from JSON file."""
    with open(file_path, 'r') as file:
        data = json.load(file)
    return data['intents']

def preprocess_text(text):
    """Preprocess user input: lowercase, remove punctuation, tokenize."""
    text = text.lower()
    text = re.sub(r'[^\w\s]', '', text)  # Remove punctuation
    tokens = word_tokenize(text)
    return tokens

def match_intent(user_input, intents):
    """Match user input to an intent using keyword matching."""
    preprocessed_input = preprocess_text(user_input)
    input_words = set(preprocessed_input)

    for intent in intents:
        for pattern in intent['patterns']:
            pattern_words = set(preprocess_text(pattern))
            if pattern_words & input_words:  # Intersection
                return intent['tag']
    return 'unknown'