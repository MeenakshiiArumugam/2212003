import React, { useState } from "react";
import { logEvent } from "../utils/logger";
import "./ShortenerPage.css";

export default function ShortenerPage() {
  const [urls, setUrls] = useState([{ longUrl: "", validity: "", shortcode: "" }]);
  const [results, setResults] = useState([]);

  const handleAddUrl = () => {
    if (urls.length < 5) setUrls([...urls, { longUrl: "", validity: "", shortcode: "" }]);
  };

  const handleChange = (i, field, value) => {
    const updated = [...urls];
    updated[i][field] = value;
    setUrls(updated);
  };

  const handleShorten = () => {
    const newResults = [];

    urls.forEach(({ longUrl, validity, shortcode }) => {
      if (!longUrl.startsWith("http")) {
        logEvent("frontend", "warn", "validation", `Invalid URL: ${longUrl}`);
        return;
      }

      const code = shortcode || Math.random().toString(36).substring(2, 8);
      const createdAt = new Date();
      const expiryMins = validity ? parseInt(validity) : 30;
      const expiryAt = new Date(createdAt.getTime() + expiryMins * 60000);

      const shortUrl = `${window.location.origin}/r/${code}`;

      const entry = {
        code,
        longUrl,
        shortUrl,
        createdAt: createdAt.toISOString(),
        expiryAt: expiryAt.toISOString(),
        clicks: [],
      };

      const existing = JSON.parse(localStorage.getItem("shortLinks") || "[]");
      localStorage.setItem("shortLinks", JSON.stringify([...existing, entry]));

      logEvent("frontend", "info", "shorten", `Created short URL: ${shortUrl}`);

      newResults.push(entry);
    });

    setResults(newResults);
  };

  return (
    <div className="page">
      <div className="card">
        <h1 className="title">URL Shortener</h1>

        {urls.map((u, i) => (
          <div key={i} className="input-row">
            <input
              value={u.longUrl}
              onChange={(e) => handleChange(i, "longUrl", e.target.value)}
              placeholder="Enter URL (http://...)"
              className="input flex"
            />
            <input
              value={u.validity}
              onChange={(e) => handleChange(i, "validity", e.target.value)}
              placeholder="Validity (mins)"
              className="input small"
            />
            <input
              value={u.shortcode}
              onChange={(e) => handleChange(i, "shortcode", e.target.value)}
              placeholder="Custom code"
              className="input small"
            />
          </div>
        ))}

        <div className="actions">
          <button onClick={handleAddUrl} className="btn secondary">
            + Add More
          </button>
          <button onClick={handleShorten} className="btn primary">
            Shorten All
          </button>
          <a href="/stats" className="btn link">View Stats</a>
        </div>

        <div className="results">
          {results.map((r, i) => (
            <div key={i} className="result">
              <p>
                Shortened URL:{" "}
                <a href={r.shortUrl} className="short-link">
                  {r.shortUrl}
                </a>
              </p>
              <p className="expiry">Expiry: {new Date(r.expiryAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
