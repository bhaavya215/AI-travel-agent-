"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Plane, Hotel, MapPin, CalendarDays, ArrowRight, LayoutDashboard, Sparkles, Compass, History, Train, Bus, Bookmark, Search } from "lucide-react";

export default function Home() {
  const [currentView, setCurrentView] = useState("landing");
  const [dashboardTab, setDashboardTab] = useState("chat");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [savedTrips, setSavedTrips] = useState([]);
  
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Welcome to DiscoverAI! Where are you dreaming of exploring next?",
      data: null
    }
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleBookingRedirect = (type, query) => {
    let url = "";
    if (type === 'flight') url = `https://www.google.com/travel/flights?q=Flights+to+${query}`;
    if (type === 'hotel') url = `https://www.booking.com/searchresults.html?ss=${query}`;
    if (type === 'train') url = `https://www.irctc.co.in/`;
    window.open(url, '_blank');
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userText, data: null }]);
    setIsLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/plan-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userText }),
      });
      const data = await res.json();
      
      if (data.needs_clarification || !data.destination || !data.itinerary) {
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            text: data.message || data.response || "Could you please specify your starting city, the number of travelers, and your preferred mode of transport (flight or train)?",
            data: null
          }
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            text: `I've put together a wonderful ${data.duration} escape to ${data.destination} matching your budget of ${data.total_estimated_budget}!`,
            data: data
          }
        ]);
      }
    } catch (err) {
      setMessages((prev) => [...prev, { role: "ai", text: "Connection error. Make sure your FastAPI backend is running.", data: null }]);
    }
    
    setIsLoading(false);
  };

  const handleSaveTrip = (tripData) => {
    if (!savedTrips.some(trip => trip === tripData)) {
      setSavedTrips([...savedTrips, tripData]);
    }
  };

  const BookingInterface = ({ type, icon: Icon }) => (
    <div className="flex-1 overflow-y-auto p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h2 className="text-3xl font-serif font-bold text-white mb-2 flex items-center gap-3">
            <Icon className="w-8 h-8 text-amber-400" /> Book {type}
          </h2>
          <p className="text-stone-400">Search and book direct tickets for your next adventure.</p>
        </div>
        
        <div className="bg-[#1C1917] p-6 rounded-3xl border border-stone-800 shadow-xl flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2 block">From</label>
            <input type="text" placeholder="Departure City" className="w-full bg-[#141210] border border-stone-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500" />
          </div>
          <div className="flex-1">
            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2 block">To</label>
            <input type="text" placeholder="Destination" className="w-full bg-[#141210] border border-stone-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500" />
          </div>
          <div className="flex-1">
            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2 block">Date</label>
            <input type="date" className="w-full bg-[#141210] border border-stone-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500" />
          </div>
          <div className="flex items-end">
            <button className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-8 py-3 rounded-xl transition-colors flex items-center gap-2 h-[50px]">
              <Search className="w-4 h-4" /> Search
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center py-20 border-2 border-dashed border-stone-800 rounded-3xl">
          <p className="text-stone-500 font-medium text-lg">Enter details above to view live {type.toLowerCase()} schedules.</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#141210] text-stone-100 font-sans selection:bg-amber-500 selection:text-black">
      
      <nav className={`z-50 px-8 py-6 flex items-center justify-between ${
        currentView === "landing" 
          ? "absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent" 
          : "sticky top-0 bg-[#141210] border-b border-stone-800"
      }`}>
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setCurrentView("landing")}>
          <div className="w-10 h-10 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg">
            <Compass className="w-5 h-5" />
          </div>
          <span className="text-xl font-serif tracking-tight font-bold text-white">Discover<span className="text-amber-400 font-sans">AI</span></span>
        </div>
        <div className="flex items-center gap-8">
          <button 
            onClick={() => setCurrentView("landing")} 
            className={`text-sm font-medium transition-colors ${currentView === "landing" ? "text-amber-400 font-semibold" : "text-stone-300 hover:text-white"}`}
          >
            Home
          </button>
          <button 
            onClick={() => {
              setCurrentView("dashboard");
              setDashboardTab("chat");
            }} 
            className={`text-sm font-medium transition-colors ${currentView === "dashboard" ? "text-amber-400 font-semibold" : "text-stone-300 hover:text-white"}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => {
              setCurrentView("dashboard");
              setDashboardTab("chat");
            }}
            className="bg-amber-500 hover:bg-amber-400 text-stone-950 px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg"
          >
            Start Planning
          </button>
        </div>
      </nav>

      {currentView === "landing" && (
        <div className="relative min-h-screen flex flex-col justify-between">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80" 
              alt="Cinematic Mountains" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141210] via-black/50 to-black/70"></div>
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-8 pt-44 pb-20 text-center flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-amber-500/30 text-amber-300 text-xs font-semibold mb-6 tracking-wide uppercase shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Immersive AI Travel Intelligence
            </div>
            <h1 className="text-5xl md:text-8xl font-serif font-normal tracking-tight max-w-4xl leading-[1.1] text-white drop-shadow-md">
              Discover the world, <span className="italic font-serif text-amber-400">effortlessly.</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-stone-300 max-w-xl leading-relaxed font-light drop-shadow">
              Your personal travel companion that turns daydreams into fully customized itineraries, seamless transport bookings, and unforgettable memories.
            </p>
            <div className="mt-10 flex gap-4 justify-center">
              <button 
                onClick={() => {
                  setCurrentView("dashboard");
                  setDashboardTab("chat");
                }}
                className="bg-amber-500 hover:bg-amber-400 text-stone-950 px-8 py-4 rounded-full font-bold transition-all flex items-center gap-3 text-base shadow-2xl shadow-amber-500/20"
              >
                Open Dashboard <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="relative z-10 max-w-6xl mx-auto px-8 pb-16 w-full grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative group rounded-3xl overflow-hidden shadow-xl h-48 border border-white/10">
              <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80" alt="Goa Beach" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-5">
                <span className="text-white font-serif font-bold text-lg">Goa Beaches</span>
              </div>
            </div>
            <div className="relative group rounded-3xl overflow-hidden shadow-xl h-48 border border-white/10">
              <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80" alt="Himalayas" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-5">
                <span className="text-white font-serif font-bold text-lg">Himalayan Peaks</span>
              </div>
            </div>
            <div className="relative group rounded-3xl overflow-hidden shadow-xl h-48 border border-white/10">
              <img src="https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80" alt="Udaipur Palace" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-5">
                <span className="text-white font-serif font-bold text-lg">Udaipur Palaces</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentView === "dashboard" && (
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#141210]">
          
          <aside className="w-full md:w-72 bg-[#1C1917] border-r border-stone-800 p-6 flex flex-col justify-between overflow-y-auto hidden md:flex">
            <div className="space-y-8">
              
              <div className="space-y-2">
                <p className="text-xs font-bold text-stone-600 uppercase px-3 tracking-widest mb-3">Intelligence</p>
                <button 
                  onClick={() => setDashboardTab("chat")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-colors ${dashboardTab === 'chat' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'text-stone-400 hover:text-white hover:bg-[#292524]'}`}
                >
                  <Sparkles className="w-5 h-5" /> AI Trip Planner
                </button>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-stone-600 uppercase px-3 tracking-widest mb-3">Direct Booking</p>
                <button 
                  onClick={() => setDashboardTab("flights")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-colors ${dashboardTab === 'flights' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'text-stone-400 hover:text-white hover:bg-[#292524]'}`}
                >
                  <Plane className="w-5 h-5" /> Flights
                </button>
                <button 
                  onClick={() => setDashboardTab("trains")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-colors ${dashboardTab === 'trains' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'text-stone-400 hover:text-white hover:bg-[#292524]'}`}
                >
                  <Train className="w-5 h-5" /> Trains
                </button>
                <button 
                  onClick={() => setDashboardTab("buses")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-colors ${dashboardTab === 'buses' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'text-stone-400 hover:text-white hover:bg-[#292524]'}`}
                >
                  <Bus className="w-5 h-5" /> Buses
                </button>
                <button 
                  onClick={() => setDashboardTab("hotels")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-colors ${dashboardTab === 'hotels' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'text-stone-400 hover:text-white hover:bg-[#292524]'}`}
                >
                  <Hotel className="w-5 h-5" /> Hotels & Stays
                </button>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-stone-600 uppercase px-3 tracking-widest mb-3">My Account</p>
                <button 
                  onClick={() => setDashboardTab("history")}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-colors ${dashboardTab === 'history' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'text-stone-400 hover:text-white hover:bg-[#292524]'}`}
                >
                  <div className="flex items-center gap-3">
                    <History className="w-5 h-5" /> Saved Journeys
                  </div>
                  {savedTrips.length > 0 && (
                    <span className="bg-amber-500 text-stone-950 text-xs py-0.5 px-2 rounded-full font-bold">{savedTrips.length}</span>
                  )}
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-stone-800 flex items-center gap-3 px-2 mt-8">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-sm">
                BS
              </div>
              <div>
                <p className="text-sm font-bold text-white">Bhaavya Srivastava</p>
                <p className="text-xs text-stone-500 font-medium">Active Planner</p>
              </div>
            </div>
          </aside>

          {dashboardTab === "chat" && (
            <div className="flex-1 flex flex-col bg-[#141210] relative overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6 pb-32">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                    
                    <div className={`max-w-[85%] rounded-2xl p-4 shadow-md ${
                      msg.role === "user" 
                        ? "bg-amber-500 text-stone-950 font-medium rounded-br-sm" 
                        : "bg-[#1C1917] border border-stone-800 text-stone-200 rounded-bl-sm"
                    }`}>
                      <p className="leading-relaxed text-sm md:text-base">{msg.text}</p>
                    </div>

                    {msg.data && (
                      <div className="mt-6 w-full max-w-3xl space-y-6">
                        
                        <div className="flex justify-end">
                          <button 
                            onClick={() => handleSaveTrip(msg.data)}
                            className="flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-stone-200 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                          >
                            <Bookmark className="w-4 h-4" /> 
                            {savedTrips.includes(msg.data) ? "Saved to History" : "Save this Journey"}
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          
                          {msg.data.selected_flight && (
                            <div className="bg-[#1C1917] p-5 rounded-2xl border border-stone-800 shadow-sm">
                              <div className="flex items-center gap-3 mb-3 text-amber-400">
                                <Plane className="w-5 h-5" />
                                <h3 className="font-semibold text-white">Recommended Flight</h3>
                              </div>
                              <p className="text-stone-200 font-medium">{msg.data.selected_flight.airline} ({msg.data.selected_flight.flight_no})</p>
                              <p className="text-xs text-stone-400 mt-1">{msg.data.selected_flight.time}</p>
                              <div className="mt-4 flex justify-between items-center">
                                <span className="text-lg font-bold text-white">{msg.data.selected_flight.price}</span>
                                <button onClick={() => handleBookingRedirect('flight', msg.data.destination)} className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 px-4 py-2 rounded-full text-xs font-semibold transition-colors border border-amber-500/20">Book Flight</button>
                              </div>
                            </div>
                          )}

                          {msg.data.selected_train && (
                            <div className="bg-[#1C1917] p-5 rounded-2xl border border-stone-800 shadow-sm">
                              <div className="flex items-center gap-3 mb-3 text-amber-400">
                                <Train className="w-5 h-5" />
                                <h3 className="font-semibold text-white">Recommended Train</h3>
                              </div>
                              <p className="text-stone-200 font-medium">{msg.data.selected_train.train_name} ({msg.data.selected_train.train_no})</p>
                              <p className="text-xs text-stone-400 mt-1">{msg.data.selected_train.time}</p>
                              <div className="mt-4 flex justify-between items-center">
                                <span className="text-lg font-bold text-white">{msg.data.selected_train.price}</span>
                                <button onClick={() => handleBookingRedirect('train', '')} className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 px-4 py-2 rounded-full text-xs font-semibold transition-colors border border-amber-500/20">Book Train</button>
                              </div>
                            </div>
                          )}

                          <div className="bg-[#1C1917] p-5 rounded-2xl border border-stone-800 shadow-sm">
                            <div className="flex items-center gap-3 mb-3 text-amber-400">
                              <Hotel className="w-5 h-5" />
                              <h3 className="font-semibold text-white">Hotel Stay</h3>
                            </div>
                            <p className="text-stone-200 font-medium">{msg.data.selected_hotel?.name}</p>
                            <p className="text-xs text-stone-400 mt-1">{msg.data.selected_hotel?.location} • {msg.data.selected_hotel?.rating}</p>
                            <div className="mt-4 flex justify-between items-center">
                              <span className="text-lg font-bold text-white">{msg.data.selected_hotel?.price}</span>
                              <button onClick={() => handleBookingRedirect('hotel', msg.data.destination)} className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 px-4 py-2 rounded-full text-xs font-semibold transition-colors border border-amber-500/20">Book Hotel</button>
                            </div>
                          </div>
                        </div>

                        <div className="bg-[#1C1917] p-6 rounded-2xl border border-stone-800 shadow-sm">
                          <div className="flex items-center gap-3 mb-6 text-amber-400">
                            <CalendarDays className="w-5 h-5" />
                            <h3 className="font-semibold text-white text-base">Day-by-Day Itinerary</h3>
                          </div>
                          <div className="space-y-6">
                            {msg.data.itinerary?.map((day) => (
                              <div key={day.day} className="relative pl-6 border-l-2 border-amber-500/40">
                                <div className="absolute -left-[9px] top-0 bg-amber-500 w-4 h-4 rounded-full border-4 border-[#1C1917]"></div>
                                <h4 className="font-bold text-white mb-2 text-sm">Day {day.day}: {day.title}</h4>
                                <ul className="space-y-2">
                                  {day.activities?.map((act, i) => (
                                    <li key={i} className="flex items-start gap-2 text-stone-400 text-xs md:text-sm">
                                      <MapPin className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                                      <span>{act}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-start">
                    <div className="bg-[#1C1917] border border-stone-800 rounded-2xl rounded-bl-sm p-4 shadow-sm flex gap-2 items-center">
                      <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="absolute bottom-0 w-full bg-[#141210]/90 backdrop-blur-md border-t border-stone-800 p-4">
                <div className="max-w-3xl mx-auto relative flex items-center">
                  <input
                    type="text"
                    className="w-full bg-[#1C1917] border border-stone-800 text-white placeholder-stone-500 rounded-full pl-6 pr-14 py-3.5 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                    placeholder="Ask DiscoverAI, e.g., Plan a 3-day quiet getaway to Kyoto..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className="absolute right-2 bg-amber-500 hover:bg-amber-400 disabled:bg-stone-800 text-stone-950 p-2 rounded-full transition-colors flex items-center justify-center shadow-md font-bold"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {dashboardTab === "history" && (
            <div className="flex-1 overflow-y-auto p-6 md:p-10">
              <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl font-serif font-bold text-white mb-2 flex items-center gap-3">
                  <History className="w-8 h-8 text-amber-400" /> Saved Journeys
                </h2>
                <p className="text-stone-400 mb-10">Review and book itineraries you've saved from your AI assistant.</p>

                {savedTrips.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-stone-800 rounded-3xl">
                    <Bookmark className="w-12 h-12 text-stone-700 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No journeys saved yet</h3>
                    <p className="text-stone-500 text-center max-w-md">Chat with DiscoverAI to generate an itinerary, then click "Save this Journey" to keep it here.</p>
                    <button 
                      onClick={() => setDashboardTab("chat")}
                      className="mt-6 bg-stone-800 hover:bg-stone-700 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-colors"
                    >
                      Start Planning
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {savedTrips.map((trip, idx) => (
                      <div key={idx} className="bg-[#1C1917] p-6 rounded-3xl border border-stone-800 shadow-xl hover:border-amber-500/30 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">{trip.duration}</span>
                            <h3 className="text-2xl font-serif font-bold text-white mt-1">{trip.destination}</h3>
                          </div>
                          <span className="bg-stone-800 text-stone-300 text-xs px-3 py-1 rounded-full font-semibold">{trip.total_estimated_budget}</span>
                        </div>
                        
                        <div className="space-y-3 mb-6">
                          {trip.selected_flight && (
                            <div className="flex items-center gap-3 text-sm text-stone-400">
                              <Plane className="w-4 h-4 text-amber-500" /> {trip.selected_flight.airline} ({trip.selected_flight.price})
                            </div>
                          )}
                          {trip.selected_train && (
                            <div className="flex items-center gap-3 text-sm text-stone-400">
                              <Train className="w-4 h-4 text-amber-500" /> {trip.selected_train.train_name} ({trip.selected_train.price})
                            </div>
                          )}
                          <div className="flex items-center gap-3 text-sm text-stone-400">
                            <Hotel className="w-4 h-4 text-amber-500" /> {trip.selected_hotel?.name} ({trip.selected_hotel?.price})
                          </div>
                        </div>

                        <button className="w-full bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-stone-950 font-bold px-4 py-3 rounded-xl transition-colors border border-amber-500/20">
                          View & Book Details
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {dashboardTab === "flights" && <BookingInterface type="Flights" icon={Plane} />}
          {dashboardTab === "trains" && <BookingInterface type="Trains" icon={Train} />}
          {dashboardTab === "buses" && <BookingInterface type="Buses" icon={Bus} />}
          {dashboardTab === "hotels" && <BookingInterface type="Hotels" icon={Hotel} />}

        </div>
      )}

    </div>
  );
}