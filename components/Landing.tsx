import React from 'react';
import { Button } from './Button';

interface LandingProps {
  onStartApology: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onStartApology }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center space-y-8 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-5xl font-bold text-ink wiggle">MendMoji</h1>
        <p className="text-xl text-gray-600">Fix things... playfully.</p>
      </div>

      <div className="w-full max-w-md space-y-4">
        <div className="p-6 bg-white border-2 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]">
          <h2 className="text-2xl mb-4">What do you need to do?</h2>
          
          <div className="space-y-4">
            <Button onClick={onStartApology} className="w-full flex items-center justify-center gap-2">
              <span>🥺</span> Say Sorry
            </Button>
            
            <Button onClick={() => {}} variant="disabled" className="w-full flex items-center justify-center gap-2">
              <span>💔</span> Break Up (Coming Soon)
            </Button>

            <Button onClick={() => {}} variant="disabled" className="w-full flex items-center justify-center gap-2">
              <span>💸</span> Ask for Money (Coming Soon)
            </Button>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <img 
          src="https://picsum.photos/200/200" 
          alt="Cute mascot" 
          className="rounded-full border-4 border-black w-32 h-32 mx-auto grayscale opacity-50 hover:grayscale-0 transition-all duration-500"
        />
      </div>
    </div>
  );
};
