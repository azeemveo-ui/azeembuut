import React, { useState, useEffect, useRef } from 'react';
import type { Earning } from '../types';
import { ShareIcon } from './icons/ShareIcon';

interface ShareToEarnProps {
  onAddEarning: (earning: Omit<Earning, 'id'>) => void;
}

const videoLinks = [
  'https://www.tiktok.com/t/ZPRT7avs6/',
  'https://www.tiktok.com/t/ZPRT7aA7N/',
  'https://www.tiktok.com/t/ZPRT7aGjB/',
  'https://www.tiktok.com/t/ZPRT7a2xL/',
  'https://www.tiktok.com/t/ZPRT7adKb/',
  'https://www.tiktok.com/t/ZPRT7aT3C/',
  'https://www.youtube.com/watch?v=uelHwf8o7_U',
  'https://www.youtube.com/watch?v=PT2_F-1esPk',
  'https://www.youtube.com/watch?v=V-_O7nl0Ii0',
  'https://www.youtube.com/watch?v=b8m9zhNAgKs',
  'https://www.youtube.com/watch?v=34Na4j8AVgA',
  'https://www.youtube.com/watch?v=hY7m5jjJ9mM',
  'https://www.youtube.com/watch?v=zO2rA7V1a-s',
  'https://www.youtube.com/watch?v=zABLzdDqS4w',
  'https://www.youtube.com/watch?v=5qm8PH4xAss',
  'https://www.youtube.com/watch?v=nu_pCVPKzTk',
  'https://www.youtube.com/watch?v=QRgfhA0sO6I',
  'https://www.youtube.com/watch?v=tCXGJQYZ9JA',
  'https://www.youtube.com/watch?v=IcrbM1l_BoI',
  'https://www.tiktok.com/t/ZPRT7aY4Y/',
];

const COOLDOWN_SECONDS = 60;
const PAYMENT_DELAY_MINUTES = 2;
const NUM_BUTTONS = 20;

type ButtonState = 'idle' | 'pending_confirmation' | 'payment_pending' | 'on_cooldown';

const ShareToEarn: React.FC<ShareToEarnProps> = ({ onAddEarning }) => {
  const [buttonStates, setButtonStates] = useState<ButtonState[]>(Array(NUM_BUTTONS).fill('idle'));
  const [cooldowns, setCooldowns] = useState<number[]>(Array(NUM_BUTTONS).fill(0));
  const paymentTimeouts = useRef<number[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCooldowns(prevCooldowns => 
        prevCooldowns.map((cd, index) => {
          if (cd > 1) {
            return cd - 1;
          } else if (cd === 1) {
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
        paymentTimeouts.current.forEach(clearTimeout);
    };
  }, []);

  const handleShareClick = (index: number) => {
    if (buttonStates[index] !== 'idle') return;
    window.open(videoLinks[index], '_blank');
    setButtonStates(prev => prev.map((state, i) => i === index ? 'pending_confirmation' : state));
  };

  const handleConfirmClick = (index: number) => {
    if (buttonStates[index] !== 'pending_confirmation') return;
    setButtonStates(prev => prev.map((state, i) => i === index ? 'payment_pending' : state));

    const timeoutId = setTimeout(() => {
        onAddEarning({
            source: 'Video Shared (Confirmed)',
            amount: 0.50,
            date: new Date().toISOString().split('T')[0],
        });
        setCooldowns(prev => prev.map((cd, i) => i === index ? COOLDOWN_SECONDS : cd));
        setButtonStates(prev => prev.map((state, i) => i === index ? 'on_cooldown' : state));
    }, PAYMENT_DELAY_MINUTES * 60 * 1000);
    
    paymentTimeouts.current[index] = timeoutId;
  };
  
  const getButtonContent = (index: number) => {
      switch (buttonStates[index]) {
          case 'idle':
              return 'Share Video';
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
      <h2 className="text-xl font-bold text-text-primary mb-4">Share &amp; Earn</h2>
      <p className="text-sm text-text-secondary mb-4">
        Share a video, then confirm to add RS 0.50. The payment will be added after a 2 minute confirmation period. There is a 1 minute cooldown per video.
        <strong className="block mt-1 text-red-600">Please note: If you do not share the video, payment will not be added.</strong>
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        {Array(NUM_BUTTONS).fill(0).map((_, index) => {
          const state = buttonStates[index];
          const isPendingConfirmation = state === 'pending_confirmation';
          const isDisabled = state === 'on_cooldown' || state === 'payment_pending';
          
          const handleClick = () => {
              if (state === 'idle') {
                  handleShareClick(index);
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
              aria-label={`Share video to earn button ${index + 1}`}
            >
              <ShareIcon className="w-6 h-6 mb-1" />
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

export default ShareToEarn;