import { Bell, Search, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("nia_user") || "{}"
  );

  const handleLogout = () => {
    localStorage.removeItem("nia_token");
    localStorage.removeItem("nia_user");
    navigate("/login");
  };

  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8">
      {/* Left Section */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Good Morning 👋
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Welcome to Nia.one Command Center
        </p>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-5">
        <button className="rounded-xl p-2 transition hover:bg-slate-100">
          <RefreshCw size={20} />
        </button>

        <button className="rounded-xl p-2 transition hover:bg-slate-100">
          <Search size={20} />
        </button>

        <button className="relative rounded-xl p-2 transition hover:bg-slate-100">
          <Bell size={20} />
          <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-red-500"></span>
        </button>

        <div className="flex items-center gap-3 rounded-xl bg-slate-100 px-3 py-2">
          {/* User Avatar */}
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
            {user?.name?.trim()?.charAt(0)?.toUpperCase() || "U"}
          </div>

          {/* User Info */}
          <div>
            <p className="font-medium text-slate-900">
              {user?.name || "User"}
            </p>

            <p className="text-xs text-slate-500">
  {(user?.role || "").replace("_", " ").replace(/\b\w/g, c => c.toUpperCase())}
</p>

<p className="text-xs text-slate-400">
  {user?.email || ""}
</p>

            <button
              onClick={handleLogout}
              className="mt-1 text-xs text-red-500 hover:underline"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}