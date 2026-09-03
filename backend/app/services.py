import os
import json
from google import genai
from google.genai import types
from dotenv import load_dotenv
from app.schemas import TripResponse

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY is missing from environment variables or .env file.")

client = genai.Client(api_key=api_key)

MOCK_FLIGHTS = [
    {"airline": "IndiGo", "flight_no": "6E-204", "price": "INR 6,500", "time": "08:00 AM - 10:30 AM"},
    {"airline": "Air India", "flight_no": "AI-803", "price": "INR 8,200", "time": "11:30 AM - 02:00 PM"}
]

MOCK_HOTELS = [
    {"name": "Grand Resort & Spa", "rating": "4.5/5", "price": "INR 4,500/night", "location": "Near Beach"},
    {"name": "Urban Boutique Stay", "rating": "4.2/5", "price": "INR 2,800/night", "location": "City Center"}
]

def generate_itinerary(user_prompt: str) -> dict:
    system_prompt = """
    You are DiscoverAI, an elite travel planning assistant. 
    CRITICAL RULE: Before generating ANY JSON itinerary, you MUST verify that the user has provided all 4 of the following details:
    1. Origin City (Where they are starting from)
    2. Destination City
    3. Number of travelers
    4. Mode of transport (Flight or Train)

    If ANY of these 4 details are missing from the prompt, you MUST NOT generate the itinerary. Instead, output a JSON object exactly in this format:
    {
        "needs_clarification": true,
        "message": "I would love to plan this trip! To get started, could you let me know your starting city, how many people are traveling, and if you prefer to fly or take a train?"
    }

    If all 4 details are present, output the full itinerary JSON with "needs_clarification": false.
"""
    
    response = client.models.generate_content(
        model='gemini-3.6-flash',
        contents=f"{system_prompt}\nUser Request: {user_prompt}",
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=TripResponse,
            temperature=0.2
        )
    )
    
    return json.loads(response.text)