import { useState, useEffect, useCallback, useRef } from "react";

export interface AntiCheatEvent {
  type: "tab_switch" | "window_blur" | "no_face" | "multiple_faces" | "looking_away";
  timestamp: Date;
  message: string;
}

export function useAntiCheat(isActive: boolean) {
  const [events, setEvents] = useState<AntiCheatEvent[]>([]);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const warningTimeout = useRef<ReturnType<typeof setTimeout>>();

  const addEvent = useCallback((type: AntiCheatEvent["type"], message: string) => {
    setEvents((prev) => [...prev, { type, timestamp: new Date(), message }]);
    setWarningMessage(message);
    setShowWarning(true);
    if (warningTimeout.current) clearTimeout(warningTimeout.current);
    warningTimeout.current = setTimeout(() => setShowWarning(false), 4000);
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount((prev) => prev + 1);
        addEvent("tab_switch", "⚠️ Tab switch detected! Please stay on this page during the interview.");
      }
    };

    const handleBlur = () => {
      addEvent("window_blur", "⚠️ Window lost focus. Please keep the interview window active.");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      if (warningTimeout.current) clearTimeout(warningTimeout.current);
    };
  }, [isActive, addEvent]);

  return { events, tabSwitchCount, showWarning, warningMessage, addEvent };
}
