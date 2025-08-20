// "use client";

// import { useEffect, useState } from "react";

// type Role = "PLAYER" | "ORGANIZER" | "ADMIN";

// interface User {
//   id: string;
//   username: string;
//   email: string;
//   role: Role;
// }

// export default function AdminPanel() {
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);

//   const fetchUsers = async () => {
//     setLoading(true);
//     const res = await fetch("/api/admin/users");
//     const data = await res.json();
//     setUsers(data.users);
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const handleRoleChange = async (userId: string, newRole: Role) => {
//     await fetch(`/api/admin/users/${userId}`, {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ role: newRole }),
//     });

//     setUsers((prev) =>
//       prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
//     );
//   };

//   return (
//     <div className="p-6 bg-gray-900 min-h-screen">
//       <h1 className="text-4xl font-bold mb-8 text-center text-purple-400 drop-shadow-lg">
//         Panel Admina
//       </h1>

//       {loading ? (
//         <p className="text-center text-gray-400">Ładowanie użytkowników...</p>
//       ) : (
//         <div className="overflow-auto rounded-lg border border-purple-700 shadow-xl">
//           <table className="min-w-full divide-y divide-gray-700">
//             <thead className="bg-gradient-to-r from-purple-900 to-gray-800 text-gray-200">
//               <tr>
//                 <th className="px-6 py-3 text-left text-sm font-bold uppercase">Username</th>
//                 <th className="px-6 py-3 text-left text-sm font-bold uppercase">Email</th>
//                 <th className="px-6 py-3 text-left text-sm font-bold uppercase">Rola</th>
//                 <th className="px-6 py-3 text-left text-sm font-bold uppercase">Akcje</th>
//               </tr>
//             </thead>
//             <tbody className="bg-gray-900 divide-y divide-gray-700">
//               {users.map((user, idx) => (
//                 <tr key={user.id} className={idx % 2 === 0 ? "bg-gray-800" : ""}>
//                   <td className="px-6 py-4 text-gray-300">{user.username}</td>
//                   <td className="px-6 py-4 text-gray-300">{user.email}</td>
//                   <td className="px-6 py-4 text-purple-400 font-semibold">{user.role}</td>
//                   <td className="px-6 py-4 flex gap-2">
//                     {(["PLAYER", "ORGANIZER", "ADMIN"] as Role[])
//                       .filter((r) => r !== user.role)
//                       .map((role) => (
//                         <button
//                           key={role}
//                           className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-md text-sm transition-colors"
//                           onClick={() => handleRoleChange(user.id, role)}
//                         >
//                           {role}
//                         </button>
//                       ))}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   BarChart,
//   Bar,
//   ResponsiveContainer,
// } from 'recharts';

// type Role = "PLAYER" | "ORGANIZER" | "ADMIN";

// interface User {
//   id: string;
//   username: string;
//   email: string;
//   role: Role;
// }

// interface Stats {
//   users: number;
//   teams: number;
//   tournaments: number;
//   matches: number;
// }

// export default function AdminPanel() {
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState<Stats | null>(null);
//   const [activeTab, setActiveTab] = useState<"stats" | "users">("stats");

//   // Pobranie użytkowników
//   const fetchUsers = async () => {
//     setLoading(true);
//     const res = await fetch("/api/admin/users");
//     const data = await res.json();
//     setUsers(data.users);
//     setLoading(false);
//   };

//   // Pobranie statystyk
//   const fetchStats = async () => {
//     const res = await fetch("/api/admin/stats");
//     const data = await res.json();
//     setStats(data);
//   };

//   useEffect(() => {
//     fetchUsers();
//     fetchStats();
//   }, []);

//   const handleRoleChange = async (userId: string, newRole: Role) => {
//     await fetch(`/api/admin/users/${userId}`, {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ role: newRole }),
//     });

//     setUsers((prev) =>
//       prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
//     );

//     fetchStats();
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-900 text-white">
//       {/* Sidebar */}
//       <aside className="w-64 bg-gray-800 p-6 flex flex-col">
//         <h2 className="text-2xl font-bold mb-8">Panel Admina</h2>
//         <nav className="flex flex-col gap-4">
//           <button
//             className={`px-4 py-2 rounded-md text-left ${activeTab === "stats" ? "bg-purple-600" : "hover:bg-purple-700"}`}
//             onClick={() => setActiveTab("stats")}
//           >
//             Statystyki
//           </button>
//           <button
//             className={`px-4 py-2 rounded-md text-left ${activeTab === "users" ? "bg-purple-600" : "hover:bg-purple-700"}`}
//             onClick={() => setActiveTab("users")}
//           >
//             Użytkownicy
//           </button>
//         </nav>
//       </aside>

//       {/* Główna zawartość */}
//       <main className="flex-1 p-6">
//         {activeTab === "stats" && stats && <StatsSection stats={stats} />}
//         {activeTab === "users" && (
//           <UsersTable users={users} loading={loading} handleRoleChange={handleRoleChange} />
//         )}
//       </main>
//     </div>
//   );
// }

// // ------------------ Sekcja Statystyk ------------------
// function StatsSection({ stats }: { stats: Stats }) {
//   const pieData = [
//     { name: "Użytkownicy", value: stats.users },
//     { name: "Drużyny", value: stats.teams },
//     { name: "Turnieje", value: stats.tournaments },
//     { name: "Mecze", value: stats.matches },
//   ];

//   const COLORS = ["#9b59b6", "#1abc9c", "#f1c40f", "#e74c3c"];

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//       <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
//         <h3 className="text-lg font-bold mb-4 text-center">Proporcje platformy</h3>
//         <ResponsiveContainer width="100%" height={250}>
//           <PieChart>
//             <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
//               {pieData.map((entry, index) => (
//                 <Cell key={index} fill={COLORS[index % COLORS.length]} />
//               ))}
//             </Pie>
//             <Tooltip />
//           </PieChart>
//         </ResponsiveContainer>
//       </div>

//       <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
//         <h3 className="text-lg font-bold mb-4 text-center">Statystyki w liczbach</h3>
//         <ResponsiveContainer width="100%" height={250}>
//           <BarChart data={pieData}>
//             <XAxis dataKey="name" stroke="#fff" />
//             <YAxis stroke="#fff" />
//             <Tooltip />
//             <Legend />
//             <Bar dataKey="value" fill="#9b59b6" />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }

// // ------------------ Tabela Użytkowników ------------------
// interface UsersTableProps {
//   users: User[];
//   loading: boolean;
//   handleRoleChange: (userId: string, newRole: Role) => void;
// }

// function UsersTable({ users, loading, handleRoleChange }: UsersTableProps) {
//   if (loading) return <p className="text-center text-gray-400">Ładowanie użytkowników...</p>;

//   return (
//     <div className="overflow-auto rounded-lg border border-purple-700 shadow-xl">
//       <table className="min-w-full divide-y divide-gray-700">
//         <thead className="bg-gradient-to-r from-purple-900 to-gray-800 text-gray-200">
//           <tr>
//             <th className="px-6 py-3 text-left text-sm font-bold uppercase">Username</th>
//             <th className="px-6 py-3 text-left text-sm font-bold uppercase">Email</th>
//             <th className="px-6 py-3 text-left text-sm font-bold uppercase">Rola</th>
//             <th className="px-6 py-3 text-left text-sm font-bold uppercase">Akcje</th>
//           </tr>
//         </thead>
//         <tbody className="bg-gray-900 divide-y divide-gray-700">
//           {users.map((user, idx) => (
//             <tr key={user.id} className={idx % 2 === 0 ? "bg-gray-800" : ""}>
//               <td className="px-6 py-4 text-gray-300">{user.username}</td>
//               <td className="px-6 py-4 text-gray-300">{user.email}</td>
//               <td className="px-6 py-4 text-purple-400 font-semibold">{user.role}</td>
//               <td className="px-6 py-4 flex gap-2">
//                 {(["PLAYER", "ORGANIZER", "ADMIN"] as Role[])
//                   .filter((r) => r !== user.role)
//                   .map((role) => (
//                     <button
//                       key={role}
//                       className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-md text-sm transition-colors"
//                       onClick={() => handleRoleChange(user.id, role)}
//                     >
//                       {role}
//                     </button>
//                   ))}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// app/admin/AdminPanel.tsx
"use client";

import { useEffect, useState } from "react";
import StatsSection from "../components/StatsSection";
import UsersTable from "../components/UsersTable";

export type Role = "PLAYER" | "ORGANIZER" | "ADMIN";

export interface User {
  id: string;
  username: string;
  email: string;
  role: Role;
}

export interface Stats {
  users: number;
  teams: number;
  tournaments: number;
  matches: number;
}

export default function AdminPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [activeTab, setActiveTab] = useState<"stats" | "users">("stats");

  const fetchUsers = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(data.users);
    setLoading(false);
  };

  const fetchStats = async () => {
    const res = await fetch("/api/admin/stats");
    const data = await res.json();
    setStats(data);
  };

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  const handleRoleChange = async (userId: string, newRole: Role) => {
    await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });

    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );

    fetchStats();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight">Panel Admina</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-4 py-2 rounded-lg text-sm font-medium border ${activeTab === 'stats' ? 'bg-purple-600 border-purple-500' : 'bg-gray-800 border-gray-700 hover:bg-gray-700'}`}
            >
              Statystyki
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-lg text-sm font-medium border ${activeTab === 'users' ? 'bg-purple-600 border-purple-500' : 'bg-gray-800 border-gray-700 hover:bg-gray-700'}`}
            >
              Użytkownicy
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'stats' && stats && (
            <section className="rounded-2xl border border-gray-800/60 bg-gray-900/50 backdrop-blur-sm p-6 shadow-xl">
              <StatsSection stats={stats} />
            </section>
          )}

          {activeTab === 'users' && (
            <section className="rounded-2xl border border-gray-800/60 bg-gray-900/50 backdrop-blur-sm p-6 shadow-xl">
              <UsersTable users={users} loading={loading} handleRoleChange={handleRoleChange} />
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
