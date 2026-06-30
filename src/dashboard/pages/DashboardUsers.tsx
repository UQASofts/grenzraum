import { Trash2, UserX, UserCheck } from "lucide-react";
import { useData } from "../../context/DataContext";

export default function DashboardUsers() {
  const { users, deleteUser, toggleUserStatus } = useData();

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete user "${name}"? This cannot be undone.`)) {
      deleteUser(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">User Management</h2>
          <p className="text-sm text-slate-500">
            Manage registered hikers and admin accounts.
          </p>
        </div>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          {users.filter((u) => u.status === "active").length} active users
        </span>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Joined</th>
                <th className="px-6 py-3">Stamps</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                        {user.name.charAt(0)}
                      </div>
                      <span className="font-medium text-slate-900">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${
                        user.role === "admin"
                          ? "bg-purple-50 text-purple-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                        user.status === "active"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          user.status === "active" ? "bg-emerald-500" : "bg-slate-400"
                        }`}
                      />
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{user.joinedAt}</td>
                  <td className="px-6 py-4 font-mono text-slate-700">
                    {user.stampsCollected}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      {user.role !== "admin" && (
                        <>
                          <button
                            type="button"
                            onClick={() => toggleUserStatus(user.id)}
                            className={`rounded-lg border p-2 transition-colors ${
                              user.status === "active"
                                ? "border-amber-200 text-amber-600 hover:bg-amber-50"
                                : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                            }`}
                            title={user.status === "active" ? "Deactivate" : "Activate"}
                          >
                            {user.status === "active" ? (
                              <UserX className="h-4 w-4" />
                            ) : (
                              <UserCheck className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(user.id, user.name)}
                            className="rounded-lg border border-rose-200 p-2 text-rose-500 hover:bg-rose-50"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
