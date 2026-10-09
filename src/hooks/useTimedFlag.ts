import { useEffect, useRef, useState } from "react";

export function useTimedFlag(duration = 1400) {
  const [flag, setFlag] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const trigger = () => {
    setFlag(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setFlag(false), duration);
  };

  return [flag, trigger] as const;
}
