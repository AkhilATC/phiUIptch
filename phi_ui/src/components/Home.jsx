import { useState } from "react";
import PhiBubble from "./PhiBubble";
import URSRegistry from "./URSRegistery";

export default function Home() {
  const [tab, setTab] = useState("registry");

  function logout() {
    localStorage.removeItem("token");
    window.location.reload();
  }

  return (
    <div style={styles.container}>
      {/* Top Navbar */}
      <div style={styles.navbar}>
        <div style={styles.logo}>Φ Phi Platform</div>

        <div style={styles.tabs}>
          <button
            style={tab === "registry" ? styles.activeTab : styles.tab}
            onClick={() => setTab("registry")}
          >
            URS Registry
          </button>
        </div>

        <button onClick={logout} style={styles.logout}>Logout</button>
      </div>

      {/* Page Content */}
      <div style={styles.content}>
        {tab === "registry" && <URSRegistry />}
      </div>

      {/* Floating Chat Bubble */}
      <PhiBubble />
    </div>
  );
}

const styles = {
  container: { height: "100vh", background: "#f9fafb" },
  navbar: {
    height: 60,
    background: "white",
    borderBottom: "1px solid #ddd",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
  },
  logo: { fontWeight: "bold", fontSize: 18 },
  tabs: { display: "flex", gap: 10 },
  tab: {
    padding: "8px 14px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
  },
  activeTab: {
    padding: "8px 14px",
    borderRadius: 6,
    border: "none",
    background: "#4f46e5",
    color: "white",
  },
  logout: {
    padding: "6px 12px",
    background: "#ef4444",
    border: "none",
    color: "white",
    borderRadius: 6,
    cursor: "pointer",
  },
  content: { padding: 20 },
};
