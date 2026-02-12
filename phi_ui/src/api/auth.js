export async function login(username, password) {
  const res = await fetch("http://0.0.0.0:5990/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) throw new Error("Login failed");

  return res.json(); // expected { access_token: "xxx" }
}
