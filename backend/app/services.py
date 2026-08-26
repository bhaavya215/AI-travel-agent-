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
    system_prompt = f"""
    You are an expert AI Travel Agent. Parse the user request and generate a structured JSON itinerary.
    Available Flights: {json.dumps(MOCK_FLIGHTS)}
    Available Hotels: {json.dumps(MOCK_HOTELS)}
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