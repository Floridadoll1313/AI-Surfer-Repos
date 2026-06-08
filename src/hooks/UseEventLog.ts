import { useState } from "react";

export type EventType = "info" | "success" | "error" | "ai";

export type LogEvent = {
  id: number;
  type: EventType;
  message: string;
  time: string;
};

export function useEventLog() {
  const [events, setEvents] = useState<LogEvent[]>([]);

  const addEvent = (type: EventType, message: string) => {
    setEvents((prev) => [
      {
        id: Date.now(),
        type,
        message,
        time: new Date().toLocaleTimeString(),
      },
      ...prev,
    ]);
  };

  const clearEvents = () => setEvents([]);

  return { events, addEvent, clearEvents };
}
