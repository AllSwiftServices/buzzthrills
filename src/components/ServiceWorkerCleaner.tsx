"use client";

import { useEffect } from "react";

export function ServiceWorkerCleaner() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for (let registration of registrations) {
          registration.unregister();
        }
      });
    }
  }, []);

  return null;
}
