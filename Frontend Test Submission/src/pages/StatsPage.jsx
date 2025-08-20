import React, { useEffect, useState } from "react";

export default function StatsPage() {
  const [links, setLinks] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("shortLinks") || "[]");
    setLinks(stored);
  }, []);

  return (
    <div className="stats-container">
      <style>{`
        .stats-container {
          max-width: 700px;
          margin: 30px auto;
          padding: 20px;
          background: #f0f8ff;
          border-radius: 8px;
          font-family: Arial, sans-serif;
        }
        .stats-title {
          text-align: center;
          margin-bottom: 20px;
          color: #003366;
        }
        .back-btn {
          display: block;
          margin: 0 auto 20px auto;
          padding: 8px 16px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        .back-btn:hover {
          background: #0056b3;
        }
        .stats-card {
          background: #ffffff;
          border: 1px solid #cce7ff;
          padding: 15px;
          margin-bottom: 15px;
          border-radius: 6px;
        }
        .short-link {
          color: #007bff;
          text-decoration: none;
        }
        .short-link:hover {
          text-decoration: underline;
        }
        .empty-msg {
          text-align: center;
          color: #555;
        }
        ul {
          margin-top: 8px;
        }
      `}</style>

      <h1 className="stats-title">Shortener Statistics</h1>

      <button className="back-btn" onClick={() => (window.location.href = "/")}>
        ← Go to URL Shortener
      </button>

      {links.length === 0 ? (
        <p className="empty-msg">No shortened URLs yet.</p>
      ) : (
        links.map((l, i) => (
          <div key={i} className="stats-card">
            <p>
              <b>Short URL:</b>{" "}
              <a href={l.shortUrl} className="short-link" target="_blank" rel="noreferrer">
                {l.shortUrl}
              </a>
            </p>
            <p><b>Original:</b> {l.longUrl}</p>
            <p><b>Created At:</b> {new Date(l.createdAt).toLocaleString()}</p>
            <p><b>Expiry At:</b> {new Date(l.expiryAt).toLocaleString()}</p>
            <p><b>Clicks:</b> {l.clicks.length}</p>

            {l.clicks.length > 0 && (
              <div>
                <p><b>Click Details:</b></p>
                <ul>
                  {l.clicks.map((c, j) => (
                    <li key={j}>
                      {new Date(c.timestamp).toLocaleString()} — Source: {c.source} — Geo: {c.geo}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
