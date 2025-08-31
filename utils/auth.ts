export function basicAuth(req: Request, user: string, pass: string): Response | null {
  const auth = req.headers.get("authorization");
  console.info("Auth:", auth);
  if (!auth) {
    return new Response("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Secure Area"' },
    });
  }
  const [scheme, encoded] = auth.split(" ");
  if (scheme !== "Basic") return new Response("Bad Request", { status: 400 });

  const [username, password] = atob(encoded).split(":");
  if (username !== user || password !== pass) {
    return new Response("Forbidden", { status: 403 });
  }
  return null;
}
