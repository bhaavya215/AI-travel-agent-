"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Plane, Hotel, MapPin, CalendarDays, ArrowRight, LayoutDashboard, Sparkles, Compass } from "lucide-react";

export default function Home() {
  const [currentView, setCurrentView] = useState("landing");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
      
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: `I've put together a wonderful ${data.duration} escape to ${data.destination} matching your budget of ${data.total_estimated_budget}!`,
          data: data
        }
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { role: "ai", text: "Connection error. Make sure your FastAPI backend is running.", data: null }]);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#141210] text-stone-100 font-sans selection:bg-amber-500 selection:text-black">
      
      {/* Navbar */}
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
            onClick={() => setCurrentView("dashboard")} 
            className={`text-sm font-medium transition-colors ${currentView === "dashboard" ? "text-amber-400 font-semibold" : "text-stone-300 hover:text-white"}`}
          >
            Dashboard & AI Assistant
          </button>
          <button 
            onClick={() => setCurrentView("dashboard")}
            className="bg-amber-500 hover:bg-amber-400 text-stone-950 px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg"
          >
            Start Planning
          </button>
        </div>
      </nav>

      {/* VIEW 1: CINEMATIC LANDING PAGE */}
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
                onClick={() => setCurrentView("dashboard")}
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
                <span className="text-white font-serif font-bold text-lg">Beaches</span>
              </div>
            </div>
            <div className="relative group rounded-3xl overflow-hidden shadow-xl h-48 border border-white/10">
              <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80" alt="Himalayas" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-5">
                <span className="text-white font-serif font-bold text-lg">Himalayas</span>
              </div>
            </div>
            <div className="relative group rounded-3xl overflow-hidden shadow-xl h-48 border border-white/10">
              <img src="https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80" alt="Udaipur Palace" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-5">
                <span className="text-white font-serif font-bold text-lg">Monuments</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: DASHBOARD & CHAT */}
      {currentView === "dashboard" && (
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#141210]">
          
          <aside className="w-full md:w-72 bg-[#1C1917] border-r border-stone-800 p-6 flex flex-col justify-between hidden md:flex">
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-white px-3 py-2.5 rounded-2xl bg-[#292524] border border-stone-800">
                <LayoutDashboard className="w-5 h-5 text-amber-400" />
                <span className="font-semibold text-sm">Travel Workspace</span>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-stone-500 uppercase px-3 tracking-wider mb-2">Quick Navigation</p>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-stone-400 hover:text-white hover:bg-[#292524] transition-colors">
                  <Plane className="w-4 h-4 text-amber-400" /> Flights & Transport
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-stone-400 hover:text-white hover:bg-[#292524] transition-colors">
                  <Hotel className="w-4 h-4 text-amber-400" /> Hotels & Stays
                </button>
              </div>
            </div>
            <div className="pt-6 border-t border-stone-800 flex items-center gap-3 px-2">
              <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-xs">
                BS
              </div>
              <div>
                <p className="text-sm font-medium text-white">Bhaavya Srivastava</p>
                <p className="text-xs text-stone-500">Active Planner</p>
              </div>
            </div>
          </aside>

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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-[#1C1917] p-5 rounded-2xl border border-stone-800 shadow-sm">
                          <div className="flex items-center gap-3 mb-3 text-amber-400">
                            <Plane className="w-5 h-5" />
                            <h3 className="font-semibold text-white">Recommended Flight</h3>
                          </div>
                          <p className="text-stone-200 font-medium">{msg.data.selected_flight?.airline} ({msg.data.selected_flight?.flight_no})</p>
                          <p className="text-xs text-stone-400 mt-1">{msg.data.selected_flight?.time}</p>
                          <div className="mt-4 flex justify-between items-center">
                            <span className="text-lg font-bold text-white">{msg.data.selected_flight?.price}</span>
                            <button className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 px-4 py-2 rounded-full text-xs font-semibold transition-colors border border-amber-500/20">Book Flight</button>
                          </div>
                        </div>

                        <div className="bg-[#1C1917] p-5 rounded-2xl border border-stone-800 shadow-sm">
                          <div className="flex items-center gap-3 mb-3 text-amber-400">
                            <Hotel className="w-5 h-5" />
                            <h3 className="font-semibold text-white">Hotel Stay</h3>
                          </div>
                          <p className="text-stone-200 font-medium">{msg.data.selected_hotel?.name}</p>
                          <p className="text-xs text-stone-400 mt-1">{msg.data.selected_hotel?.location} • {msg.data.selected_hotel?.rating}</p>
                          <div className="mt-4 flex justify-between items-center">
                            <span className="text-lg font-bold text-white">{msg.data.selected_hotel?.price}</span>
                            <button className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 px-4 py-2 rounded-full text-xs font-semibold transition-colors border border-amber-500/20">Book Hotel</button>
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
        </div>
      )}

    </div>
  );
}