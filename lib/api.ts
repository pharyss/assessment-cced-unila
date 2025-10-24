export async function verifySsoToken(token: string) {
  const res = await fetch("https://asesmen-unila.test/api/auth/sso-verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  return await res.json();
}
