import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

import App from "./app.tsx";
import Clients from "./clients.tsx";
import Layout from "./layout.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index path="/" element={<App />} />
          <Route path="/clients" element={<Clients />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
