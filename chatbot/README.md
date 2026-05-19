# Green AI Monitor Chatbot

## Overview

This chatbot module is part of the Green AI Monitor project. It provides educational information on carbon emissions, answers 'why' questions about climate change, and offers practical advice on reducing CO2 emissions, with special considerations for AI and machine learning workloads.

## Features

- **Emissions Explanations**: Defines and explains carbon emissions and their sources.
- **Why Questions**: Answers inquiries about the impacts of emissions on climate change.
- **Reduction Advice**: Provides actionable tips for lowering carbon footprint, including AI-specific recommendations.
- **Simple NLP**: Uses keyword matching for intent recognition.
- **Rule-Based Reasoning**: Applies contextual rules to tailor responses based on user input.

## Files

- [`bot.py`](bot.py): Main chatbot logic, runnable as a console script for interactive chat.
- [`intents.json`](intents.json): JSON file containing predefined intents, patterns, and responses.
- [`nlp_utils.py`](nlp_utils.py): Utilities for natural language processing, including text preprocessing and intent matching.
- [`rules.py`](rules.py): Implements rule-based reasoning to enhance responses with additional context.
- [`README.md`](README.md): This documentation file.

## Requirements

- Python 3.x
- NLTK library for tokenization (`pip install nltk`)

## Running the Chatbot

1. Ensure you have the required dependencies installed.
2. Navigate to the `chatbot/` directory.
3. Run the script:

   ```bash
   python bot.py
   ```

4. Interact with the chatbot via the console. Type 'quit', 'exit', 'bye', or 'goodbye' to end the session.

## Example Interaction

```
Green AI Monitor Chatbot: Hello! Ask me about emissions, why they're important, or how to reduce CO2. Type 'quit' to exit.
You: What are emissions?
Bot: Carbon emissions refer to the release of carbon dioxide (CO2) and other greenhouse gases into the atmosphere, primarily from human activities like burning fossil fuels, deforestation, and industrial processes. These gases trap heat in the atmosphere, leading to global warming and climate change.
You: How to reduce CO2 for AI?
Bot: To reduce CO2 emissions: 1) Use renewable energy sources like solar or wind. 2) Opt for public transportation, biking, or walking instead of driving. 3) Reduce meat consumption and choose plant-based foods. 4) Conserve energy at home by using LED bulbs and unplugging devices. 5) Plant trees and support reforestation efforts. For AI workloads, consider using energy-efficient hardware, optimizing model architectures, and leveraging cloud providers with renewable energy commitments.
You: bye
Bot: Goodbye! Stay green!
```

## Integration with Backend

The chatbot can be integrated into the Green AI Monitor backend by importing the relevant functions from `nlp_utils.py` and `rules.py`. For example, create an API endpoint that accepts user input, processes it through `match_intent()`, and returns a response via `get_response()`. This allows the chatbot to be used in web interfaces or other applications.

## Customization

- Add more intents to `intents.json` for expanded functionality.
- Enhance rules in `rules.py` for more sophisticated reasoning.
- Improve NLP in `nlp_utils.py` by incorporating more advanced techniques if needed.