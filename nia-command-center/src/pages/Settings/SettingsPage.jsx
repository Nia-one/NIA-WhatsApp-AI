import {
  Users,
  Shield,
  Settings as SettingsIcon,
  ClipboardList,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const cards = [
  {
    title: "Users",
    description: "Manage application users and role assignments.",
    icon: Users,
    path: "/settings/users",
    color: "bg-blue-500",
  },
  {
    title: "Roles & Permissions",
    description: "Configure role-based access for every module.",
    icon: Shield,
    path: "/settings/roles",
    color: "bg-green-500",
  },
  {
    title: "System Configuration",
    description: "Application configuration and master settings.",
    icon: SettingsIcon,
    path: "/settings/system",
    color: "bg-purple-500",
  },
  {
    title: "Audit Logs",
    description: "View user activity and system changes.",
    icon: ClipboardList,
    path: "/settings/audit",
    color: "bg-orange-500",
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-8 p-6">

      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Settings
        </h1>

        <p className="mt-2 text-slate-500">
          Configure users, permissions and system settings.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <Link
              key={card.title}
              to={card.path}
              className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-lg"
            >
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-white ${card.color}`}
              >
                <Icon size={24} />
              </div>

              <h2 className="text-lg font-semibold text-slate-800">
                {card.title}
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                {card.description}
              </p>

              <div className="mt-6 flex items-center text-blue-600">
                <span className="text-sm font-medium">
                  Open
                </span>

                <ChevronRight className="ml-2" size={18} />
              </div>
            </Link>
          );
        })}
      </div>

    </div>
  );
}