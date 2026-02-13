import { useState, useRef, useEffect } from "react";
import { startChatSSE } from "../api/sse";

export default function ChatWindow({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const chatRef = useRef(null);

  function sendMessage() {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setIsStreaming(true);

    startChatSSE(input, (text) => {
      setMessages(prev => {
        const last = prev[prev.length - 1];

        if (last && last.role === "agent") {
          return [...prev.slice(0, -1), { ...last, text }];
        }

        return [...prev, { role: "agent", text }];
      });
    }, () => {
      setIsStreaming(false);
    });

    setInput("");
  }

  // Auto scroll
  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages]);

  return (
    <div style={styles.window}>
      {/* Header */}
      <div style={styles.header}>
        🧠 Phi Agent
        <button onClick={onClose} style={styles.close}>✕</button>
      </div>

      {/* Messages */}
      <div ref={chatRef} style={styles.messages}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              ...styles.msgBubble,
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              background: m.role === "user" ? "#4f46e5" : "#f3f4f6",
              color: m.role === "user" ? "white" : "black",
            }}
          >
            {m.text}

            {/* Typing Cursor */}
            {isStreaming && i === messages.length - 1 && m.role === "agent" && (
              <span className="cursor">▌</span>
            )}
          </div>
        ))}
      </div>

      {/* Input */}
      <div style={styles.inputBox}>
        <input
          style={styles.input}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder="Ask Phi..."
        />
        <button style={styles.sendBtn} onClick={sendMessage}>➤</button>
      </div>

      {/* Cursor CSS */}
      <style>{`
        .cursor {
          margin-left: 2px;
          animation: blink 1s step-start infinite;
          font-weight: bold;
        }

        @keyframes blink {
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

const styles = {
  window: {
    position: "fixed",
    bottom: 90,
    right: 20,
    width: 350,
    height: 450,
    background: "white",
    borderRadius: 12,
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  header: {
    padding: 12,
    background: "#4f46e5",
    color: "white",
    fontWeight: "bold",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  close: {
    background: "transparent",
    border: "none",
    color: "white",
    fontSize: 16,
    cursor: "pointer",
  },
  messages: {
    flex: 1,
    padding: 10,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    overflowY: "auto",
    background: "#fafafa",
  },
  msgBubble: {
    maxWidth: "75%",
    padding: "8px 12px",
    borderRadius: 16,
    fontSize: 14,
    lineHeight: 1.4,
    transition: "all 0.1s ease-out",
  },
  inputBox: {
    display: "flex",
    padding: 8,
    borderTop: "1px solid #ddd",
  },
  input: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
    border: "1px solid #ccc",
  },
  sendBtn: {
    marginLeft: 8,
    padding: "8px 12px",
    borderRadius: 8,
    border: "none",
    background: "#4f46e5",
    color: "white",
    cursor: "pointer",
  },
};
