"use client";

import { useEffect } from "react";

export default function ServiceWorkerPurge() {
  useEffect(() => {
    const url = new URL(window.location.href);
    const shouldPurge = url.searchParams.has("purge");

    if (!shouldPurge) return;

    (async () => {
      try {
        if ("serviceWorker" in navigator) {
          const regs = await navigator.serviceWorker.getRegistrations();
          await Promise.all(regs.map((r) => r.unregister()));
        }

        if ("caches" in window) {
          const keys = await caches.keys();
          await Promise.all(keys.map((k) => caches.delete(k)));
        }

        // Remove purge param to avoid loops, then reload
        url.searchParams.delete("purge");
        window.location.replace(url.toString());
      } catch {
        // Worst case: still try to reload without the param
        url.searchParams.delete("purge");
        window.location.replace(url.toString());
      }
    })();
  }, []);

  return null;
}
