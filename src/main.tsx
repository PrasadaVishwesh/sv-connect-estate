import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { errorMonitor } from "./lib/errorMonitor";

// Initialize error monitoring
errorMonitor.init();

createRoot(document.getElementById("root")!).render(<App />);
