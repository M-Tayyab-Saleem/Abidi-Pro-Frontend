import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./context/ThemeContext";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./Store/index";
import { TimeLogProvider } from "./Pages/People/TimeLogContext"; // ✅ Make sure this path is correct

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <ThemeProvider>
        <Provider store={store}>
          <TimeLogProvider> {/* ✅ Add this */}
            <App />
          </TimeLogProvider>
        </Provider>
      </ThemeProvider>
    </Router>
  </React.StrictMode>
);
