import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

import App from "./app.tsx";
import Clients from "./clients.tsx";
import CreateClient from "./create-client.tsx";
import EditClient from "./edit-client.tsx";
import Layout from "./layout.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index path="/" element={<App />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/clients/create" element={<CreateClient />} />
          <Route path="/clients/edit/:id" element={<EditClient />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
