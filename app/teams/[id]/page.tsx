import { prisma } from "@/app/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/app/lib/auth";
import JoinRequestsList from "@/app/components/JoinRequestsList";
import MemberManagementList from "@/app/components/MemberManagementList";

interface Params {
  params: { id: string };
}

export default async function TeamPage({ params }: Params) {
  const user = await getCurrentUser();

  const team = await prisma.team.findUnique({
    where: { id: params.id },
    include: {
      owner: { select: { username: true, name: true } },
      members: {
        include: {
          user: { select: { id: true, username: true, name: true, email: true } },
        },
        orderBy: [
          { teamRole: "desc" },
          { joinedAt: "asc" },
        ],
      },
      joinRequests: {
        where: { status: "PENDING" },
        include: { user: { select: { username: true, name: true } } },
      },
      _count: { select: { members: true, joinRequests: true } },
    },
  });

  if (!team) {
    notFound();
  }

  const isMember = !!user?.id && team.members.some((m) => m.userId === user.id);
  const isOwnerOrCaptain =
    !!user?.id && team.members.some((m) => m.userId === user.id && (m.teamRole === "OWNER" || m.teamRole === "CAPTAIN"));
  const isOwner = !!user?.id && team.members.some((m) => m.userId === user.id && m.teamRole === "OWNER");

  const pendingRequestsCount = team.joinRequests ? team.joinRequests.length : 0;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl mb-2">
              Drużyna: <span className="text-indigo-400">{team.name}</span>
            </h1>
            <div className="text-sm text-gray-300">
              Właściciel: <span className="font-medium">{team.owner?.username}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-300">
              Członkowie: <span className="font-semibold">{team._count.members}</span>
              {typeof team.maxMembers === "number" ? <>/{team.maxMembers}</> : null}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {team.requireApproval ? "Wymagana akceptacja dołączenia" : "Dołączenie bez akceptacji"}
            </div>
            {isOwnerOrCaptain && pendingRequestsCount > 0 && (
              <div className="mt-2 text-xs px-2 py-1 bg-blue-900 text-blue-200 rounded">
                Oczekujące prośby: {pendingRequestsCount}
              </div>
            )}
          </div>
        </header>

        {team.description && (
          <section className="bg-gray-800/60 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-indigo-300 mb-2">Opis</h2>
            <p className="text-gray-200">{team.description}</p>
          </section>
        )}

        {isOwnerOrCaptain && (
          <section className="bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-indigo-300 mb-4">Prośby o dołączenie</h2>
            <JoinRequestsList requests={team.joinRequests || []} />
          </section>
        )}

        <section className="bg-gray-800 rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-indigo-300 mb-4">Członkowie</h2>
          {isOwner ? (
            <MemberManagementList
              teamId={team.id}
              currentUserId={user!.id}
              members={team.members as any}
            />
          ) : (
            <ul className="divide-y divide-gray-700">
              {team.members.map((m) => (
                <li key={m.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{m.user.name ?? m.user.username}</div>
                    <div className="text-xs text-gray-400">{m.user.username}</div>
                  </div>
                  <div className="text-xs">
                    <span className={`px-2 py-1 rounded-full ${
                      m.teamRole === "OWNER"
                        ? "bg-yellow-900 text-yellow-300"
                        : m.teamRole === "CAPTAIN"
                        ? "bg-purple-900 text-purple-200"
                        : "bg-gray-700 text-gray-200"
                    }`}>
                      {m.teamRole === "OWNER" ? "Właściciel" : m.teamRole === "CAPTAIN" ? "Kapitan" : "Członek"}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="flex justify-between">
          <Link href="/teams" className="text-sm text-indigo-300 hover:text-indigo-200">
            ← Wróć do listy drużyn
          </Link>
          {isMember && (
            <span className="text-sm text-green-300">Jesteś członkiem tej drużyny</span>
          )}
        </div>
      </div>
    </div>
  );
}