import React, { useState, useEffect } from 'react';
import type { Earning } from '../types';
import { MouseClickIcon } from './icons/MouseClickIcon';

interface ClickToEarnProps {
  onAddEarning: (earning: Omit<Earning, 'id'>) => void;
}

const videoLinks = [
  'https://www.tiktok.com/t/ZPRT7sD5R/',
  'https://www.tiktok.com/t/ZPRT7sLqC/',
  'https://www.tiktok.com/t/ZPRT7s2pS/',
  'https://www.tiktok.com/t/ZPRT7s9d8/',
  'https://www.tiktok.com/t/ZPRT7suyE/',
  'https://www.tiktok.com/t/ZPRT7sFoC/',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'https://www.youtube.com/watch?v=3JZ_D3ELwOQ',
  'https://www.youtube.com/watch?v=9bZkp7q19f0',
  'https://www.youtube.com/watch?v=kffacxfA7G4',
  'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
  'https://www.youtube.com/watch?v=JGwWNGJdvx8',
  'https://www.youtube.com/watch?v=nfWlot6h_JM',
  'https://www.youtube.com/watch?v=09R8_2nJtjg',
  'https://www.youtube.com/watch?v=C0DPdy98e4c',
  'https://www.youtube.com/watch?v=H5v3kku4y6Q',
  'https://www.youtube.com/watch?v=fRh_vgS2dFE',
  'https://www.youtube.com/watch?v=l_n_S4Qv59g',
  'https://www.youtube.com/watch?v=RgKAFK5djSk',
  'https://www.tiktok.com/t/ZPRT7s5bY/',
];

const COOLDOWN_SECONDS = 60;

const ClickToEarn: React.FC<ClickToEarnProps> = ({ onAddEarning }) => {
  const [cooldowns, setCooldowns] = useState<number[]>(Array(20).fill(0));

  useEffect(() => {
    const timer = setInterval(() => {
      setCooldowns(prevCooldowns => 
        prevCooldowns.map(cd => (cd > 0 ? cd - 1 : 0))
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleClick = (index: number) => {
    if (cooldowns[index] > 0) return;

    // Open the specified URL in a new tab
    window.open(videoLinks[index], '_blank');

    onAddEarning({
      source: 'Video Watched',
      amount: 0.50,
      date: new Date().toISOString().split('T')[0],
    });

    setCooldowns(prev => prev.map((cd, i) => i === index ? COOLDOWN_SECONDS : cd));
  };

  return (
    <div className="bg-card p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold text-text-primary mb-4">Watch &amp; Earn</h2>
      <p className="text-sm text-text-secondary mb-4">Click a button to watch a video and instantly add RS 0.50 to your earnings. There is a 1 minute cooldown per video.</p>
      <div className="flex flex-wrap justify-center gap-3">
        {Array(20).fill(0).map((_, index) => {
          const onCooldown = cooldowns[index] > 0;
          return (
            <button
              key={index}
              onClick={() => handleClick(index)}
              disabled={onCooldown}
              className={`flex-grow sm:flex-grow-0 basis-24 flex flex-col items-center justify-center p-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed ${
                onCooldown
                  ? 'bg-gray-400'
                  : 'bg-primary hover:bg-primary-hover'
              }`}
              aria-label={`Watch video to earn button ${index + 1}`}
            >
              <MouseClickIcon className="w-6 h-6 mb-1" />
              <span className="font-semibold" style={{ minHeight: '1.25rem' }}>
                {onCooldown ? `Wait (${cooldowns[index]}s)` : 'Watch Video'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ClickToEarn;