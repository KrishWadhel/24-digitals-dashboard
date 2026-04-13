"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function NotificationProvider({ children }) {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) return;

    if (Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission();
    }

    const checkInterval = () => {
      const checkIn = localStorage.getItem("checkInTime");
      if (!checkIn) return; // No notifications if haven't checked in
      
      const now = new Date();
      const lastLog = localStorage.getItem("lastLogTime") || checkIn;
      
      // Calculate diff in hours
      const diffMs = now.getTime() - new Date(lastLog).getTime();
      const diffHours = diffMs / (1000 * 60 * 60);

      // Trigger every 2 hours for work logging
      if (diffHours >= 2) {
         if (Notification.permission === "granted") {
           const notification = new Notification("Time to log your work!", {
             body: "2 hours have passed! Click here to document your timeline activity.",
             icon: "/favicon.ico"
           });
           notification.onclick = () => {
             window.focus();
             window.location.href = "/timeline";
           };
           localStorage.setItem("lastLogTime", now.toISOString());
         }
      }

      // Trigger at 9-hour mark for Shift Completion
      const shiftDiffHours = (now.getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60);
      if (shiftDiffHours >= 9 && !localStorage.getItem("shiftCompleteNotified")) {
        if (Notification.permission === "granted") {
          const shiftNotification = new Notification("9-Hour Duty Completed!", {
            body: "Your shift is over. Please submit your final task and Daily Report.",
            icon: "/favicon.ico"
          });
          shiftNotification.onclick = () => {
            window.focus();
            window.location.href = "/timeline";
          };
          localStorage.setItem("shiftCompleteNotified", "true");
        }
      }
    };

    const intervalId = setInterval(checkInterval, 60000); // Check every minute
    return () => clearInterval(intervalId);
  }, [session]);

  return (
    <>
      {children}
    </>
  );
}
