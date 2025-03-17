import { NavLink, Outlet } from "react-router";

export default function Layout() {
  return (
    <div className="container">
      <nav>
        <ul>
          <li>
            <strong>
              <NavLink to="/">TimeTracker</NavLink>
            </strong>
          </li>
        </ul>
        <ul>
          <li>
            <NavLink to="/clients">Clients</NavLink>
          </li>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
}
