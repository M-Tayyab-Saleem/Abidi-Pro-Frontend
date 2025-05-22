// src/context/TimeLogContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const TimeLogContext = createContext();
export const useTimeLog = () => useContext(TimeLogContext);

export function TimeLogProvider({ children }) {
  const [start, setStart] = useState(null);   // ms timestamp when clocked‑in
  const [elapsed, setElapsed] = useState(0);  // seconds since start

  /* tick every second only when clocked in */
  useEffect(() => {
    if (!start) return;
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - start) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [start]);

  /* public API */
  const checkIn = () => setStart(Date.now());
  const checkOut = () => {
    setStart(null);
    setElapsed(0);
    // ⬇️  save to backend here if desired
  };

  return (
    <TimeLogContext.Provider value={{ start, elapsed, checkIn, checkOut }}>
      {children}
    </TimeLogContext.Provider>
  );
}
