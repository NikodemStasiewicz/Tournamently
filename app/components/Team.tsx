import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../lib/auth';
import { Users, Plus, Search, Crown, Shield, User, Calendar, UserPlus, X, Check, Settings } from 'lucide-react';
import { Team, TeamMember, CreateTeamData, JoinTeamData, TeamRole } from '../lib/teams';

// Prosty hook do debounce wartości
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

interface TeamsManagementProps {}

const TeamsManagement: React.FC<TeamsManagementProps> = () => {
const [user, setUser] = useState<any>(null);

useEffect(() => {
  const fetchUser = async () => {
    const res = await fetch("/api/auth/me");
    const data = await res.json();
    setUser(data.user);
  };
  fetchUser();
}, []);
  const [teams, setTeams] = useState<Team[]>([]);
  const [myTeams, setMyTeams] = useState<TeamMember[]>([]);
  const [activeTab, setActiveTab] = useState<'browse' | 'my-teams'>('browse');
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 800);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [createForm, setCreateForm] = useState<CreateTeamData>({
    name: '',
    description: '',
    maxMembers: 5,
    requireApproval: false,
    isPublic: true
  });

  useEffect(() => {
    if (activeTab === 'browse') {
      // Pobieraj drużyny dopiero po krótkiej pauzie w pisaniu
      fetchTeams(debouncedSearchTerm);
    } else if (activeTab === 'my-teams') {
      fetchMyTeams();
    }
  }, [activeTab, debouncedSearchTerm]);

  // Prefetch "Moje drużyny" po załadowaniu użytkownika, aby licznik był aktualny na zakładce
  useEffect(() => {
    if (user) {
      fetchMyTeams({ silent: true });
    }
  }, [user]);

  const fetchTeams = async (term?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search: term ?? searchTerm,
        page: '1',
        limit: '12'
      });
      
      const response = await fetch(`/api/teams?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setTeams(data.teams);
      } else {
        console.error('Błąd pobierania drużyn:', data.error);
      }
    } catch (error) {
      console.error('Błąd pobierania drużyn:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyTeams = async (opts?: { silent?: boolean }) => {
    if (!user) return;
    
    const silent = !!opts?.silent;
    if (!silent) setLoading(true);
    try {
      const response = await fetch('/api/teams/my');
      const data = await response.json();
      
      if (response.ok) {
        setMyTeams(data);
      } else {
        console.error('Błąd pobierania moich drużyn:', data.error);
      }
    } catch (error) {
      console.error('Błąd pobierania moich drużyn:', error);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      let response: Response;
      if (avatarFile) {
        const form = new FormData();
        form.append('name', createForm.name);
        form.append('description', createForm.description || '');
        form.append('maxMembers', String(createForm.maxMembers));
        form.append('requireApproval', String(createForm.requireApproval));
        form.append('isPublic', String(createForm.isPublic));
        form.append('avatar', avatarFile);
        response = await fetch('/api/teams', {
          method: 'POST',
          body: form,
        });
      } else {
        response = await fetch('/api/teams', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(createForm),
        });
      }

      const data = await response.json();
      
      if (response.ok) {
        setShowCreateForm(false);
        setCreateForm({
          name: '',
          description: '',
          maxMembers: 5,
          requireApproval: false,
          isPublic: true
        });
        setAvatarFile(null);
        if (activeTab === 'browse') {
          fetchTeams();
        }
        // Zawsze odśwież "Moje drużyny" w tle, aby licznik był aktualny
        fetchMyTeams({ silent: true });
      } else {
        alert(data.error || 'Błąd tworzenia drużyny');
      }
    } catch (error) {
      console.error('Błąd tworzenia drużyny:', error);
      alert('Błąd serwera');
    }
  };

  const handleJoinTeam = async (teamId: string) => {
    if (!user) return;

    try {
      const joinData: JoinTeamData = {
        message: 'Chcę dołączyć do Waszej drużyny!'
      };

      const response = await fetch(`/api/teams/${teamId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(joinData),
      });

      const data = await response.json();
      
      if (response.ok) {
        alert(data.message);
        fetchTeams(); // Odśwież listę
        // Odśwież licznik "Moje drużyny" w tle
        fetchMyTeams({ silent: true });
      } else {
        alert(data.error || 'Błąd dołączania do drużyny');
      }
    } catch (error) {
      console.error('Błąd dołączania do drużyny:', error);
      alert('Błąd serwera');
    }
  };

  const getRoleIcon = (role: TeamRole) => {
    switch (role) {
      case 'OWNER':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'CAPTAIN':
        return <Shield className="w-4 h-4 text-blue-500" />;
      default:
        return <User className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRoleText = (role: TeamRole) => {
    switch (role) {
      case 'OWNER':
        return 'Właściciel';
      case 'CAPTAIN':
        return 'Kapitan';
      default:
        return 'Członek';
    }
  };

  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto p-6 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Zaloguj się</h1>
        <p className="text-gray-400">Musisz być zalogowany, aby zarządzać drużynami.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Users className="w-8 h-8 text-blue-400" />
          Zarządzanie Drużynami
        </h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Stwórz Drużynę
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-800 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('browse')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'browse' 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-300 hover:text-white hover:bg-gray-700'
          }`}
        >
          Przeglądaj Drużyny
        </button>
        <button
          onClick={() => setActiveTab('my-teams')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'my-teams' 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-300 hover:text-white hover:bg-gray-700'
          }`}
        >
          Moje Drużyny ({myTeams.length})
        </button>
      </div>

      {/* Search Bar (tylko dla browse) */}
      {activeTab === 'browse' && (
        <div className="mb-6 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Szukaj drużyn..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none transition-colors"
          />
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Ładowanie drużyn...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === 'browse' ? (
            filteredTeams.length > 0 ? (
              filteredTeams.map(team => (
                <TeamCard 
                  key={team.id} 
                  team={team} 
                  onJoin={() => handleJoinTeam(team.id)}
                  onViewDetails={() => setSelectedTeam(team)}
                  currentUserId={user.user?.id || ''}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">
                  {searchTerm ? 'Nie znaleziono drużyn pasujących do wyszukiwania' : 'Nie znaleziono drużyn'}
                </p>
              </div>
            )
          ) : (
            myTeams.length > 0 ? (
              myTeams.map(membership => (
                <MyTeamCard 
                  key={membership.id} 
                  membership={membership}
                  onManage={() => setSelectedTeam(membership.team!)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">Nie należysz do żadnej drużyny</p>
                <button
                  onClick={() => setActiveTab('browse')}
                  className="mt-4 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Znajdź drużynę
                </button>
              </div>
            )
          )}
        </div>
      )}

      {/* Create Team Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Stwórz Nową Drużynę</h3>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2 font-medium">
                  Nazwa drużyny *
                </label>
                <input
                  type="text"
                  required
                  value={createForm.name}
                  onChange={(e) => setCreateForm({...createForm, name: e.target.value})}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="Wpisz nazwę drużyny"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2 font-medium">
                  Opis (opcjonalnie)
                </label>
                <textarea
                  value={createForm.description}
                  onChange={(e) => setCreateForm({...createForm, description: e.target.value})}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none h-24 resize-none transition-colors"
                  placeholder="Opisz swoją drużynę..."
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-medium">
                  Avatar (plik z komputera, opcjonalnie)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAvatarFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
                  className="w-full text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                />
                <p className="text-xs text-gray-400 mt-1">Jeśli wybierzesz plik, zostanie użyty jako avatar drużyny.</p>
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-medium">
                  Maksymalna liczba członków
                </label>
                <input
                  type="number"
                  min="2"
                  max="20"
                  value={createForm.maxMembers}
                  onChange={(e) => setCreateForm({...createForm, maxMembers: parseInt(e.target.value)})}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={createForm.requireApproval}
                    onChange={(e) => setCreateForm({...createForm, requireApproval: e.target.checked})}
                    className="w-4 h-4 text-blue-600 rounded border-gray-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-300 group-hover:text-white transition-colors">
                    Wymagaj akceptacji dołączenia
                  </span>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={createForm.isPublic}
                    onChange={(e) => setCreateForm({...createForm, isPublic: e.target.checked})}
                    className="w-4 h-4 text-blue-600 rounded border-gray-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-300 group-hover:text-white transition-colors">
                    Publiczna (widoczna dla wszystkich)
                  </span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors"
                >
                  Stwórz Drużynę
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg font-medium transition-colors"
                >
                  Anuluj
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Komponent karty drużyny (browse)
interface TeamCardProps {
  team: Team;
  onJoin: () => void;
  onViewDetails: () => void;
  currentUserId: string;
}

const TeamCard: React.FC<TeamCardProps> = ({ team, onJoin, onViewDetails, currentUserId }) => {
  const isMember = team.members.some(member => member.userId === currentUserId);
  const isFull = team.members.length >= team.maxMembers;

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200 hover:shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-white truncate pr-2">{team.name}</h3>
        <span className="text-sm text-gray-400 flex items-center gap-1 flex-shrink-0">
          <Users className="w-4 h-4" />
          {team.members.length}/{team.maxMembers}
        </span>
      </div>

      <p className="text-gray-300 mb-4 line-clamp-3 min-h-[4rem]">{team.description || 'Brak opisu'}</p>
      {team.avatar && (
        <img
          src={team.avatar}
          alt={`Avatar ${team.name}`}
          className="mb-4 w-full h-40 object-cover rounded-lg border border-gray-700"
        />
      )}

      <div className="flex items-center gap-2 mb-4">
        <Crown className="w-4 h-4 text-yellow-500 flex-shrink-0" />
        <span className="text-sm text-gray-300 truncate">{team.owner.username}</span>
      </div>

      <div className="flex flex-wrap gap-2 mb-4 min-h-[1.5rem]">
        {team.requireApproval && (
          <span className="px-2 py-1 bg-orange-900 text-orange-300 text-xs rounded-full">
            Wymaga akceptacji
          </span>
        )}
        {team._count.joinRequests > 0 && (
          <span className="px-2 py-1 bg-blue-900 text-blue-300 text-xs rounded-full">
            {team._count.joinRequests} oczekuje
          </span>
        )}
        {isFull && (
          <span className="px-2 py-1 bg-red-900 text-red-300 text-xs rounded-full">
            Pełna
          </span>
        )}
      </div>

      <div className="flex gap-2">
        <a href={`/teams/${team.id}`}><button
          onClick={onViewDetails}
          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-1 font-medium"
          
        >
          view details
          
        </button>
        </a>
        {!isMember && !isFull && (
          <button
            onClick={onJoin}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-1 font-medium"
          >
            <UserPlus className="w-4 h-4" />
            Dołącz
          </button>
        )}
        {isMember && (
          <div className="bg-green-900 text-green-300 px-4 py-2 rounded-lg text-sm flex items-center gap-1">
            <Check className="w-4 h-4" />
            Członek
          </div>
        )}
      </div>
    </div>
  );
};

// Komponent karty mojej drużyny
interface MyTeamCardProps {
  membership: TeamMember;
  onManage: () => void;
}

const MyTeamCard: React.FC<MyTeamCardProps> = ({ membership, onManage }) => {
  const { team, teamRole } = membership;
  const getRoleIcon = (role: TeamRole) => {
    switch (role) {
      case 'OWNER':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'CAPTAIN':
        return <Shield className="w-4 h-4 text-blue-500" />;
      default:
        return <User className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRoleText = (role: TeamRole) => {
    switch (role) {
      case 'OWNER':
        return 'Właściciel';
      case 'CAPTAIN':
        return 'Kapitan';
      default:
        return 'Członek';
    }
  };

  if (!team) return null;

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-all duration-200">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-white truncate pr-2">{team.name}</h3>
        <div className="flex items-center gap-1 text-sm flex-shrink-0">
          {getRoleIcon(teamRole)}
          <span className="text-gray-300">{getRoleText(teamRole)}</span>
        </div>
      </div>

      <p className="text-gray-300 mb-4 min-h-[3rem] line-clamp-2">{team.description || 'Brak opisu'}</p>
      {team.avatar && (
        <img
          src={team.avatar}
          alt={`Avatar ${team.name}`}
          className="mb-4 w-full h-40 object-cover rounded-lg border border-gray-700"
        />
      )}

      <div className="flex items-center justify-between mb-2 text-sm text-gray-400">
        <span className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          {team._count.members}{typeof team.maxMembers === 'number' ? `/${team.maxMembers}` : ''}
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          {team.owner.username}
        </span>
      </div>
      <div className="w-full h-2 bg-gray-700 rounded mb-4 overflow-hidden">
        <div
          className="h-2 bg-blue-600"
          style={{ width: `${Math.min(100, Math.round((team._count.members / (team.maxMembers || team._count.members)) * 100))}%` }}
        />
      </div>

      {Array.isArray((team as any).joinRequests) && (team as any).joinRequests.length > 0 && (teamRole === 'OWNER' || teamRole === 'CAPTAIN') && (
        <div className="mb-4 p-3 bg-orange-900/30 border border-orange-600/30 rounded-lg">
          <div className="flex items-center gap-2 text-orange-300">
            <UserPlus className="w-4 h-4" />
            <span className="text-sm font-medium">
              {((team as any).joinRequests as any[]).length} oczekujących próśb
            </span>
          </div>
        </div>
      )}

      <button
        onClick={onManage}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
      >
        <Settings className="w-4 h-4" />
        Zarządzaj drużyną
      </button>
    </div>
  );
};

export default TeamsManagement;