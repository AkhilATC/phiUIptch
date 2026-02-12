import { useState } from "react";
import ChatWindow from "./ChatWindow";

export default function PhiBubble() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Chat Window */}
      {open && <ChatWindow onClose={() => setOpen(false)} />}

      {/* Floating Bubble */}
      <div
        onClick={() => setOpen(!open)}
        style={styles.bubble}
        title="Phi AI"
      >
        🧠
      </div>
    </>
  );
}

const styles = {
  bubble: {
    position: "fixed",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: "50%",
    background: "#4f46e5",
    color: "white",
    fontSize: 28,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
    transition: "0.2s",
  },
};
