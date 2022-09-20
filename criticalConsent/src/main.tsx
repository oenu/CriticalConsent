import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Redux
import { Provider } from "react-redux";
import { setupStore } from "./redux/store";
export const store = setupStore();

// Mantine
import { MantineProvider, GlobalStyles } from "@mantine/core";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <MantineProvider
        theme={{
          fontFamily: "Verdana, sans-serif",
          fontFamilyMonospace: "Monaco, Courier, monospace",
          headings: { fontFamily: "Greycliff CF, sans-serif" },
        }}
      >
        <App />
      </MantineProvider>
    </Provider>
  </React.StrictMode>
);
