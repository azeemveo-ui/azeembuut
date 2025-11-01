import React, { useState } from 'react';
import { ChatBotIcon } from './icons/ChatBotIcon';
import { XIcon } from './icons/XIcon';
import { WhatsAppIcon } from './icons/WhatsAppIcon';

// IMPORTANT: Replace with the actual admin WhatsApp number
const WHATSAPP_NUMBER = '+923057943838'; 
const WHATSAPP_MESSAGE = "Hello Admin, I need help with the Earning App.";
const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

const AgentAI: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-transform transform hover:scale-110 z-50"
        aria-label="Open AI Agent"
      >
        <ChatBotIcon className="h-8 w-8" />
      </button>

      {/* Chat Pop-up */}
      {isOpen && (
        <div 
            className="fixed bottom-24 right-6 w-80 bg-card rounded-xl shadow-2xl border border-gray-200 z-50 animate-fade-in-up"
            role="dialog"
            aria-modal="true"
            aria-labelledby="agent-ai-title"
        >
          <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200 rounded-t-xl">
            <h3 id="agent-ai-title" className="text-lg font-bold text-text-primary">Agent AI Support</h3>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-text-secondary hover:text-text-primary"
              aria-label="Close AI Agent"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="p-6 text-center">
            <p className="text-text-secondary mb-4">
              Have a question or need assistance? Contact the admin directly on WhatsApp.
            </p>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
            >
              <WhatsAppIcon className="w-5 h-5 mr-2" />
              Contact Admin on WhatsApp
            </a>
            <p className="mt-3 text-xs text-gray-500">
                You will be redirected to WhatsApp.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default AgentAI;