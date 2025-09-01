export function NotFound({url}: {url?: string}) {
  return (
    <div style={{ width: "42em", margin: "40px auto 0" }}>
      <h1>404 Not Found</h1>
      <p>The <a href={url} target="_blank">page</a> you are looking for does not exist.</p>
      <a href="/">Go to Home</a> ▸
    </div>
  );
}
