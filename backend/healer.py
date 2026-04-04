import os
import json
from groq import Groq

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def heal_item(item_name: str, restaurant_name: str) -> dict:
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": f"""
                A receipt OCR misread an item from '{restaurant_name}'.
                The garbled item name is: '{item_name}'
                Guess the most likely correct menu item name and price.
                Return ONLY this JSON, nothing else:
                {{"verified_name": "...", "price": 0.00}}
                """
            }
        ]
    )
    text = response.choices[0].message.content.strip().replace("```json","").replace("```","")
    return json.loads(text)
