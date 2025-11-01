import React, { useState, useEffect, useRef } from 'react';
import type { Earning } from '../types';
import { HeartIcon } from './icons/HeartIcon';

interface LikeToEarnProps {
  onAddEarning: (earning: Omit<Earning, 'id'>) => void;
}

const videoLinks = [
  'https://www.tiktok.com/t/ZPRT7h3vG/',
  'https://www.tiktok.com/t/ZPRT7hG5j/',
  'https://www.tiktok.com/t/ZPRT7hYpC/',
  'https://www.tiktok.com/t/ZPRT7hBfW/',
  'https://www.tiktok.com/t/ZPRT7h5M4/',
  'https://www.tiktok.com/t/ZPRT7h9jE/',
  'https://www.youtube.com/watch?v=u9Dg-g7t2l4',
  'https://www.youtube.com/watch?v=60ItHLz5WEA',
  'https://www.youtube.com/watch?v=2Vv-BfVoq4g',
  'https://www.youtube.com/watch?v=K4DyBUG242c',
  'https://www.youtube.com/watch?v=hT_nvWreIhg',
  'https://www.youtube.com/watch?v=tQ0yjYUFKAE',
  'https://www.youtube.com/watch?v=8-0_w2d-S6s',
  'https://www.youtube.com/watch?v=1-xGerv5FOk',
  'https://www.youtube.com/watch?v=DK_0jXPuIr0',
  'https://www.youtube.com/watch?v=y2-rZGanx_M',
  'https://www.youtube.com/watch?v=fPO76Jlnz6c',
  'https://www.youtube.com/watch?v=pXRviuL6vMY',
  'https://www.youtube.com/watch?v=pAgnJDJN4VA',
  'https://www.tiktok.com/t/ZPRT7h2Xw/',
];

const COOLDOWN_SECONDS = 60;
const PAYMENT_DELAY_MINUTES = 2;
const NUM_BUTTONS = 20;

type ButtonState = 'idle' | 'pending_confirmation' | 'payment_pending' | 'on_cooldown';

const LikeToEarn: React.FC<LikeToEarnProps> = ({ onAddEarning }) => {
  const [buttonStates, setButtonStates] = useState<ButtonState[]>(Array(NUM_BUTTONS).fill('idle'));
  const [cooldowns, setCooldowns] = useState<number[]>(Array(NUM_BUTTONS).fill(0));
  // Fix: The return type of setTimeout in the browser is `number`, not `NodeJS.Timeout`.
  const paymentTimeouts = useRef<number[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCooldowns(prevCooldowns => 
        prevCooldowns.map((cd, index) => {
          if (cd > 1) {
            return cd - 1;
          } else if (cd === 1) {
            // Cooldown finished, reset state
            setButtonStates(prevStates => 
                prevStates.map((state, i) => i === index && state === 'on_cooldown' ? 'idle' : state)
            );
            return 0;
          }
          return 0;
        })
      );
    }, 1000);

    return () => {
        clearInterval(timer);
        // Clear all pending payment timeouts when component unmounts
        paymentTimeouts.current.forEach(clearTimeout);
    };
  }, []);

  const handleLikeClick = (index: number) => {
    if (buttonStates[index] !== 'idle') return;

    // Open the specified URL in a new tab
    window.open(videoLinks[index], '_blank');

    // Change state to pending confirmation
    setButtonStates(prev => prev.map((state, i) => i === index ? 'pending_confirmation' : state));
  };

  const handleConfirmClick = (index: number) => {
    if (buttonStates[index] !== 'pending_confirmation') return;
    
    // Change state to pending payment
    setButtonStates(prev => prev.map((state, i) => i === index ? 'payment_pending' : state));

    // Set a timeout to add the earning after 2 minutes
    const timeoutId = setTimeout(() => {
        onAddEarning({
            source: 'Video Liked (Confirmed)',
            amount: 0.50,
            date: new Date().toISOString().split('T')[0],
        });

        // Start cooldown and set state after earning is added
        setCooldowns(prev => prev.map((cd, i) => i === index ? COOLDOWN_SECONDS : cd));
        setButtonStates(prev => prev.map((state, i) => i === index ? 'on_cooldown' : state));
    }, PAYMENT_DELAY_MINUTES * 60 * 1000);
    
    paymentTimeouts.current[index] = timeoutId;
  };
  
  const getButtonContent = (index: number) => {
      switch (buttonStates[index]) {
          case 'idle':
              return 'Like Video';
          case 'pending_confirmation':
              return 'Confirm & Earn';
          case 'payment_pending':
              return 'Adding...';
          case 'on_cooldown':
              return `Wait (${cooldowns[index]}s)`;
      }
  };

  return (
    <div className="bg-card p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold text-text-primary mb-4">Like &amp; Earn</h2>
      <p className="text-sm text-text-secondary mb-4">
        Like a video, then confirm to add RS 0.50. The payment will be added after a 2 minute confirmation period. There is a 1 minute cooldown per video.
        <strong className="block mt-1 text-red-600">Please note: If you do not like the video, payment will not be added.</strong>
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        {Array(NUM_BUTTONS).fill(0).map((_, index) => {
          const state = buttonStates[index];
          const isPendingConfirmation = state === 'pending_confirmation';
          const isDisabled = state === 'on_cooldown' || state === 'payment_pending';
          
          const handleClick = () => {
              if (state === 'idle') {
                  handleLikeClick(index);
              } else if (state === 'pending_confirmation') {
                  handleConfirmClick(index);
              }
          };

          return (
            <button
              key={index}
              onClick={handleClick}
              disabled={isDisabled}
              className={`flex-grow sm:flex-grow-0 basis-28 flex flex-col items-center justify-center p-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed ${
                isDisabled
                  ? 'bg-gray-400'
                  : isPendingConfirmation
                  ? 'bg-secondary hover:bg-green-700'
                  : 'bg-primary hover:bg-primary-hover'
              }`}
              aria-label={`Like video to earn button ${index + 1}`}
            >
              <HeartIcon className="w-6 h-6 mb-1" />
              <span className="font-semibold" style={{ minHeight: '1.25rem' }}>
                {getButtonContent(index)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LikeToEarn;