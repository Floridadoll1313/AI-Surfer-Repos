import { useState } from "react";

export type EventType =
  | "info"
  | "success"
  | "error"
  | "ai"
  | "stripe"
  | "user";

export type LogEvent = {
  id: number;
  type: EventType;
  message: string;
  meta?: any;
  time: string;
};

export function useEventLog() {
  const [events, setEvents] = useState<LogEvent[]>([]);

  const addEvent = (type: EventType, message: string, meta?: any) => {
    setEvents((prev) => [
      {
        id: Date.now(),
        type,
        message,
        meta,
        time: new Date().toLocaleTimeString(),
      },
      ...prev,
    ]);
  };

  return { events, addEvent };
}
