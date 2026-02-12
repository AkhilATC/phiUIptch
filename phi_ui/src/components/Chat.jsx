import { useState } from "react";
import { startChatSSE } from "../api/sse";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  function sendMessage() {
    const userMsg = { role: "user", text: input };
    setMessages(prev => [...prev, userMsg]);

    startChatSSE(input, (data) => {
      setMessages(prev => [...prev, { role: "agent", text: data }]);
    });

    setInput("");
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>URS Agent Chat</h2>

      <div style={{ height: 300, border: "1px solid gray", padding: 10, overflowY: "auto" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ textAlign: m.role === "user" ? "right" : "left" }}>
            <b>{m.role}:</b> {m.text}
          </div>
        ))}
      </div>

      <input value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
