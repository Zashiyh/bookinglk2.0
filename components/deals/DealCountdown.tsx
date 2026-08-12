"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

type Props = {
  endDate: string | Date;
};

export default function DealCountdown({ endDate }: Props) {
  const calculateRemaining = () => {
    const difference =
      new Date(endDate).getTime() - Date.now();

    if (difference <= 0) {
      return null;
    }

    return {
      days: Math.floor(
        difference / (1000 * 60 * 60 * 24)
      ),
      hours: Math.floor(
        (difference / (1000 * 60 * 60)) % 24
      ),
      minutes: Math.floor(
        (difference / (1000 * 60)) % 60
      ),
      seconds: Math.floor(
        (difference / 1000) % 60
      ),
    };
  };

  const [remaining, setRemaining] =
    useState(calculateRemaining());

  useEffect(() => {
    const timer = setInterval(() => {
      setRemaining(calculateRemaining());
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  if (!remaining) {
    return (
      <span className="text-xs font-medium text-red-400">
        Deal expired
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2 text-xs font-semibold text-white/70">
      <Clock size={14} className="text-yellow-400" />

      <span>
        {remaining.days}d{" "}
        {String(remaining.hours).padStart(2, "0")}h{" "}
        {String(remaining.minutes).padStart(2, "0")}m{" "}
        {String(remaining.seconds).padStart(2, "0")}s
      </span>
    </div>
  );
}