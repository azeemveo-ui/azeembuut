import React, { useState, useEffect, useRef } from 'react';
import type { Earning } from '../types';
import { CommentIcon } from './icons/CommentIcon';

interface CommentToEarnProps {
  onAddEarning: (earning: Omit<Earning, 'id'>) => void;
}

const videoLinks = [
  'https://www.tiktok.com/t/ZPRT7vEWW/',
  'https://www.tiktok.com/t/ZPRT7vjD9/',
  'https://www.tiktok.com/t/ZPRT7v5oN/',
  'https://www.tiktok.com/t/ZPRT7v3Wb/',
  'https://www.tiktok.com/t/ZPRT7vM2k/',
  'https://www.tiktok.com/t/ZPRT7vC1q/',
  'https://www.youtube.com/watch?v=d-jbBNg8YKE',
  'https://www.youtube.com/watch?v=l_EaNqT3isY',
  'https://www.youtube.com/watch?v=lWA2pjMjpBs',
  'https://www.youtube.com/watch?v=x-64CaD8GXw',
  'https://www.youtube.com/watch?v=xWcldHxI3aI',
  'https://www.youtube.com/watch?v=4TjcT7Gkgrs',
  'https://www.youtube.com/watch?v=W-w3WfgpcPs',
  'https://www.youtube.com/watch?v=Qc7_zRjH808',
  'https://www.youtube.com/watch?v=rTVjnBo96Ug',
  'https://www.youtube.com/watch?v=i0p1bmr0EmE',
  'https://www.youtube.com/watch?v=d9MyW72ELq0',
  'https://www.youtube.com/watch?v=e-ORhEE9VVg',
  'https://www.youtube.com/watch?v=OPf0YbXqDm0',
  'https://www.tiktok.com/t/ZPRT7vSDB/',
];

const COOLDOWN_SECONDS = 60;
const PAYMENT_DELAY_MINUTES = 2;
const NUM_BUTTONS = 20;

type ButtonState = 'idle' | 'pending_confirmation' | 'payment_pending' | 'on_cooldown';

const CommentToEarn: React.FC<CommentToEarnProps> = ({ onAddEarning }) => {
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

  const handleCommentClick = (index: number) => {
    if (buttonStates[index] !== 'idle') return;
    window.open(videoLinks[index], '_blank');
    setButtonStates(prev => prev.map((state, i) => i === index ? 'pending_confirmation' : state));
  };

  const handleConfirmClick = (index: number) => {
    if (buttonStates[index] !== 'pending_confirmation') return;
    setButtonStates(prev => prev.map((state, i) => i === index ? 'payment_pending' : state));

    const timeoutId = setTimeout(() => {
        onAddEarning({
            source: 'Video Commented (Confirmed)',
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
              return 'Comment on Video';
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
      <h2 className="text-xl font-bold text-text-primary mb-4">Comment &amp; Earn</h2>
      <p className="text-sm text-text-secondary mb-4">
        Comment on a video, then confirm to add RS 0.50. The payment will be added after a 2 minute confirmation period. There is a 1 minute cooldown per video.
        <strong className="block mt-1 text-red-600">Please note: If you do not comment on the video, payment will not be added.</strong>
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        {Array(NUM_BUTTONS).fill(0).map((_, index) => {
          const state = buttonStates[index];
          const isPendingConfirmation = state === 'pending_confirmation';
          const isDisabled = state === 'on_cooldown' || state === 'payment_pending';
          
          const handleClick = () => {
              if (state === 'idle') {
                  handleCommentClick(index);
              } else if (state === 'pending_confirmation') {
                  handleConfirmClick(index);
              }
          };

          return (
            <button
              key={index}
              onClick={handleClick}
              disabled={isDisabled}
              className={`flex-grow sm:flex-grow-0 basis-32 flex flex-col items-center justify-center p-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed ${
                isDisabled
                  ? 'bg-gray-400'
                  : isPendingConfirmation
                  ? 'bg-secondary hover:bg-green-700'
                  : 'bg-primary hover:bg-primary-hover'
              }`}
              aria-label={`Comment on video to earn button ${index + 1}`}
            >
              <CommentIcon className="w-6 h-6 mb-1" />
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

export default CommentToEarn;