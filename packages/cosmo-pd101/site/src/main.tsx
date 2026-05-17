import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { initI18n } from "../../src/i18n";
import LivePage from "./LivePage";
import "./style.css";

initI18n();

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Root element not found");
createRoot(rootEl).render(
	<StrictMode>
		<LivePage />
	</StrictMode>,
);
