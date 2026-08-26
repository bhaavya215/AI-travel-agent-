from pydantic import BaseModel
from typing import List, Optional

class FlightOption(BaseModel):
    airline: str
    flight_no: str
    price: str
    time: str

class HotelOption(BaseModel):
    name: str
    rating: str
    price: str
    location: str

class DayPlan(BaseModel):
    day: int
    title: str
    activities: List[str]

class TripResponse(BaseModel):
    destination: str
    duration: str
    total_estimated_budget: str
    selected_flight: Optional[FlightOption] = None
    selected_hotel: Optional[HotelOption] = None
    itinerary: List[DayPlan]

class TripRequest(BaseModel):
    prompt: str