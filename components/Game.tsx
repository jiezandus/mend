import React, { useState, useEffect, useCallback } from 'react';
import { Mole } from '../types';

interface GameProps {
  onComplete: () => void;
}

export const Game: React.FC<GameProps> = ({ onComplete }) => {
  const [moles, setMoles] = useState<Mole[]>(Array(9).fill(null).map((_, i) => ({ id: i, status: 'down', type: 'normal' })));
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameActive, setGameActive] = useState(false);

  // Start game on mount
  useEffect(() => {
    setGameActive(true);
  }, []);

  // Timer logic
  useEffect(() => {
    if (!gameActive) return;
    if (timeLeft <= 0) {
      setGameActive(false);
      onComplete();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, gameActive, onComplete]);

  // Mole popping logic
  useEffect(() => {
    if (!gameActive) return;

    const popMole = () => {
      const randomIdx = Math.floor(Math.random() * 9);
      setMoles((prev) => {
        const newMoles = [...prev];
        if (newMoles[randomIdx].status === 'down') {
          newMoles[randomIdx] = { ...newMoles[randomIdx], status: 'up' };
          // Auto hide after random time
          setTimeout(() => {
            setMoles((current) => {
                const currentMoles = [...current];
                if (currentMoles[randomIdx].status === 'up') {
                    currentMoles[randomIdx].status = 'down';
                }
                return currentMoles;
            })
          }, 800 + Math.random() * 500);
        }
        return newMoles;
      });
    };

    const interval = setInterval(popMole, 600);
    return () => clearInterval(interval);
  }, [gameActive]);

  const whack = (index: number) => {
    if (!gameActive) return;
    
    setMoles((prev) => {
      const newMoles = [...prev];
      if (newMoles[index].status === 'up') {
        newMoles[index].status = 'hit';
        setScore((s) => s + 10);
        setTimeout(() => {
            setMoles((current) => {
                const resetMoles = [...current];
                resetMoles[index].status = 'down';
                return resetMoles;
            })
        }, 200);
      }
      return newMoles;
    });
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4 bg-softBlue">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mt-8">
        <div className="flex justify-between items-center mb-6">
          <div className="text-xl font-bold">Score: {score}</div>
          <div className="text-xl font-bold text-red-500">Time: {timeLeft}s</div>
        </div>

        <h2 className="text-center text-xl mb-4">Whack the Apologies! 🔨</h2>

        <div className="grid grid-cols-3 gap-4">
          {moles.map((mole, i) => (
            <button
              key={mole.id}
              onClick={() => whack(i)}
              className="relative w-full aspect-square bg-softGreen rounded-xl border-2 border-black overflow-hidden active:scale-95 transition-transform"
            >
              {/* Hole Background */}
              <div className="absolute inset-0 flex items-center justify-center opacity-20 text-4xl">
                🕳️
              </div>
              
              {/* Mole */}
              <div 
                className={`absolute inset-0 flex items-center justify-center transition-transform duration-200 ${
                  mole.status === 'up' ? 'translate-y-0' : 
                  mole.status === 'hit' ? 'translate-y-4 scale-90' : 'translate-y-full'
                }`}
              >
                 <div className="flex flex-col items-center">
                    <span className="text-xs font-bold bg-white px-1 border border-black rounded mb-1">
                        {mole.status === 'hit' ? 'Ouch!' : 'Sorry!'}
                    </span>
                    <span className="text-4xl">
                        {mole.status === 'hit' ? '🤕' : '🥺'}
                    </span>
                 </div>
              </div>
            </button>
          ))}
        </div>
        
        <p className="text-center mt-6 text-sm text-gray-500">Tap the crying faces to accept apologies!</p>
      </div>
    </div>
  );
};
