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
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Pages
import Landing from "./pages/landing/Landing";
import Register from "./pages/register/Register";
import Survey from "./pages/survey/Survey";
import NotFound from "./pages/404/NotFound";

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
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />}>
              {/* <Route path="/about" element={<About />} /> */}
              <Route path="/register" element={<Register />} />
              <Route path="/survey" element={<Survey />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </MantineProvider>
    </Provider>
  </React.StrictMode>
);
