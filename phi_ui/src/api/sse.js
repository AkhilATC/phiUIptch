export async function startChatSSE(message, onMessage) {
  const token = localStorage.getItem("token");

  const url = `http://0.0.0.0:5990/agent/urs-agent/chat?message=${encodeURIComponent(message)}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Accept": "text/event-stream",
    },
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");

  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    // Parse SSE chunks
    const events = buffer.split("\n\n");
    buffer = events.pop(); // keep incomplete chunk

    for (const event of events) {
      if (event.startsWith("data:")) {
        const data = event.replace("data:", "").trim();
        try {
          const json = JSON.parse(data);
          onMessage(json.text || JSON.stringify(json));
        } catch {
          onMessage(data);
        }
      }
    }
  }
}
