import { useState } from "react";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import UserForm from "../../components/users/UserForm";

export default function UsersPage() {

  const [openUserForm, setOpenUserForm] = useState(false);

  const handleAddUser = () => {
    setOpenUserForm(true);
  };

  const users = [
    {
      id: 1,
      name: "Nia.one",
      email: "admin@nia.one",
      role: "Super Admin",
    },
    {
      id: 2,
      name: "Operations Admin",
      email: "operations@nia.one",
      role: "Operations",
    },
    {
      id: 3,
      name: "Founder",
      email: "founder@nia.one",
      role: "Founder",
    },
    {
      id: 4,
      name: "Analytics",
      email: "analytics@nia.one",
      role: "Analytics",
    },
  ];

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold">
            User Management
          </h1>

          <p className="mt-1 text-slate-500">
            Manage admin users and their roles.
          </p>
        </div>

        <button
          onClick={handleAddUser}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-white hover:bg-blue-700 transition"
        >
          <Plus size={18} />
          Add User
        </button>

      </div>

      <div className="rounded-2xl bg-white p-5 shadow">

        <div className="mb-5 flex items-center gap-3">

          <Search size={18} />

          <input
            placeholder="Search user..."
            className="w-full rounded-xl border p-3"
          />

        </div>

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="py-3 text-left">Name</th>

              <th className="text-left">Email</th>

              <th className="text-left">Role</th>

              <th className="text-center">Actions</th>

            </tr>

          </thead>

          <tbody>

            {users.map((user) => (

              <tr
                key={user.id}
                className="border-b"
              >

                <td className="py-4">{user.name}</td>

                <td>{user.email}</td>

                <td>{user.role}</td>

                <td>

                  <div className="flex justify-center gap-4">

                    <button>
                      <Edit size={18} />
                    </button>

                    <button className="text-red-600">
                      <Trash2 size={18} />
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

            </div>

      <UserForm
        open={openUserForm}
        onClose={() => setOpenUserForm(false)}
      />

    </div>
  );
}