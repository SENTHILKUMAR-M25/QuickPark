import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { router } from "./routes";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(12px)",
            color: "#111827",
            borderRadius: "16px",
            border: "1px solid rgba(17,24,39,0.06)",
            boxShadow: "0 24px 60px -12px rgba(17,24,39,0.18)",
            fontWeight: 500,
          },
        }}
      />
    </AuthProvider>
  </React.StrictMode>
);