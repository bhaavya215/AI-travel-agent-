from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import TripRequest, TripResponse
from app.services import generate_itinerary

app = FastAPI(title="AI Travel Agent API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "AI Travel Agent API is running"}

@app.post("/api/plan-trip", response_model=TripResponse)
async def plan_trip(request: TripRequest):
    try:
        result = generate_itinerary(request.prompt)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))