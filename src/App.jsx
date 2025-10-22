import React, { useState, useEffect } from 'react';
import { Phone, MessageSquare, Wind, Battery, Navigation, AlertCircle, User, Volume2, Sun, Thermometer, MapPin, Users, Shield, CheckCircle, ChevronRight, Car, Plane, ArrowLeft, Search, Gauge } from 'lucide-react';

// Custom Drone Icon Component
const Drone = ({ className = "w-6 h-6", ...props }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {/* Drone body (center) */}
    <rect x="9" y="10" width="6" height="4" rx="1" />
    {/* Arms */}
    <line x1="9" y1="12" x2="4" y2="7" />
    <line x1="15" y1="12" x2="20" y2="7" />
    <line x1="9" y1="12" x2="4" y2="17" />
    <line x1="15" y1="12" x2="20" y2="17" />
    {/* Propellers */}
    <circle cx="4" cy="7" r="2" />
    <circle cx="20" cy="7" r="2" />
    <circle cx="4" cy="17" r="2" />
    <circle cx="20" cy="17" r="2" />
    {/* Propeller blades */}
    <line x1="2.5" y1="7" x2="5.5" y2="7" />
    <line x1="18.5" y1="7" x2="21.5" y2="7" />
    <line x1="2.5" y1="17" x2="5.5" y2="17" />
    <line x1="18.5" y1="17" x2="21.5" y2="17" />
  </svg>
);

export default function SkyGlydeBookingFlow() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [bookingData, setBookingData] = useState({
    destination: '',
    passengers: 1,
    skyportDeparture: null,
    skyportArrival: null,
    groundTransportTo: null,
    groundTransportFrom: null,
    locationEnabled: false  // Added location tracking
  });

  const skyports = [
    { id: 1, name: 'Friedrichstrasse Skyport', walk: '2 min walk', features: 'Secure boarding • Flight supervision' },
    { id: 2, name: 'Alexanderplatz Skyport', walk: '8 min walk', features: 'Secure boarding • Flight supervision' },
    { id: 3, name: 'Sudkreuz Skyport', walk: '15 min walk', features: 'Secure boarding • Flight supervision' },
    { id: 4, name: 'Westkreuz Skyport', walk: '12 min walk', features: 'Secure boarding • Flight supervision' },
    { id: 5, name: 'Ostkreuz Skyport', walk: '10 min walk', features: 'Secure boarding • Flight supervision' },
    { id: 6, name: 'Gesundbrunnen Skyport', walk: '7 min walk', features: 'Secure boarding • Flight supervision' }
  ];

  // Auto-select closest arrival skyport based on destination
  const findClosestSkyport = (destination) => {
    // Simple logic: pick a skyport based on destination name
    const destLower = destination.toLowerCase();
    if (destLower.includes('alexander')) return skyports[1];
    if (destLower.includes('brandenburg') || destLower.includes('gate')) return skyports[0];
    if (destLower.includes('potsdamer')) return skyports[2];
    if (destLower.includes('charlottenburg')) return skyports[3];
    // Default to a random skyport
    return skyports[Math.floor(Math.random() * skyports.length)];
  };

  const renderScreen = () => {
    switch(currentScreen) {
      case 'home':
        return <HomeScreen onNext={(dest) => {
          const arrivalSkyport = findClosestSkyport(dest);
          setBookingData({
            ...bookingData, 
            destination: dest,
            skyportArrival: arrivalSkyport
          });
          setCurrentScreen('howItWorks');
        }} />;
      case 'howItWorks':
        return <HowItWorksScreen onNext={() => setCurrentScreen('locationAccess')} onBack={() => setCurrentScreen('home')} />;
      case 'locationAccess':
        return <LocationAccessScreen 
          onNext={(enabled) => {
            setBookingData({...bookingData, locationEnabled: enabled});
            setCurrentScreen('passengers');
          }} 
          onBack={() => setCurrentScreen('howItWorks')} 
        />;
      case 'passengers':
        return <PassengerScreen onNext={(count) => {
          setBookingData({...bookingData, passengers: count});
          if (count >= 3) {
            setCurrentScreen('multipleVehicles');
          } else {
            setCurrentScreen('skyportDeparture');
          }
        }} onBack={() => setCurrentScreen('locationAccess')} />;
      case 'multipleVehicles':
        return <MultipleVehiclesScreen onNext={() => setCurrentScreen('skyportDeparture')} onBack={() => setCurrentScreen('passengers')} passengerCount={bookingData.passengers} />;
      case 'skyportDeparture':
        return <SkyportScreen 
          title="Choose Departure Skyport"
          skyports={skyports}
          onNext={(skyport) => {
            setBookingData({...bookingData, skyportDeparture: skyport});
            setCurrentScreen('groundTransportTo');
          }} 
          onBack={() => bookingData.passengers >= 3 ? setCurrentScreen('multipleVehicles') : setCurrentScreen('passengers')} 
        />;
      case 'groundTransportTo':
        return <GroundTransportScreen 
          title="Ground Transport to Skyport"
          description="How would you like to reach the departure skyport?"
          onNext={(transport) => {
            setBookingData({...bookingData, groundTransportTo: transport});
            setCurrentScreen('groundTransportFrom');
          }} 
          onBack={() => setCurrentScreen('skyportDeparture')} 
        />;
      case 'groundTransportFrom':
        return <GroundTransportScreen 
          title="Ground Transport from Skyport"
          description="How would you like to reach your final destination?"
          onNext={(transport) => {
            setBookingData({...bookingData, groundTransportFrom: transport});
            setCurrentScreen('summary');
          }} 
          onBack={() => setCurrentScreen('groundTransportTo')} 
        />;
      case 'summary':
        return <TripSummaryScreen bookingData={bookingData} onNext={() => setCurrentScreen('safetyBriefing')} onBack={() => setCurrentScreen('groundTransportFrom')} />;
      case 'safetyBriefing':
        return <SafetyBriefingScreen onNext={() => setCurrentScreen('inFlight')} />;
      case 'inFlight':
        return <InFlightTracking />;
      default:
        return <HomeScreen onNext={(dest) => {
          const arrivalSkyport = findClosestSkyport(dest);
          setBookingData({
            ...bookingData, 
            destination: dest,
            skyportArrival: arrivalSkyport
          });
          setCurrentScreen('howItWorks');
        }} />;
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-900 max-w-md mx-auto">
      {renderScreen()}
    </div>
  );
}

function HomeScreen({ onNext }) {
  const [destination, setDestination] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);

  const popularDestinations = [
    { name: 'Alexanderplatz', distance: '5.2 km', time: '5 min' },
    { name: 'Brandenburg Gate', distance: '4.8 km', time: '4 min' },
    { name: 'Potsdamer Platz', distance: '3.5 km', time: '3 min' },
    { name: 'Charlottenburg Palace', distance: '7.1 km', time: '7 min' }
  ];

  return (
    <div className="relative w-full min-h-screen bg-slate-900">
      <div className="absolute inset-0">
        <svg className="w-full h-full" viewBox="0 0 400 900" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="mapGlow" cx="50%" cy="50%">
              <stop offset="0%" stopColor="rgba(59, 130, 246, 0.4)" />
              <stop offset="100%" stopColor="rgba(15, 23, 42, 0.9)" />
            </radialGradient>
          </defs>
          <rect width="400" height="900" fill="url(#mapGlow)" />
          {[...Array(20)].map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 45} x2="400" y2={i * 45} stroke="rgba(71, 85, 105, 0.3)" strokeWidth="1" />
          ))}
          {[...Array(10)].map((_, i) => (
            <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="900" stroke="rgba(71, 85, 105, 0.3)" strokeWidth="1" />
          ))}
          <circle cx="150" cy="350" r="8" fill="rgb(34, 197, 94)" opacity="0.8">
            <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="250" cy="300" r="8" fill="rgb(34, 197, 94)" opacity="0.8">
            <animate attributeName="r" values="8;12;8" dur="2s" begin="0.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="200" cy="450" r="8" fill="rgb(34, 197, 94)" opacity="0.8">
            <animate attributeName="r" values="8;12;8" dur="2s" begin="1s" repeatCount="indefinite" />
          </circle>
          <circle cx="280" cy="380" r="6" fill="rgb(59, 130, 246)" opacity="0.6" />
          <circle cx="170" cy="280" r="6" fill="rgb(59, 130, 246)" opacity="0.6" />
          <circle cx="220" cy="500" r="6" fill="rgb(59, 130, 246)" opacity="0.6" />
          <path d="M 150 350 Q 215 365 280 380" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="2" fill="none" strokeDasharray="5,5" />
          <path d="M 250 300 Q 210 340 170 280" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="2" fill="none" strokeDasharray="5,5" />
        </svg>
      </div>

      <div className="absolute top-0 left-0 right-0 pt-8 px-6 z-20">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/20 mx-auto w-fit">
          <h1 className="text-2xl font-bold text-white text-center">Sky-Glyde</h1>
          <p className="text-xs text-blue-200 text-center">Certified Autonomous Flight</p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 pb-6 px-6">
        <div className="bg-slate-800/95 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-2">Where would you like to go?</h2>
          <p className="text-sm text-slate-300 mb-4">Choose your destination for safe, supervised autonomous flight</p>
          
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={destination}
              onFocus={() => {
                if (!destination) setShowFavorites(true);
              }}
              onChange={(e) => {
                setDestination(e.target.value);
                setShowFavorites(false);
                setShowSuggestions(e.target.value.length > 0);
              }}
              placeholder="Enter destination"
              className="w-full pl-12 pr-4 py-4 bg-slate-900/80 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Show favorites when input is empty and focused */}
          {showFavorites && !destination && (
            <div className="mb-4">
              <p className="text-xs text-slate-400 mb-2 px-1">Popular Destinations</p>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {popularDestinations.map((dest, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setDestination(dest.name);
                      setShowFavorites(false);
                    }}
                    className="w-full text-left px-4 py-3 bg-slate-900/60 hover:bg-slate-900/90 rounded-xl transition-all flex items-center justify-between group border border-slate-700/30"
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-white font-medium">{dest.name}</p>
                        <p className="text-slate-400 text-sm">{dest.distance} • {dest.time}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-slate-400 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Show filtered suggestions when user is typing */}
          {showSuggestions && destination && (
            <div className="mb-4 space-y-2 max-h-64 overflow-y-auto">
              {popularDestinations
                .filter(dest => dest.name.toLowerCase().includes(destination.toLowerCase()))
                .map((dest, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setDestination(dest.name);
                      setShowSuggestions(false);
                    }}
                    className="w-full text-left px-4 py-3 bg-slate-900/60 hover:bg-slate-900/90 rounded-xl transition-all flex items-center justify-between group border border-slate-700/30"
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-white font-medium">{dest.name}</p>
                        <p className="text-slate-400 text-sm">{dest.distance} • {dest.time}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-slate-400 transition-colors" />
                  </button>
                ))}
            </div>
          )}

          <button
            onClick={() => destination && onNext(destination)}
            disabled={!destination}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed rounded-xl font-semibold text-white shadow-lg transition-all duration-200"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

function HowItWorksScreen({ onNext, onBack }) {
  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="absolute top-0 left-0 right-0 px-6 pt-6 pb-4 z-20">
        <button onClick={onBack} className="p-2 bg-slate-800/80 backdrop-blur-sm rounded-full">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
      </div>

      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <Drone className="w-20 h-20 text-blue-400 mb-6" />
        <h1 className="text-3xl font-bold text-white text-center mb-3">How Sky-Glyde Works</h1>
        <p className="text-slate-300 text-center mb-8 max-w-md">Safe, supervised urban air mobility</p>

        <div className="space-y-4 mb-8 w-full max-w-md">
          <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 border border-slate-700/50">
            <div className="flex items-start gap-4">
              <div className="bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">1</span>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Ground Transport</h3>
                <p className="text-slate-300 text-sm">Travel to nearest Skyport by car or public transport</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 border border-slate-700/50">
            <div className="flex items-start gap-4">
              <div className="bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">2</span>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Secure Boarding</h3>
                <p className="text-slate-300 text-sm">Board your Sky-Glyde at the Skyport facility</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 border border-slate-700/50">
            <div className="flex items-start gap-4">
              <div className="bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">3</span>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Supervised Flight</h3>
                <p className="text-slate-300 text-sm">Trained pilot monitors your flight from Ground Control</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 border border-slate-700/50">
            <div className="flex items-start gap-4">
              <div className="bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">4</span>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Arrival & Ground Transport</h3>
                <p className="text-slate-300 text-sm">Land at destination Skyport and complete journey</p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onNext}
          className="w-full max-w-md py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-xl font-semibold text-white shadow-lg transition-all duration-200"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function LocationAccessScreen({ onNext, onBack }) {
  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="absolute top-0 left-0 right-0 px-6 pt-6 pb-4 z-20">
        <button onClick={onBack} className="p-2 bg-slate-800/80 backdrop-blur-sm rounded-full">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
      </div>

      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl mb-6">
          <MapPin className="w-12 h-12 text-white" />
        </div>

        <h1 className="text-3xl font-bold text-white text-center mb-3">Safety Location Access</h1>
        
        <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 mb-6 max-w-md">
          <h2 className="font-semibold text-white mb-4">Safety benefits:</h2>
          <ul className="space-y-2 text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
              <span>Precise landing at Skyport</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
              <span>Monitored by trained pilot</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
              <span>Safe flight planning</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
              <span>Emergency response, if needed</span>
            </li>
          </ul>
        </div>

        <div className="bg-blue-900/30 backdrop-blur-md rounded-xl p-5 border border-blue-700/30 mb-8 max-w-md">
          <p className="text-sm text-blue-200 text-center">
            Ground Control uses your precise location for safe flight operation
          </p>
        </div>

        {/* UPDATED: Added required warning message */}
        <div className="bg-orange-900/30 backdrop-blur-md rounded-xl p-4 border border-orange-700/30 mb-8 max-w-md">
          <p className="text-sm font-semibold text-orange-200 mb-1 text-center">⚠️ Required for Booking</p>
          <p className="text-xs text-orange-300 text-center">
            Location access is mandatory to complete your Sky-Glyde booking
          </p>
        </div>

        {/* UPDATED: Only one button that enables location and continues */}
        <button
          onClick={() => onNext(true)}
          className="w-full max-w-md py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-xl font-semibold text-white shadow-lg transition-all duration-200"
        >
          Enable Location Access & Continue
        </button>
        
        {/* UPDATED: Back button as secondary action instead of skip */}
        <button
          onClick={onBack}
          className="w-full max-w-md py-3 mt-3 text-slate-400 hover:text-white transition-colors text-center"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}

function PassengerScreen({ onNext, onBack }) {
  const [count, setCount] = useState(1);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="absolute top-0 left-0 right-0 px-6 pt-6 pb-4 z-20">
        <button onClick={onBack} className="p-2 bg-slate-800/80 backdrop-blur-sm rounded-full">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
      </div>

      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <Users className="w-20 h-20 text-blue-400 mb-6" />
        <h1 className="text-3xl font-bold text-white text-center mb-3">Number of Passengers</h1>
        <p className="text-slate-300 text-center mb-8">Maximum 2 passengers per Sky-Glyde</p>

        <div className="grid grid-cols-2 gap-3 mb-8 w-full max-w-md">
          <button
            onClick={() => setCount(1)}
            className={`h-32 rounded-2xl border-2 transition-all flex flex-col items-center justify-center ${count === 1 ? 'bg-blue-600 border-blue-400' : 'bg-slate-800/50 border-slate-700'}`}
          >
            <User className="w-10 h-10 text-white mb-2" />
            <p className="font-semibold text-white text-sm">1 Passenger</p>
          </button>
          <button
            onClick={() => setCount(2)}
            className={`h-32 rounded-2xl border-2 transition-all flex flex-col items-center justify-center ${count === 2 ? 'bg-blue-600 border-blue-400' : 'bg-slate-800/50 border-slate-700'}`}
          >
            <Users className="w-10 h-10 text-white mb-2" />
            <p className="font-semibold text-white text-sm">2 Passengers</p>
          </button>
          <button
            onClick={() => setCount(3)}
            className={`h-32 rounded-2xl border-2 transition-all flex flex-col items-center justify-center col-span-2 ${count >= 3 ? 'bg-blue-600 border-blue-400' : 'bg-slate-800/50 border-slate-700'}`}
          >
            <Users className="w-10 h-10 text-white mb-2" />
            <p className="font-semibold text-white text-sm">3+ Passengers</p>
          </button>
        </div>

        <button
          onClick={() => onNext(count)}
          className="w-full max-w-md py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-xl font-semibold text-white shadow-lg transition-all duration-200"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function MultipleVehiclesScreen({ onNext, onBack, passengerCount }) {
  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="absolute top-0 left-0 right-0 px-6 pt-6 pb-4 z-20">
        <button onClick={onBack} className="p-2 bg-slate-800/80 backdrop-blur-sm rounded-full">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
      </div>

      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <Users className="w-20 h-20 text-orange-400 mb-6" />
        <h1 className="text-3xl font-bold text-white text-center mb-3">Multiple Sky-Glydes Needed</h1>
        <p className="text-slate-300 text-center mb-8 max-w-md">
          Only 2 passengers per Sky-Glyde taxi. For {passengerCount} passengers, you'll need to book multiple vehicles.
        </p>

        <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 mb-6 max-w-md w-full">
          <p className="text-sm font-semibold text-white mb-4">Your options:</p>
          <ul className="space-y-3 text-sm text-slate-300">
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <span>Book multiple Sky-Glydes (recommended for groups)</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <span>Choose a Glyde ground option that accommodates more passengers</span>
            </li>
          </ul>
        </div>

        <button
          onClick={onNext}
          className="w-full max-w-md py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-xl font-semibold text-white shadow-lg transition-all duration-200"
        >
          Continue with Multiple Bookings
        </button>
      </div>
    </div>
  );
}

function SkyportScreen({ onNext, onBack, title, skyports }) {
  const [selectedSkyport, setSelectedSkyport] = useState(null);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="absolute top-0 left-0 right-0 px-6 pt-6 pb-4 z-20">
        <button onClick={onBack} className="p-2 bg-slate-800/80 backdrop-blur-sm rounded-full">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
      </div>

      <div className="min-h-screen flex flex-col px-6 pt-20 pb-8">
        <h1 className="text-2xl font-bold text-white mb-6">{title}</h1>

        <div className="space-y-3 flex-1 overflow-y-auto mb-6">
          {skyports.map((skyport) => (
            <button
              key={skyport.id}
              onClick={() => setSelectedSkyport(skyport)}
              className={`w-full text-left p-4 rounded-xl transition-all border ${
                selectedSkyport?.id === skyport.id 
                  ? 'bg-blue-600 border-blue-400' 
                  : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-white">{skyport.name}</h3>
                  <p className="text-sm text-slate-300">{skyport.walk}</p>
                </div>
                <MapPin className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-xs text-slate-400">{skyport.features}</p>
            </button>
          ))}
        </div>

        <button
          onClick={() => selectedSkyport && onNext(selectedSkyport)}
          disabled={!selectedSkyport}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed rounded-xl font-semibold text-white shadow-lg transition-all duration-200"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function GroundTransportScreen({ onNext, onBack, title, description }) {
  const [selectedTransport, setSelectedTransport] = useState(null);

  const transportOptions = [
    { id: 'walk', name: 'Walk', icon: User, time: '5-15 min', cost: 'Free' },
    { id: 'public', name: 'Public Transport', icon: Car, time: '10-20 min', cost: '€2-4' },
    { id: 'ride', name: 'Ride Service', icon: Car, time: '5-10 min', cost: '€8-15' }
  ];

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="absolute top-0 left-0 right-0 px-6 pt-6 pb-4 z-20">
        <button onClick={onBack} className="p-2 bg-slate-800/80 backdrop-blur-sm rounded-full">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
      </div>

      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <Car className="w-20 h-20 text-blue-400 mb-6" />
        <h1 className="text-3xl font-bold text-white text-center mb-3">{title}</h1>
        <p className="text-slate-300 text-center mb-8">{description}</p>

        <div className="space-y-3 mb-8 w-full max-w-md">
          {transportOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.id}
                onClick={() => setSelectedTransport(option)}
                className={`w-full text-left p-5 rounded-xl transition-all border ${
                  selectedTransport?.id === option.id 
                    ? 'bg-blue-600 border-blue-400' 
                    : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-4">
                  <Icon className="w-8 h-8 text-white" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{option.name}</h3>
                    <p className="text-sm text-slate-300">{option.time} • {option.cost}</p>
                  </div>
                  {selectedTransport?.id === option.id && (
                    <CheckCircle className="w-6 h-6 text-white" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => selectedTransport && onNext(selectedTransport)}
          disabled={!selectedTransport}
          className="w-full max-w-md py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed rounded-xl font-semibold text-white shadow-lg transition-all duration-200"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function TripSummaryScreen({ bookingData, onNext, onBack }) {
  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="absolute top-0 left-0 right-0 px-6 pt-6 pb-4 z-20">
        <button onClick={onBack} className="p-2 bg-slate-800/80 backdrop-blur-sm rounded-full">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
      </div>

      <div className="min-h-screen flex flex-col px-6 pt-20 pb-8">
        <h1 className="text-3xl font-bold text-white mb-6">Trip Summary</h1>

        <div className="space-y-4 mb-6">
          <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 border border-slate-700/50">
            <h3 className="text-sm font-semibold text-slate-400 mb-2">DESTINATION</h3>
            <p className="text-white text-lg">{bookingData.destination}</p>
          </div>

          <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 border border-slate-700/50">
            <h3 className="text-sm font-semibold text-slate-400 mb-2">PASSENGERS</h3>
            <p className="text-white text-lg">{bookingData.passengers} {bookingData.passengers === 1 ? 'passenger' : 'passengers'}</p>
          </div>

          <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 border border-slate-700/50">
            <h3 className="text-sm font-semibold text-slate-400 mb-3">JOURNEY</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-400 mb-1">Ground Transport To</p>
                <p className="text-white">{bookingData.groundTransportTo?.name}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Departure Skyport</p>
                <p className="text-white">{bookingData.skyportDeparture?.name}</p>
              </div>
              <div className="flex items-center justify-center py-2">
                <Drone className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Arrival Skyport</p>
                <p className="text-white">{bookingData.skyportArrival?.name}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Ground Transport From</p>
                <p className="text-white">{bookingData.groundTransportFrom?.name}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-blue-100">ESTIMATED TOTAL</h3>
              <p className="text-2xl font-bold text-white">€45</p>
            </div>
            <p className="text-xs text-blue-100">Includes all transport segments</p>
          </div>
        </div>

        <button
          onClick={onNext}
          className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 rounded-xl font-semibold text-white shadow-lg transition-all duration-200"
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
}

function SafetyBriefingScreen({ onNext }) {
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="min-h-screen flex flex-col px-6 py-12">
        <Shield className="w-20 h-20 text-green-400 mb-6 mx-auto" />
        <h1 className="text-3xl font-bold text-white text-center mb-3">Safety Briefing</h1>
        <p className="text-slate-300 text-center mb-8">Please review before your flight</p>

        <div className="space-y-4 mb-8 flex-1 overflow-y-auto">
          <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 border border-slate-700/50">
            <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              Supervised by Ground Control
            </h3>
            <p className="text-sm text-slate-300">A trained pilot monitors your flight at all times from our operations center</p>
          </div>

          <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 border border-slate-700/50">
            <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              Emergency Systems Active
            </h3>
            <p className="text-sm text-slate-300">Multiple safety systems including automatic landing and collision avoidance</p>
          </div>

          <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 border border-slate-700/50">
            <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              Communication Available
            </h3>
            <p className="text-sm text-slate-300">Direct contact with Ground Control throughout your journey</p>
          </div>

          <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 border border-slate-700/50">
            <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              Weather Monitoring
            </h3>
            <p className="text-sm text-slate-300">Real-time weather assessment ensures safe flying conditions</p>
          </div>
        </div>

        <div className="bg-slate-800/80 backdrop-blur-md rounded-xl p-4 border border-slate-700/50 mb-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-slate-600"
            />
            <span className="text-sm text-slate-300">
              I have read and understood the safety briefing and agree to follow all safety instructions during my flight
            </span>
          </label>
        </div>

        <button
          onClick={onNext}
          disabled={!accepted}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed rounded-xl font-semibold text-white shadow-lg transition-all duration-200"
        >
          Begin Flight
        </button>
      </div>
    </div>
  );
}

function InFlightTracking() {
  const [showControls, setShowControls] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const [flightData, setFlightData] = useState({
    altitude: 120,
    battery: 85,
    airspeed: 45,
    arrivalTime: '14:23',
    flightPhase: 'En Route'
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setFlightData(prev => ({
        ...prev,
        altitude: Math.min(150, prev.altitude + Math.random() * 2),
        battery: Math.max(75, prev.battery - 0.1),
        airspeed: 42 + Math.random() * 6
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 400 900">
          {[...Array(20)].map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 45} x2="400" y2={i * 45} stroke="rgba(59, 130, 246, 0.3)" strokeWidth="1" />
          ))}
          {[...Array(10)].map((_, i) => (
            <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="900" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="1" />
          ))}
        </svg>
      </div>

      <div className="absolute top-0 left-0 right-0 z-30 bg-gradient-to-b from-slate-950/95 to-transparent backdrop-blur-sm">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center ring-2 ring-blue-300/50">
                <User className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <p className="font-semibold text-sm text-white">Flight Supervisor</p>
              </div>
              <p className="text-base font-bold text-white">Maria Rodriguez</p>
              <p className="text-xs text-blue-200">Ground Control • Monitoring Live</p>
            </div>
            <button 
              onClick={() => setShowEmergency(!showEmergency)}
              className="flex-shrink-0 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg border border-white/30 transition-all duration-200 shadow-lg"
            >
              <MessageSquare className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* UPDATED: Added more spacing (gap-4 instead of gap-3) and increased padding */}
      <div className="absolute top-24 left-4 right-4 z-20">
        <div className="bg-slate-950/80 backdrop-blur-md rounded-2xl border border-cyan-500/30 shadow-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">Live Telemetry</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs text-green-400 font-mono">ACTIVE</span>
            </div>
          </div>
          
          {/* UPDATED: Increased gap from gap-3 to gap-4 for more breathing room */}
          <div className="grid grid-cols-2 gap-4">
            {/* UPDATED: Increased padding from p-3 to p-4 */}
            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
              <div className="flex items-center gap-2 mb-2">
                <Navigation className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-slate-400 uppercase tracking-wide">Altitude</span>
              </div>
              <p className="text-2xl font-bold font-mono text-white">
                {Math.round(flightData.altitude)}
                <span className="text-sm text-slate-400 ml-1">m</span>
              </p>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
              <div className="flex items-center gap-2 mb-2">
                <Battery className="w-4 h-4 text-green-400" />
                <span className="text-xs text-slate-400 uppercase tracking-wide">Battery</span>
              </div>
              <p className="text-2xl font-bold font-mono text-white">
                {Math.round(flightData.battery)}
                <span className="text-sm text-slate-400 ml-1">%</span>
              </p>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
              <div className="flex items-center gap-2 mb-2">
                <Gauge className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-slate-400 uppercase tracking-wide">Airspeed</span>
              </div>
              <p className="text-2xl font-bold font-mono text-white">
                {Math.round(flightData.airspeed)}
                <span className="text-sm text-slate-400 ml-1">km/h</span>
              </p>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-slate-400 uppercase tracking-wide">Arrival</span>
              </div>
              <p className="text-2xl font-bold font-mono text-white">{flightData.arrivalTime}</p>
            </div>
          </div>

          {/* UPDATED: Increased margin and padding in the flight phase section */}
          <div className="mt-4 pt-4 border-t border-slate-700/50">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Current Phase:</span>
              <span className="text-sm font-semibold text-cyan-400">{flightData.flightPhase}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-24 left-4 right-4 z-20">
        <button
          onClick={() => setShowControls(!showControls)}
          className="w-full mb-3 px-4 py-3 bg-slate-800/90 backdrop-blur-md rounded-xl border border-slate-600/50 flex items-center justify-between hover:bg-slate-700/90 transition-all"
        >
          <span className="text-sm font-semibold text-white">Personalize Your Cabin</span>
          <div className="flex gap-2">
            <Thermometer className="w-5 h-5 text-orange-400" />
            <Sun className="w-5 h-5 text-yellow-400" />
            <Volume2 className="w-5 h-5 text-purple-400" />
          </div>
        </button>

        {showControls && (
          <div className="bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-600/50 p-4 space-y-3 shadow-2xl">
            <div>
              <label className="text-xs text-slate-400 block mb-2">Temperature</label>
              <input type="range" min="18" max="26" defaultValue="21" className="w-full" />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>18°C</span>
                <span>26°C</span>
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-2">Lighting</label>
              <input type="range" min="0" max="100" defaultValue="75" className="w-full" />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-2">Volume</label>
              <input type="range" min="0" max="100" defaultValue="60" className="w-full" />
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-30">
        <div className="bg-gradient-to-t from-slate-950 to-slate-950/90 backdrop-blur-md border-t border-slate-700/50 px-4 py-4">
          <button
            onClick={() => setShowEmergency(!showEmergency)}
            className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-xl font-bold text-white shadow-2xl transition-all duration-200 flex items-center justify-center gap-3 border-2 border-red-400/50"
          >
            <AlertCircle className="w-6 h-6" />
            <span className="text-lg">Emergency Protocol & Connect</span>
          </button>

          {showEmergency && (
            <div className="mt-3 p-4 bg-slate-800/95 backdrop-blur-md rounded-xl border border-red-400/30">
              <p className="text-sm text-white font-semibold mb-2">Immediate Response Available</p>
              <p className="text-xs text-slate-300 leading-relaxed">
                Pressing this button instantly connects you to our trained emergency response team. 
                Your flight supervisor and backup systems are monitoring continuously. 
                Sky-Glyde has multiple safety protocols to ensure a safe landing.
              </p>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <button className="px-3 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-sm font-semibold flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4" />
                  Call Now
                </button>
                <button className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-semibold flex items-center justify-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Chat
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="absolute top-20 right-4 z-20 bg-green-500/20 backdrop-blur-sm rounded-full px-3 py-1 border border-green-400/50">
        <p className="text-xs font-semibold text-green-400">All Systems Normal</p>
      </div>
    </div>
  );
}
