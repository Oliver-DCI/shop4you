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
  const [showTooltip, setShowTooltip] = useState(false); // 🎯 Steuert das dauerhafte Einblenden
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'HALLO. ICH BIN DER SHOP4YOU CORE-ASSISTENT. WIE KANN ICH DIR HEUTE HELFEN?',
      time: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false); 
  const chatEndRef = useRef<HTMLDivElement>(null);

  // 🎯 PRÜFUNG: Hat der User den Chat schon mal genutzt?
  useEffect(() => {
    const hasUsedChat = localStorage.getItem('shop4you_chat_used');
    // Wenn er ihn noch nie genutzt hat, zeigen wir den Hinweis dauerhaft an
    if (!hasUsedChat) {
      setShowTooltip(true);
    }
  }, []);

  // Automatisch zum Ende scrollen bei neuen Nachrichten
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    // 🎯 SOBALD DIE ERSTE NACHRICHT GEHT: Hinweis für immer ausblenden & im Browser merken
    localStorage.setItem('shop4you_chat_used', 'true');
    setShowTooltip(false);

    const currentTime = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    const userText = inputValue.toUpperCase(); 
    
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
    <div className="fixed bottom-6 right-6 z-50 font-sans text-black selection:bg-black selection:text-white flex flex-col items-end gap-1">
      
      {/* 1. TEXT-HINWEIS (STEHT DAUERHAFT BIS ZUR ERSTEN INTERAKTION) */}
      {!isOpen && showTooltip && (
        <div className="text-[10px] font-mono tracking-[0.15em] text-black bg-transparent px-2 py-1 select-none font-medium animate-pulse">
          [ ONLINE // ASSISTENT ]
        </div>
      )}

      {/* 2. DER SCHWEBENDE TRIGGER-BUTTON WITH GLOW */}
      {!isOpen && (
        <div className="relative group">
          {/* Pulsierender Hintergrund-Ring */}
          <span className="absolute inset-0 rounded-full bg-black/10 animate-ping opacity-75 pointer-events-none scale-105"></span>
          
          <button
            onClick={() => {
              setIsOpen(true);
            }}
            className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center shadow-2xl transition-all cursor-pointer border border-zinc-800 hover:bg-zinc-900"
            title="SHOP4YOU Support Chat"
          >
            <svg className="w-7 h-7 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.25} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
        </div>
      )}

      {/* 3. DAS CHAT-FENSTER */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-[500px] bg-white border border-black shadow-2xl flex flex-col transition-all">
          
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