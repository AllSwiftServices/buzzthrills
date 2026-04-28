"use client";

import { useEffect } from "react";

export default function ServiceWorkerUnregister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for (let i = 0; i < registrations.length; i++) {
          registrations[i].unregister();
        }
      });
    }
  }, []);

  return null;
}
