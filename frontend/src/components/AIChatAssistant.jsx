import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1/chat';

function AIChatAssistant() {
    const [messages, setMessages] = useState([
        { role: 'bot', content: 'Hello! I am your Green AI Assistant. Ask me anything about CO2 emissions or how to optimize your AI workloads!' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await axios.post(`${API_BASE_URL}/message`, {
                message: input,
                history: messages
            });

            const botMessage = { role: 'bot', content: response.data.response };
            setMessages(prev => [...prev, botMessage]);
        } catch (err) {
            console.error('Chat error:', err);
            setMessages(prev => [...prev, { role: 'bot', content: 'Sorry, I am having trouble connecting to my knowledge base right now.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card fade-in" style={{
            padding: '24px',
            marginBottom: '40px',
            border: '1px solid var(--accent-purple)',
            boxShadow: '0 0 20px rgba(102, 126, 234, 0.1)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{
                    width: '4px',
                    height: '24px',
                    background: 'var(--primary-gradient)',
                    borderRadius: '2px',
                    marginRight: '12px'
                }}></div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>💬 Green AI Assistant</h2>
            </div>

            <div style={{
                backgroundColor: 'rgba(0,0,0,0.2)',
                borderRadius: '12px',
                height: '350px',
                overflowY: 'auto',
                padding: '20px',
                marginBottom: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
            }}>
                {messages.map((msg, idx) => (
                    <div key={idx} style={{
                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '80%',
                        backgroundColor: msg.role === 'user' ? 'var(--accent-purple)' : 'rgba(255,255,255,0.08)',
                        color: '#fff',
                        padding: '12px 16px',
                        borderRadius: msg.role === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                        fontSize: '0.9rem',
                        lineHeight: 1.5,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                        {msg.content}
                    </div>
                ))}
                {loading && (
                    <div style={{ alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.08)', padding: '12px 16px', borderRadius: '16px 16px 16px 2px' }}>
                        <div className="spinner" style={{ width: '12px', height: '12px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} style={{ display: 'flex', gap: '12px' }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about AI sustainability..."
                    style={{
                        flex: 1,
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        padding: '12px 16px',
                        color: '#fff',
                        fontSize: '0.9rem'
                    }}
                />
                <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    style={{
                        background: 'var(--primary-gradient)',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '0 24px',
                        color: '#fff',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                    }}
                >
                    Send
                </button>
            </form>
        </div>
    );
}

export default AIChatAssistant;
