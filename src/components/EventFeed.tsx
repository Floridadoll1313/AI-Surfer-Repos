import React from "react";

export function EventFeed({ events }: any) {
  const color = (type: string) => {
    if (type === "success") return "green";
    if (type === "error") return "red";
    if (type === "ai") return "purple";
    return "blue";
  };

  return (
    <div style={{ padding: 10, background: "#0b0f1a", color: "white", height: "100%" }}>
      <h3>🌊 Live Wave Log</h3>

      {events.length === 0 && <p>No waves yet 🌊</p>}

      {events.map((e: any) => (
        <div key={e.id} style={{ borderBottom: "1px solid #222", padding: 6 }}>
          <div style={{ color: color(e.type), fontWeight: "bold" }}>
            {e.type.toUpperCase()}
          </div>
          <div>{e.message}</div>
          <small style={{ opacity: 0.6 }}>{e.time}</small>
        </div>
      ))}
    </div>
  );
}
