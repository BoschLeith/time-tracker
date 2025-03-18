import { BrowserRouter, Route, Routes } from "react-router";

import Clients from "./clients";
import Dashboard from "./dashboard";
import Layout from "./layout";
import TimeEntries from "./time-entries";
import Transactions from "./transactions";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="time-entries" element={<TimeEntries />} />
          <Route path="clients" element={<Clients />} />
          <Route path="transactions" element={<Transactions />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
