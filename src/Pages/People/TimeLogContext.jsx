import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkInNow, checkOutNow } from "../../slices/attendanceTimer";
import { toast } from "react-toastify";
import api from "../../axios";

const TimeLogContext = createContext();
export const useTimeLog = () => useContext(TimeLogContext);

export function TimeLogProvider({ children }) {
  const [elapsed, setElapsed] = useState(0);
  const [localStart, setLocalStart] = useState(null);
  const intervalRef = useRef(null);
  const dispatch = useDispatch();
  const data = useSelector((state) => state);
  const { user } = data?.auth;
  const userId = user?.id;

  const { checkInn, checkOut: checkout, loading, error } = data?.attendanceTimer;

  const start = localStart;

  useEffect(() => {
    const fetchTodayLog = async () => {
      if (!userId) return;
      try {
        const response = await api.get(`/timetrackers/daily-log/${userId}`);
        if (response.data && response.data.checkInTime && !response.data.checkOutTime) {
          setLocalStart(new Date(response.data.checkInTime).getTime());
        }
      } catch (error) {
        console.log("No active check-in session found");
      }
    };
    fetchTodayLog();
  }, [userId]);

  useEffect(() => {
    if (!start) {
      clearInterval(intervalRef.current);
      setElapsed(0);
      return;
    }

    intervalRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - start) / 1000));
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [start]);

  const checkIn = () => {
    if (!start) {
      dispatch(checkInNow());
    }
  };

  const checkOut = () => {
    if (start) {
      dispatch(checkOutNow());
    }
  };

  useEffect(() => {
    if (checkInn?.log?.checkInTime) {
      setLocalStart(new Date(checkInn.log.checkInTime).getTime());
      if (checkInn.message) {
        toast.success(checkInn.message);
      }
    }
  }, [checkInn]);

  useEffect(() => {
    if (checkout) {
      setLocalStart(null);
      setElapsed(0);
      clearInterval(intervalRef.current);
      if (checkout.message) {
        toast.success(checkout.message);
      }
    }
  }, [checkout]);

  const checkForOpenSessions = async () => {
    try {
      const response = await api.get('/timetrackers/open-sessions');
      if (response.data.hasOpenSessions) {
        toast.warning("You have open sessions from previous days. They will be auto-closed when you check out today.");
      }
    } catch (error) {
      console.error("Error checking for open sessions:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      checkForOpenSessions();
    }
  }, [userId]);

  return (
    <TimeLogContext.Provider
      value={{ start, elapsed, checkIn, checkOut, loading, error }}
    >
      {children}
    </TimeLogContext.Provider>
  );
}