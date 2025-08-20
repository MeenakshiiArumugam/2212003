import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { logEvent } from "../utils/logger";

export default function RedirectHandler() {
  const { code } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const links = JSON.parse(localStorage.getItem("shortLinks") || "[]");
    const entry = links.find((l) => l.code === code);

    if (!entry) {
      alert("Invalid or expired link");
      navigate("/");
      return;
    }

    const now = new Date();
    if (new Date(entry.expiryAt) < now) {
      alert("This link has expired");
      navigate("/");
      return;
    }

    
    entry.clicks.push({
      timestamp: now.toISOString(),
      source: document.referrer || "Direct",
      geo: "India", 
    });

    
    const updated = links.map((l) => (l.code === code ? entry : l));
    localStorage.setItem("shortLinks", JSON.stringify(updated));

    logEvent("frontend", "info", "redirect", `Redirecting ${code} -> ${entry.longUrl}`);

    window.location.href = entry.longUrl;
  }, [code, navigate]);

  return <p>Redirecting...</p>;
}
