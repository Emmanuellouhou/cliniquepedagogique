import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

/* Journalisation globale : les erreurs hors rendu React ne doivent jamais passer inaperçues */
window.addEventListener("error", (e) => {
  console.error("[Clinique d'Éducation] Erreur globale :", e.error ?? e.message);
});
window.addEventListener("unhandledrejection", (e) => {
  console.error("[Clinique d'Éducation] Promise rejetée :", e.reason);
});

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
