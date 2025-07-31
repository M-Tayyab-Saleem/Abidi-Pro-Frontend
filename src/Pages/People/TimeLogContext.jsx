import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkInNow, checkOutNow } from "../../api/attendanceTimer";

const TimeLogContext = createContext();
export const useTimeLog = () => useContext(TimeLogContext);

export function TimeLogProvider({ children }) {
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef(null); // ✅ store interval id
  const dispatch = useDispatch();
  const data = useSelector((state) => state);
  const { user } = data?.auth;

  const { checkInn, checkOut: checkout, loading, error } = data?.attendanceTimer;

  const checkInTime = checkInn?.log?.checkInTime || null;
  const start = checkInTime ? new Date(checkInTime).getTime() : null;

  useEffect(() => {
    if (!start) return;

    intervalRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - start) / 1000));
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [start]);

  const checkIn = () => {
    if (!start) {
      dispatch(checkInNow(user?.id));
    }
  };

  // const checkOut = () => {
  //   if (start && checkInn) {
  //     dispatch(checkOutNow(user?.id));
  //     clearInterval(intervalRef.current); // ✅ stop ticking
  //     setElapsed(0); // ✅ reset timer immediately
  //   }
  // };
const checkOut = () => {
  if (start && checkInn) {
    dispatch(checkOutNow(user?.id)); // Ensure user.id is passed correctly
    clearInterval(intervalRef.current);
    setElapsed(0);
  }
};


  return (
    <TimeLogContext.Provider
      value={{ start, elapsed, checkIn, checkOut, loading, error }}
    >
      {children}
    </TimeLogContext.Provider>
  );
}
