import axios from "axios";

const LOG_URL = "http://20.244.56.144/evaluation-service/logs";

export async function logEvent(stack, level, pkg, message) {
  const logData = {
    stack,     
    level,     
    package: pkg, 
    message,   
  };

  try {
    const res = await axios.post(LOG_URL, logData, {
      headers: { "Content-Type": "application/json" },
    });
    console.log(`Logged to server: [${level}] ${message}`, res.data);
  } catch (err) {
    console.warn("Logging failed, saving locally:", err.message);

    const existingLogs = JSON.parse(localStorage.getItem("logs") || "[]");
    existingLogs.push(logData);
    localStorage.setItem("logs", JSON.stringify(existingLogs));

    console.log(`Saved log locally: [${level}] ${message}`);
  }
}
