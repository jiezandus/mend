import React, { useState } from 'react';
import { Button } from './Button';
import { SCENARIOS } from '../constants';
import { generateApologyMessage } from '../services/geminiService';
import { ApologyPayload } from '../types';

interface CreatorProps {
  onLinkCreated: (payload: ApologyPayload) => void;
}

export const Creator: React.FC<CreatorProps> = ({ onLinkCreated }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [senderName, setSenderName] = useState('');
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
  const [shareLink, setShareLink] = useState('');

  const handleGenerate = async () => {
    if (!selectedScenario || !senderName) return;
    setIsGenerating(true);
    const text = await generateApologyMessage(selectedScenario, senderName);
    setGeneratedText(text);
    setIsGenerating(false);
    setStep(2);
  };

  const handleCopyLink = () => {
    // In a real app, this would be a real URL. Here we simulate it.
    const payload: ApologyPayload = {
      scenario: selectedScenario || '',
      customMessage: generatedText,
      senderName
    };
    
    // Create a hash-based URL for the current page
    const jsonString = JSON.stringify(payload);
    const base64Data = btoa(encodeURIComponent(jsonString)); // Simple encoding to be URL safe-ish
    const url = `${window.location.origin}${window.location.pathname}#/?data=${base64Data}`;
    
    setShareLink(url);
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard! Send it to them.");
  };

  if (step === 1) {
    return (
      <div className="flex flex-col items-center min-h-screen p-6 pt-12 space-y-6 max-w-md mx-auto">
        <h2 className="text-3xl font-bold">What happened? 🙈</h2>
        
        <div className="w-full space-y-2">
            <label className="font-bold ml-1">Your Name</label>
            <input 
                type="text" 
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="e.g. Alex"
                className="w-full p-3 border-2 border-black rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-softBlue"
            />
        </div>

        <div className="grid grid-cols-2 gap-3 w-full">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedScenario(s.id)}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedScenario === s.id 
                ? 'bg-softBlue border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-x-[2px] translate-y-[2px]' 
                : 'bg-white border-gray-300 hover:border-black'
              }`}
            >
              <div className="text-3xl mb-2">{s.emoji}</div>
              <div className="text-sm font-bold leading-tight">{s.label}</div>
            </button>
          ))}
        </div>

        <Button 
          onClick={handleGenerate} 
          disabled={!selectedScenario || !senderName || isGenerating}
          className="w-full mt-8"
        >
          {isGenerating ? 'Cooking up apology... 🍳' : 'Next ➡️'}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-6 pt-12 space-y-6 max-w-md mx-auto text-center">
      <h2 className="text-3xl font-bold">Review Apology 💌</h2>
      
      <div className="p-6 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] w-full">
        <p className="text-xl italic">"{generatedText}"</p>
        <p className="text-right mt-4 font-bold">- {senderName}</p>
      </div>

      <div className="space-y-4 w-full">
        <p className="text-sm text-gray-500">
          They will have to play "Whack-a-Sorry-Mole" to see this message.
        </p>
        
        {shareLink ? (
             <div className="p-4 bg-green-100 border-2 border-green-500 rounded-xl text-green-800">
                Link Generated & Copied! Send it!
             </div>
        ) : (
            <Button onClick={handleCopyLink} className="w-full bg-softGreen hover:bg-green-200">
            Copy Magic Link 🔗
            </Button>
        )}
        
        <button 
            onClick={() => setStep(1)} 
            className="text-gray-500 underline text-sm"
        >
            Start Over
        </button>
      </div>
    </div>
  );
};
