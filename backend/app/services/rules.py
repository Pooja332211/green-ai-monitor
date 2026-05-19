import random

def get_response(intent_tag, user_input, intents):
    """Get a response based on intent and apply rule-based reasoning."""
    for intent in intents:
        if intent['tag'] == intent_tag:
            response = random.choice(intent['responses'])
            break
    else:
        # Fallback to unknown
        for intent in intents:
            if intent['tag'] == 'unknown':
                response = random.choice(intent['responses'])
                break
        else:
            response = "I'm not sure how to respond to that."

    # Apply rules
    response = apply_rules(intent_tag, user_input, response)
    return response

def apply_rules(intent_tag, user_input, response):
    """Apply additional rule-based logic to the response."""
    user_lower = user_input.lower()

    if intent_tag == 'reduce_co2_advice':
        if 'ai' in user_lower or 'machine learning' in user_lower or 'training' in user_lower:
            response += " For AI workloads, consider using energy-efficient hardware, optimizing model architectures, and leveraging cloud providers with renewable energy commitments."
        elif 'transport' in user_lower or 'car' in user_lower:
            response += " For transportation, switch to electric vehicles or use public transit to significantly reduce your carbon footprint."
        elif 'food' in user_lower or 'diet' in user_lower:
            response += " In terms of diet, reducing meat consumption, especially beef, can lower emissions since livestock farming is a major contributor."

    elif intent_tag == 'explain_emissions':
        if 'ai' in user_lower:
            response += " In the context of AI, emissions come from the energy used in data centers for training and running models."

    # Add more rules as needed
    return response