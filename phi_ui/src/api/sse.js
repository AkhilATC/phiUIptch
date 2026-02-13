let currentMessage = ""; // streaming buffer
let sessionData = null;

export async function startChatSSE(message, onMessage, onSession) {
  const token = localStorage.getItem("token");
  const sessionId = localStorage.getItem("x_session_id");

  const url = `http://0.0.0.0:5990/agent/urs-agent/chat?message=${encodeURIComponent(message)}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "text/event-stream",
      "x-session-id": sessionId || "",
    },

  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    buffer = lines.pop();

    let eventType = null;

    for (const line of lines) {
      if (line.startsWith("event:")) {
        eventType = line.replace("event:", "").trim();
      }

      if (line.startsWith("data:")) {
        const dataStr = line.replace("data:", "").trim();
        const data = JSON.parse(dataStr);

        // ✅ SESSION EVENT
        if (eventType === "session") {
          sessionData = data;
          localStorage.setItem("x_session_id", data.session_id);
          onSession?.(data);
        }

        // ✅ MESSAGE EVENT (STREAMING)
        if (eventType === "message") {
          currentMessage += data.text; // append token
          onMessage(currentMessage);   // update same bubble
        }

        // ✅ DONE EVENT
        if (eventType === "done") {
          console.log("Stream completed");
          currentMessage = ""; // reset for next question
        }
      }
    }
  }
}
