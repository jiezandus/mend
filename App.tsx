import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

// --- Constants & Types ---
enum AppMode {
  LANDING = 'LANDING',
  CREATOR = 'CREATOR',
  GAME = 'GAME',
  RESOLUTION = 'RESOLUTION',
}

interface ApologyPayload {
  scenario: string;
  customMessage: string;
  senderName: string;
}

const SCENARIOS = [
  { id: 'LATE', label: "Running Late 🐢", emoji: "🐢", prompt: "I was late" },
  { id: 'FORGOT', label: "Forgot Date 📅", emoji: "📅", prompt: "I forgot something important" },
  { id: 'FOOD', label: "Ate Leftovers 🍕", emoji: "🍕", prompt: "I accidentally ate your food" },
  { id: 'GHOSTED', label: "Accidental Ghost 👻", emoji: "👻", prompt: "I accidentally ghosted for a bit" },
  { id: 'CLUMSY', label: "Clumsy Moment 💥", emoji: "💥", prompt: "I broke something of yours" },
];

const PRESET_RESPONSES = [
  "It's okay, I forgive you! 💖",
  "You owe me dinner now. 🍔",
  "Fine, but don't do it again. 😤",
  "Send $5 and we're cool. 💸",
];

// --- AI Service ---
const getApology = async (scenario: string, senderName: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a very short, cute, kawaii, and slightly funny apology note for: "${scenario}". Sender: ${senderName}. Under 25 words. Use emojis. Tone: Humble but playful.`,
    });
    return response.text?.trim() || "I'm super sorry! Please forgive me! 🥺";
  } catch (err) {
    console.error(err);
    return `I'm so sorry about ${scenario}! 🥺 Hope you can forgive me!`;
  }
};

// --- Reusable Components ---
const Button = ({ onClick, children, variant = 'primary', className = '', disabled = false }: any) => {
  const base = "px-6 py-3 rounded-2xl border-2 border-black font-bold text-lg transform transition-all active:scale-95 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] select-none disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed";
  const styles: any = {
    primary: "bg-softBlue hover:bg-blue-200 text-ink",
    secondary: "bg-white hover:bg-gray-100 text-ink",
    danger: "bg-red-400 hover:bg-red-500 text-white",
    success: "bg-softGreen hover:bg-green-200 text-ink",
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${styles[variant]} ${className}`}>
      {children}
    </button>
  );
};

// --- Main App ---
export default function App() {
  const [mode, setMode] = useState<AppMode>(AppMode.LANDING);
  const [apologyPayload, setApologyPayload] = useState<ApologyPayload | null>(null);
  const [senderName, setSenderName] = useState('');
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.includes('data=')) {
        try {
          const data = new URLSearchParams(hash.split('?')[1]).get('data');
          if (data) {
            const decoded = JSON.parse(decodeURIComponent(atob(data)));
            setApologyPayload(decoded);
            setMode(AppMode.GAME);
          }
        } catch (e) {
          console.error("Link error", e);
        }
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleGenerate = async () => {
    if (!selectedScenario || !senderName) return;
    setLoading(true);
    const scenario = SCENARIOS.find(s => s.id === selectedScenario);
    const text = await getApology(scenario?.prompt || selectedScenario, senderName);
    const payload = { scenario: selectedScenario, customMessage: text, senderName };
    setApologyPayload(payload);
    setLoading(false);
    setMode(AppMode.CREATOR);
  };

  const handleCopy = () => {
    const json = JSON.stringify(apologyPayload);
    const base64 = btoa(encodeURIComponent(json));
    const url = `${window.location.origin}${window.location.pathname}#/?data=${base64}`;
    navigator.clipboard.writeText(url);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 3000);
  };

  const handleWhackComplete = () => setMode(AppMode.RESOLUTION);

  // --- View: Landing ---
  if (mode === AppMode.LANDING) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center space-y-8 animate-fade-in">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-ink wiggle drop-shadow-sm">MendMoji</h1>
          <p className="text-xl text-gray-600">Fixing awkward vibes, one mole at a time.</p>
        </div>
        <div className="w-full max-w-sm p-8 bg-white border-2 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-2xl mb-6">Need to say sorry?</h2>
          <Button onClick={() => setMode(AppMode.CREATOR)} className="w-full">🥺 Start Apology</Button>
        </div>
        <img src="https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Mend" className="w-24 h-24 opacity-50 grayscale" alt="mascot" />
      </div>
    );
  }

  // --- View: Creator (Step 1 & 2) ---
  if (mode === AppMode.CREATOR && !apologyPayload?.customMessage) {
    return (
      <div className="max-w-md mx-auto p-6 pt-12 space-y-8">
        <h2 className="text-4xl font-bold text-center">What happened? 🙈</h2>
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="font-bold ml-2">Your Name</label>
            <input 
              className="w-full p-4 border-2 border-black rounded-2xl bg-white outline-none focus:ring-2 focus:ring-softBlue"
              placeholder="e.g. Charlie"
              value={senderName}
              onChange={e => setSenderName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {SCENARIOS.map(s => (
              <button 
                key={s.id} 
                onClick={() => setSelectedScenario(s.id)}
                className={`p-4 rounded-2xl border-2 transition-all ${selectedScenario === s.id ? 'bg-softBlue border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-1 -translate-y-1' : 'bg-white border-gray-200'}`}
              >
                <div className="text-3xl mb-1">{s.emoji}</div>
                <div className="text-sm font-bold">{s.label}</div>
              </button>
            ))}
          </div>
          <Button onClick={handleGenerate} disabled={!selectedScenario || !senderName || loading} className="w-full mt-4">
            {loading ? "AI is thinking... ✍️" : "Generate Note ✨"}
          </Button>
        </div>
      </div>
    );
  }

  // --- View: Share ---
  if (mode === AppMode.CREATOR && apologyPayload?.customMessage) {
    return (
      <div className="max-w-md mx-auto p-6 pt-12 space-y-8 text-center">
        <h2 className="text-4xl font-bold">Perfect! 💌</h2>
        <div className="p-6 bg-white border-2 border-black rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,0.15)] relative transform -rotate-1">
          <p className="text-2xl italic font-hand">"{apologyPayload.customMessage}"</p>
          <p className="text-right mt-4 font-bold">- {apologyPayload.senderName}</p>
        </div>
        <div className="space-y-4">
          <p className="text-gray-500 px-4">They must complete a mini-game to read this. It softens the blow! 😉</p>
          <Button onClick={handleCopy} variant="success" className="w-full">
            {copyFeedback ? "Copied! ✅" : "Copy Magic Link 🔗"}
          </Button>
          <button onClick={() => { setApologyPayload(null); setMode(AppMode.LANDING); }} className="text-sm underline text-gray-400">Cancel / Start Over</button>
        </div>
      </div>
    );
  }

  // --- View: Game (Whack-a-Mole) ---
  if (mode === AppMode.GAME) {
    return <MoleGame onComplete={handleWhackComplete} />;
  }

  // --- View: Resolution ---
  if (mode === AppMode.RESOLUTION && apologyPayload) {
    return (
      <div className="max-w-md mx-auto p-6 flex flex-col items-center justify-center min-h-screen text-center space-y-8">
        <div className="text-6xl animate-bounce">🎁</div>
        <h1 className="text-4xl font-bold">A Message for You!</h1>
        <div className="p-8 bg-softYellow border-2 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full">
          <p className="text-2xl font-hand leading-snug">"{apologyPayload.customMessage}"</p>
          <p className="text-right mt-6 font-bold text-gray-500">— {apologyPayload.senderName}</p>
        </div>
        <div className="w-full space-y-3">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Respond Now</p>
          {PRESET_RESPONSES.map((resp, i) => (
            <button 
              key={i} 
              onClick={() => {
                const url = `sms:?&body=${encodeURIComponent("Re: MendMoji Apology\n" + resp)}`;
                window.location.href = url;
              }}
              className="w-full p-4 bg-white border-2 border-black rounded-2xl font-bold hover:bg-softGreen transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)]"
            >
              {resp}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

// --- Sub-Component: Game ---
function MoleGame({ onComplete }: { onComplete: () => void }) {
  const [moles, setMoles] = useState(Array(9).fill(false));
  const [hits, setHits] = useState(0);
  const goal = 5;

  useEffect(() => {
    if (hits >= goal) {
      setTimeout(onComplete, 600);
      return;
    }
    const timer = setInterval(() => {
      const idx = Math.floor(Math.random() * 9);
      setMoles(prev => {
        const next = [...prev];
        next[idx] = true;
        setTimeout(() => {
          setMoles(curr => {
            const c = [...curr];
            c[idx] = false;
            return c;
          });
        }, 800);
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [hits]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-softBlue">
      <div className="bg-white p-8 rounded-3xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-sm">
        <h2 className="text-3xl font-bold text-center mb-2">Unlock Apology</h2>
        <p className="text-center text-gray-500 mb-6">Whack {goal - hits} more "Sorry" moles to reveal the message!</p>
        <div className="grid grid-cols-3 gap-4">
          {moles.map((isUp, i) => (
            <button 
              key={i} 
              onClick={() => { if(isUp) { setHits(h => h + 1); setMoles(m => { const x = [...m]; x[i] = false; return x; }); } }}
              className="aspect-square bg-gray-100 rounded-2xl border-2 border-black relative overflow-hidden active:scale-90 transition-transform"
            >
              <div className={`absolute inset-0 flex items-center justify-center text-4xl mole-popup ${isUp ? 'translate-y-0' : 'translate-y-full'}`}>
                🥺
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
