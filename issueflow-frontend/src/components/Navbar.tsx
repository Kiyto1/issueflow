import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");

  if (!token) {
    return null;
  }

  function logout() {
    localStorage.clear();
    navigate("/login");
  }

  function isActive(path: string) {
    return location.pathname.startsWith(path);
  }

  const normalLink =
    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white";

  const activeLink =
    "flex items-center gap-3 rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-white";

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col justify-between border-r border-slate-800 bg-slate-950 px-4 py-6 text-white lg:flex">
      <div>
        <div className="mb-8 flex items-center gap-3 px-2">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 font-bold">
            IF
          </div>

          <div>
            <h1 className="font-semibold">IssueFlow</h1>
            <p className="text-xs text-slate-400">
              Helpdesk SaaS
            </p>
          </div>
        </div>

        <nav className="space-y-2">
          {role === "CUSTOMER" && (
            <>
              <Link
                to="/tickets"
                className={
                  isActive("/tickets") &&
                  !isActive("/tickets/new")
                    ? activeLink
                    : normalLink
                }
              >
                <span>▦</span>
                My Tickets
              </Link>

              <Link
                to="/tickets/new"
                className={
                  isActive("/tickets/new")
                    ? activeLink
                    : normalLink
                }
              >
                <span>＋</span>
                New Ticket
              </Link>
            </>
          )}

          {role === "AGENT" && (
            <Link
              to="/agent"
              className={
                isActive("/agent")
                  ? activeLink
                  : normalLink
              }
            >
              <span>▤</span>
              Department Queue
            </Link>
          )}

          {role === "ADMIN" && (
            <Link
              to="/admin"
              className={
                isActive("/admin")
                  ? activeLink
                  : normalLink
              }
            >
              <span>▦</span>
              Admin Dashboard
            </Link>
          )}
        </nav>
      </div>

      <div className="border-t border-slate-800 pt-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-slate-800 font-semibold">
            {name?.charAt(0).toUpperCase() ?? "U"}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              {name}
            </p>

            <p className="text-xs text-slate-400">
              {role}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full rounded-lg border border-slate-700 px-3 py-2 text-left text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}