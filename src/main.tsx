import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app.tsx";
import "./index.css";
import "@radix-ui/themes/styles.css";
import * as Toast from "@radix-ui/react-toast";
import { Theme } from "@radix-ui/themes";
import { HashRouter } from "react-router-dom";
import "@/css/toast.css";

// biome-ignore lint/style/noNonNullAssertion: <explanation>
ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<HashRouter>
			<Theme>
				<Toast.Provider swipeDirection="right">
					<App />
					<Toast.Viewport className="ToastViewport" />
				</Toast.Provider>
			</Theme>
		</HashRouter>
	</React.StrictMode>,
);

// Use contextBridge
window.ipcRenderer.on("main-process-message", (_event, message) => {
	console.log(message);
});
