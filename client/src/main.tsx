import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// Service Worker per la Progressive Web App
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registrato con successo:', registration.scope);
      })
      .catch(error => {
        console.log('Registrazione ServiceWorker fallita:', error);
      });
  });
}
