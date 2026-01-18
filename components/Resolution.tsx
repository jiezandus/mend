import React, { useState } from 'react';
import { ApologyPayload } from '../types';
import { PRESET_RESPONSES } from '../constants';
import { Button } from './Button';

interface ResolutionProps {
  payload: ApologyPayload;
}

export const Resolution: React.FC<ResolutionProps> = ({ payload }) => {
  const [showResponseMenu, setShowResponseMenu] = useState(false);

  const handleResponseSelect = (response: string) => {
    // Construct a simple message link (SMS/WhatsApp simulation)
    const text = `Re: Your apology.\n\n${response}`;
    const url = `sms:?&body=${encodeURIComponent(text)}`;
    window.location.href = url;
  };

  if (!showResponseMenu) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-pink-100 animate-fade-in">
         <div className="w-full max-w-md bg-white rounded-3xl p-8 border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center space-y-6">
            <div className="text-6xl animate-bounce">💌</div>
            
            <h1 className="text-3xl font-bold text-ink">I'm Sorry!</h1>
            
            <div className="p-4 bg-softYellow border-2 border-orange-200 rounded-xl transform -rotate-1">
                <p className="text-lg leading-relaxed font-hand">
                    "{payload.customMessage}"
                </p>
                <p className="text-right mt-2 font-bold text-gray-600">- {payload.senderName}</p>
            </div>

            <p className="text-sm text-gray-500">
                The sender has formally requested forgiveness via kawaii moles.
            </p>

            <div className="pt-4">
                <Button 
                    variant="danger" 
                    onClick={() => setShowResponseMenu(true)}
                    className="w-full text-xl shadow-[4px_4px_0px_0px_rgba(180,0,0,1)]"
                >
                    Reset Relationship 🔴
                </Button>
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-softBlue">
      <div className="w-full max-w-md space-y-6">
        <h2 className="text-3xl font-bold text-center text-ink">Choose Response</h2>
        <p className="text-center text-gray-600">How do you want to resolve this?</p>
        
        <div className="space-y-3">
            {PRESET_RESPONSES.map((resp, idx) => (
                <button
                    key={idx}
                    onClick={() => handleResponseSelect(resp)}
                    className="w-full p-4 bg-white border-2 border-black rounded-xl text-left font-bold text-lg hover:bg-softGreen transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]"
                >
                    {resp}
                </button>
            ))}
        </div>

        <button 
            onClick={() => setShowResponseMenu(false)}
            className="w-full text-center text-gray-500 mt-4 underline"
        >
            Back to Apology
        </button>
      </div>
    </div>
  );
};
