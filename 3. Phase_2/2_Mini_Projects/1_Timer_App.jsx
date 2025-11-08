// 🧭 PROJECT 1 — TIMER APP
// ---------------------------------------------------------
// Goal: Build a digital timer that starts, pauses, and resets.
// We'll use useState() for tracking time, and useEffect() for interval logic.
// Cleanup will be demonstrated to prevent memory leaks.

import React, { useState, useEffect } from "react";

function TimerApp() {
  const [seconds, setSeconds] = useState(0); // state for time
  const [isRunning, setIsRunning] = useState(false); // controls timer state

  useEffect(() => {
    let interval;

    if (isRunning) {
      // start interval when running
      interval = setInterval(() => {
        setSeconds(prev => prev + 1); // increase seconds
      }, 1000);
    }

    // Cleanup function: stops interval when component unmounts or when paused
    return () => clearInterval(interval);
  }, [isRunning]);

  const reset = () => setSeconds(0);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>⏱️ Timer: {seconds}s</h1>
      <button onClick={() => setIsRunning(true)}>Start</button>
      <button onClick={() => setIsRunning(false)}>Pause</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

export default TimerApp;

// 🔍 Professional Notes:
// - Cleanup prevents duplicate intervals.
// - useEffect dependency ensures interval only runs when "isRunning" changes.
// - setInterval runs asynchronously; so always handle cleanup properly.
