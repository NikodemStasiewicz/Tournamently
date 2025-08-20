// app/admin/UsersTable.tsx
"use client";

import { User, Role } from "../admin/page";
import { useMemo, useState } from 'react';

interface UsersTableProps {
  users: User[];
  loading: boolean;
  handleRoleChange: (userId: string, newRole: Role) => void;
}

export default function UsersTable({ users, loading, handleRoleChange }: UsersTableProps) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(u =>
      u.username.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    );
  }, [users, query]);

  if (loading) return <p className="text-center text-gray-400">Ładowanie użytkowników...</p>;

  return (
    <div className="rounded-2xl border border-purple-700/40 bg-gray-900/60 backdrop-blur-sm shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4">
        <h3 className="text-lg font-semibold text-white">Użytkownicy</h3>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Szukaj po nazwie, mailu lub roli..."
          className="w-full md:w-80 rounded-lg bg-gray-800/80 border border-gray-700 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div className="overflow-auto">
        <table className="min-w-full divide-y divide-gray-700/60">
          <thead className="bg-gradient-to-r from-purple-900/70 to-gray-800/70 text-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Username</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Rola</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Akcje</th>
            </tr>
          </thead>
          <tbody className="bg-gray-900/60 divide-y divide-gray-800/60">
            {filtered.map((user, idx) => (
              <tr key={user.id} className={idx % 2 === 0 ? "bg-gray-900/40" : ""}>
                <td className="px-6 py-4 text-gray-200 font-medium">{user.username}</td>
                <td className="px-6 py-4 text-gray-300">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={
                    `inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ` +
                    (user.role === 'ADMIN' ? 'bg-red-900/40 text-red-300 border border-red-700/40' :
                    user.role === 'ORGANIZER' ? 'bg-blue-900/30 text-blue-300 border border-blue-700/40' :
                    'bg-gray-700/40 text-gray-300 border border-gray-600/40')
                  }>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {(["PLAYER", "ORGANIZER", "ADMIN"] as Role[])
                      .filter((r) => r !== user.role)
                      .map((role) => (
                        <button
                          key={role}
                          className="px-3 py-1 rounded-md text-xs font-medium text-white border border-purple-600/50 bg-purple-600/60 hover:bg-purple-600 transition-colors"
                          onClick={() => handleRoleChange(user.id, role)}
                        >
                          Ustaw {role}
                        </button>
                      ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
