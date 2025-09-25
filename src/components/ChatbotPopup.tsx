import React, { useState, useRef, useEffect } from 'react';


const popupStyle = {
  position: 'fixed',
  bottom: '24px',
  right: '24px',
  width: '320px',
  maxHeight: '400px',
  background: '#fff',
  border: '1px solid #ccc',
  borderRadius: '12px',
  boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
  zIndex: 1000,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
};

const headerStyle = {
  background: '#0078d4',
  color: '#fff',
  padding: '10px',
  fontWeight: 'bold',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const chatBodyStyle = {
  flex: 1,
  padding: '10px',
  overflowY: 'auto',
  background: '#f9f9f9',
};

const inputAreaStyle = {
  display: 'flex',
  borderTop: '1px solid #eee',
  padding: '8px',
  background: '#fff',
};

const buttonStyle = {
  position: 'fixed',
  bottom: '24px',
  right: '24px',
  zIndex: 999,
  background: '#0078d4',
  color: '#fff',
  border: 'none',
  borderRadius: '50%',
  width: '56px',
  height: '56px',
  fontSize: '28px',
  cursor: 'pointer',
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
};

const ChatbotPopup = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! How can I help you today?' },
  ]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (open && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const handleSend = (e?: any) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { sender: 'user', text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput('');
    // Mock backend response
    setTimeout(() => {
      setMessages((msgs) => [
        ...msgs,
        { sender: 'bot', text: 'Bot will reply here (backend integration pending)...' },
      ]);
    }, 700);
  };

  if (!open) {
    return (
      <button style={buttonStyle} onClick={() => setOpen(true)} title="Open Chatbot">
        💬
      </button>
    );
  }

  return (
    <div style={popupStyle}>
      <div style={headerStyle}>
        Chatbot
        <button
          style={{ background: 'none', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer' }}
          onClick={() => setOpen(false)}
          title="Close"
        >
          ×
        </button>
      </div>
      <div style={chatBodyStyle}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              margin: '6px 0',              textAlign: msg.sender === 'user' ? 'right' : 'left',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                background: msg.sender === 'user' ? '#daf1fc' : '#e6e6e6',
                color: '#222',
                borderRadius: '12px',
                padding: '7px 12px',
                maxWidth: '80%',
                wordBreak: 'break-word',
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <form style={inputAreaStyle} onSubmit={handleSend}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #ccc', marginRight: '8px' }}
        />
        <button
          type="submit"
          style={{ background: '#0078d4', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer' }}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatbotPopup;
