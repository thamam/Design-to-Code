import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Zap, Volume2, Square, Send } from 'lucide-react';
import { ChatMessage, generateChatResponse, generateSpeech } from '../services/chatService';

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFastMode, setIsFastMode] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await generateChatResponse(newMessages, isFastMode);
      setMessages([...newMessages, { id: (Date.now() + 1).toString(), role: 'model', text: responseText }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages([...newMessages, { id: (Date.now() + 1).toString(), role: 'model', text: 'Sorry, I encountered an error.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayAudio = async (message: ChatMessage) => {
    if (playingId === message.id) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }

    try {
      setPlayingId(message.id);
      const base64Audio = await generateSpeech(message.text);
      if (base64Audio) {
        const audioUrl = `data:audio/mp3;base64,${base64Audio}`;
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.play();
          audioRef.current.onended = () => setPlayingId(null);
        } else {
          const audio = new Audio(audioUrl);
          audioRef.current = audio;
          audio.play();
          audio.onended = () => setPlayingId(null);
        }
      } else {
        setPlayingId(null);
      }
    } catch (error) {
      console.error("TTS error:", error);
      setPlayingId(null);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50 flex items-center justify-center"
        title="Open AI Assistant"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-blue-600 text-white">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          <span className="font-medium">AI Assistant</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsFastMode(!isFastMode)}
            className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full transition-colors ${
              isFastMode ? 'bg-yellow-400 text-yellow-900' : 'bg-blue-500 text-white hover:bg-blue-400'
            }`}
            title={isFastMode ? "Fast Mode (gemini-2.5-flash-lite)" : "Pro Mode (gemini-3.1-pro-preview)"}
          >
            <Zap className="w-3 h-3" />
            {isFastMode ? 'Fast' : 'Pro'}
          </button>
          <button onClick={() => setIsOpen(false)} className="hover:text-gray-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-10 text-sm">
            Ask me anything about your code!
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-lg p-3 ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-800 shadow-sm'
              }`}
            >
              <div className="whitespace-pre-wrap text-sm">{msg.text}</div>
              {msg.role === 'model' && (
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={() => handlePlayAudio(msg)}
                    className={`transition-colors ${
                      playingId === msg.id ? 'text-blue-600' : 'text-gray-400 hover:text-blue-600'
                    }`}
                    title={playingId === msg.id ? "Stop Audio" : "Play Audio"}
                  >
                    {playingId === msg.id ? <Square className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 bg-white border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
