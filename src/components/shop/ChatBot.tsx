'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'HALLO. ICH BIN DER SHOP4YOU CORE-ASSISTENT. WIE KANN ICH DIR HEUTE HELFEN?',
      time: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false); // 🎯 Neu: Zeigt an, ob der Bot gerade "nachdenkt"
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Automatisch zum Ende scrollen bei neuen Nachrichten
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const currentTime = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    const userText = inputValue.toUpperCase(); // Studio-Style Caps
    
    const userMessage: Message = {
      id: Math.random().toString(),
      sender: 'user',
      text: userText,
      time: currentTime,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // 🎯 ECHTE API-ANBINDUNG: Schickt die Frage an unser PostgreSQL-Such-Backend
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userText }),
      });

      const data = await response.json();
      const botTime = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

      const botMessage: Message = {
        id: Math.random().toString(),
        sender: 'bot',
        text: data.response || 'SYSTEM-TIMEOUT. BITTE ERNEUT VERSUCHEN.',
        time: botTime,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("CHAT_FETCH_ERROR:", error);
      const errorTime = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
      
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: 'CORE-SYSTEM-VERBINDUNGSFEHLER. PRÜFE DEINE NETZWERKVERBINDUNG.',
          time: errorTime,
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans text-black selection:bg-black selection:text-white">
      
      {/* 1. DER SCHWEBENDE TRIGGER-BUTTON */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-transform cursor-pointer border border-zinc-800"
          title="SHOP4YOU Support Chat"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      )}

      {/* 2. DAS CHAT-FENSTER */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-[500px] bg-white border border-black shadow-2xl flex flex-col animate-fade-in">
          
          {/* Chat Header */}
          <div className="bg-black text-white h-12 px-4 flex items-center justify-between border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-amber-500 animate-bounce' : 'bg-emerald-500 animate-pulse'}`}></span>
              <span className="text-[10px] font-mono tracking-widest uppercase">
                {isLoading ? 'SHOP4YOU // ENGINE THINKING...' : 'SHOP4YOU // AI-ASSISTANT'}
              </span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-zinc-400 hover:text-white text-xs font-mono uppercase tracking-widest cursor-pointer p-1"
            >
              [X]
            </button>
          </div>

          {/* Chat-Verlauf */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-zinc-50">
            {messages.map((msg) => {
              const isBot = msg.sender === 'bot';
              return (
                <div 
                  key={msg.id} 
                  className={`flex flex-col max-w-[80%] ${isBot ? 'self-start items-start' : 'self-end items-end'}`}
                >
                  <div 
                    className={`px-3 py-2 text-xs border whitespace-pre-line ${
                      isBot 
                        ? 'bg-white border-zinc-200 text-black rounded-none shadow-sm' 
                        : 'bg-black border-black text-white rounded-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[8px] font-mono text-zinc-400 mt-1 uppercase">
                    {msg.time} — {msg.sender}
                  </span>
                </div>
              );
            })}
            
            {/* Minimalistischer Lade-Indikator im Terminal-Vibe */}
            {isLoading && (
              <div className="self-start flex flex-col items-start max-w-[80%]">
                <div className="px-3 py-2 text-xs border border-zinc-200 bg-white text-zinc-400 rounded-none font-mono tracking-widest animate-pulse">
                  [RECHNERISCHE ANALYSE...]
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Eingabe-Formular */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-zinc-200 flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={isLoading ? "BITTE WARTEN..." : "NACHRICHT EINGEBEN..."}
              disabled={isLoading}
              className="flex-1 h-10 border border-zinc-200 px-3 text-xs uppercase font-mono tracking-wider bg-zinc-50 focus:outline-none focus:border-black focus:bg-white transition-colors rounded-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-black text-white text-[10px] font-mono tracking-widest px-4 h-10 uppercase hover:bg-zinc-950 transition-colors cursor-pointer rounded-none disabled:bg-zinc-400 disabled:cursor-not-allowed"
            >
              SEND
            </button>
          </form>

        </div>
      )}

    </div>
  );
}