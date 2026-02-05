import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import './index.css';

// Register service worker for offline support - deferred to avoid blocking initial render
if ('serviceWorker' in navigator) {
  // Use requestIdleCallback if available, otherwise fall back to setTimeout
  const registerSW = () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
      })
      .catch(error => {
      });
  };

  if ('requestIdleCallback' in window) {
    requestIdleCallback(registerSW);
  } else {
    window.addEventListener('load', registerSW, { once: true });
  }
}

createRoot(document.getElementById("root")!).render(<App />);
