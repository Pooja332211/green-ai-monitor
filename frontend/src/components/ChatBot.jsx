import React, { useState, useEffect, useRef } from 'react';
import { chatWithGemini } from '../services/api';
import '../styles/global.css';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "System Initialized. I am Green AI Core. How can I assist with your emission analysis?", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const speak = (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Stop previous
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.0;
            utterance.pitch = 0.8; // Robotic pitch
            utterance.volume = 1.0;

            // Try to find a robotic voice if available
            const voices = window.speechSynthesis.getVoices();
            const roboticVoice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Microsoft David'));
            if (roboticVoice) utterance.voice = roboticVoice;

            window.speechSynthesis.speak(utterance);
        }
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const response = await chatWithGemini({ message: input });
            const botMsg = { text: response.data.response, sender: 'bot' };
            setMessages(prev => [...prev, botMsg]);
            speak(response.data.response);
        } catch (error) {
            const errorMsg = { text: "Error: Connection to Neural Core lost.", sender: 'bot' };
            setMessages(prev => [...prev, errorMsg]);
            speak("Error. Connection lost.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chatbot-container">
            {/* Toggle Button */}
            <button
                className={`chatbot-toggle ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? '×' : '💬'}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="chatbot-window glass-card">
                    <div className="chatbot-header">
                        <span className="dot"></span> GREEN AI CORE
                    </div>

                    <div className="chatbot-messages">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`message ${msg.sender}`}>
                                {msg.sender === 'bot' && <div className="bot-icon">🤖</div>}
                                <div className="bubble">{msg.text}</div>
                            </div>
                        ))}
                        {loading && (
                            <div className="message bot">
                                <div className="bot-icon">🤖</div>
                                <div className="bubble typing">...</div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chatbot-input">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask about CO2/Optimization..."
                            disabled={loading}
                        />
                        <button onClick={handleSend} disabled={loading}>→</button>
                    </div>
                </div>
            )}

            <style jsx>{`
        .chatbot-container {
          position: fixed;
          bottom: 30px;
          right: 30px;
          z-index: 1000;
          font-family: 'JetBrains Mono', monospace;
        }

        .chatbot-toggle {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: var(--robotic-blue);
          border: none;
          color: #000;
          font-size: 24px;
          cursor: pointer;
          box-shadow: 0 0 20px rgba(0, 210, 255, 0.4);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chatbot-toggle:hover {
          transform: scale(1.1);
          box-shadow: 0 0 30px rgba(0, 210, 255, 0.6);
        }

        .chatbot-window {
          position: absolute;
          bottom: 80px;
          right: 0;
          width: 350px;
          height: 500px;
          background: rgba(5, 5, 8, 0.95);
          border: 1px solid var(--robotic-blue);
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: slideUp 0.3s ease-out;
          box-shadow: 0 0 40px rgba(0, 0, 0, 0.5);
        }

        .chatbot-header {
          padding: 15px;
          background: rgba(0, 210, 255, 0.1);
          border-bottom: 1px solid rgba(0, 210, 255, 0.2);
          color: var(--robotic-blue);
          font-weight: bold;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .dot {
          width: 8px;
          height: 8px;
          background: var(--success-green);
          border-radius: 50%;
          box-shadow: 0 0 10px var(--success-green);
          animation: blink 2s infinite;
        }

        .chatbot-messages {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .message {
          display: flex;
          gap: 10px;
          align-items: flex-end;
          max-width: 85%;
        }

        .message.user {
          align-self: flex-end;
          flex-direction: row-reverse;
        }

        .bot-icon {
          font-size: 20px;
        }

        .bubble {
          padding: 10px 15px;
          border-radius: 12px;
          font-size: 0.9rem;
          line-height: 1.4;
        }

        .message.bot .bubble {
          background: rgba(0, 210, 255, 0.1);
          color: #fff;
          border-top-left-radius: 2px;
          border: 1px solid rgba(0, 210, 255, 0.2);
        }

        .message.user .bubble {
          background: var(--robotic-blue);
          color: #000;
          border-bottom-right-radius: 2px;
          font-weight: 500;
        }

        .chatbot-input {
          padding: 15px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          gap: 10px;
        }

        .chatbot-input input {
          flex: 1;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 10px;
          border-radius: 4px;
          color: #fff;
          font-family: inherit;
        }

        .chatbot-input input:focus {
          outline: none;
          border-color: var(--robotic-blue);
        }

        .chatbot-input button {
          background: var(--robotic-blue);
          border: none;
          width: 40px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
        }

        .typing {
          animation: pulse 1s infinite;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
};

export default ChatBot;
