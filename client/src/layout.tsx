import { Outlet, NavLink } from "react-router";

export default function Layout() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <button className="btn ml-auto">Add Entry</button>
        </div>
        <ul className="menu menu-horizontal bg-base-200 rounded-box space-x-2">
          <li>
            <NavLink
              to="/time-entries"
              className={({ isActive }) => (isActive ? "menu-active" : "")}
            >
              Time Entries
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/clients"
              className={({ isActive }) => (isActive ? "menu-active" : "")}
            >
              Clients
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/transactions"
              className={({ isActive }) => (isActive ? "menu-active" : "")}
            >
              Transactions
            </NavLink>
          </li>
        </ul>
        <Outlet />
      </main>
    </div>
  );
}
