
import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../lib/auth';
import { Users, Plus, Search, Crown, Shield, User, Calendar, UserPlus, X, Check, Settings, Zap, Star, Trophy } from 'lucide-react';
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
      fetchTeams(debouncedSearchTerm);
    } else if (activeTab === 'my-teams') {
      fetchMyTeams();
    }
  }, [activeTab, debouncedSearchTerm]);

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
        fetchTeams();
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
        return <Crown className="w-4 h-4 text-yellow-400" />;
      case 'CAPTAIN':
        return <Shield className="w-4 h-4 text-cyan-400" />;
      default:
        return <User className="w-4 h-4 text-slate-400" />;
    }
  };

  const getRoleText = (role: TeamRole) => {
    switch (role) {
      case 'OWNER':
        return 'Commander';
      case 'CAPTAIN':
        return 'Captain';
      default:
        return 'Member';
    }
  };

  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-2xl">
            <Users className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
            ACCESS REQUIRED
          </h1>
          <p className="text-slate-400 text-lg">Authentication needed to access team management</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 relative">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/6 w-72 h-72 bg-cyan-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/6 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-400/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-7xl mx-auto p-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                TEAM MANAGEMENT
              </h1>
              <p className="text-slate-400 text-sm">Manage your esports teams</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25 font-semibold"
          >
            <Plus className="w-5 h-5" />
            CREATE TEAM
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-8 bg-slate-800/50 backdrop-blur-xl p-2 rounded-xl w-fit border border-slate-700/50">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 relative overflow-hidden ${
              activeTab === 'browse' 
                ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-cyan-500/25' 
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <span className="relative z-10 flex items-center gap-2">
              <Search className="w-4 h-4" />
              DISCOVER TEAMS
            </span>
          </button>
          <button
            onClick={() => setActiveTab('my-teams')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 relative overflow-hidden ${
              activeTab === 'my-teams' 
                ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-cyan-500/25' 
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <span className="relative z-10 flex items-center gap-2">
              <Users className="w-4 h-4" />
              MY TEAMS ({myTeams.length})
            </span>
          </button>
        </div>

        {/* Search Bar */}
        {activeTab === 'browse' && (
          <div className="mb-8 relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400/20 to-purple-500/20 rounded-xl blur opacity-50"></div>
            <div className="relative bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-xl">
              <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search teams by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent text-white pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all duration-300"
              />
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="text-center py-20">
            <div className="relative w-16 h-16 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 animate-spin">
                <div className="absolute inset-2 rounded-full bg-slate-900"></div>
              </div>
              <Zap className="absolute inset-0 w-8 h-8 m-auto text-cyan-400 animate-pulse" />
            </div>
            <p className="text-slate-400 text-lg font-medium">Loading teams data...</p>
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
                <div className="col-span-full text-center py-20">
                  <div className="w-20 h-20 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Users className="w-10 h-10 text-slate-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-300 mb-2">No Teams Found</h3>
                  <p className="text-slate-400 text-lg">
                    {searchTerm ? 'No teams match your search criteria' : 'No teams available to join'}
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
                <div className="col-span-full text-center py-20">
                  <div className="w-20 h-20 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Star className="w-10 h-10 text-slate-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-300 mb-2">No Teams Yet</h3>
                  <p className="text-slate-400 text-lg mb-6">You haven't joined any teams</p>
                  <button
                    onClick={() => setActiveTab('browse')}
                    className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 font-semibold"
                  >
                    Discover Teams
                  </button>
                </div>
              )
            )}
          </div>
        )}

        {/* Create Team Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="relative w-full max-w-lg">
              {/* Neon glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 rounded-2xl blur opacity-30"></div>
              
              <div className="relative bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 p-8 rounded-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    CREATE NEW TEAM
                  </h3>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="text-slate-400 hover:text-white hover:bg-slate-700 p-2 rounded-lg transition-all duration-200"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleCreateTeam} className="space-y-6">
                  <div>
                    <label className="block text-slate-300 mb-2 font-medium">
                      TEAM NAME *
                    </label>
                    <input
                      type="text"
                      required
                      value={createForm.name}
                      onChange={(e) => setCreateForm({...createForm, name: e.target.value})}
                      className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300"
                      placeholder="Enter team name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-slate-300 mb-2 font-medium">
                      DESCRIPTION
                    </label>
                    <textarea
                      value={createForm.description}
                      onChange={(e) => setCreateForm({...createForm, description: e.target.value})}
                      className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent h-24 resize-none transition-all duration-300"
                      placeholder="Describe your team..."
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-2 font-medium">
                      TEAM AVATAR
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                      className="w-full text-slate-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-cyan-500 file:to-purple-600 file:text-white hover:file:from-cyan-400 hover:file:to-purple-500 transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-2 font-medium">
                      MAX MEMBERS
                    </label>
                    <input
                      type="number"
                      min="2"
                      max="20"
                      value={createForm.maxMembers}
                      onChange={(e) => setCreateForm({...createForm, maxMembers: parseInt(e.target.value)})}
                      className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={createForm.requireApproval}
                        onChange={(e) => setCreateForm({...createForm, requireApproval: e.target.checked})}
                        className="w-4 h-4 text-cyan-500 rounded border-slate-600 focus:ring-cyan-500"
                      />
                      <span className="text-slate-300 group-hover:text-white transition-colors">
                        Require approval to join
                      </span>
                    </label>
                    
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={createForm.isPublic}
                        onChange={(e) => setCreateForm({...createForm, isPublic: e.target.checked})}
                        className="w-4 h-4 text-cyan-500 rounded border-slate-600 focus:ring-cyan-500"
                      />
                      <span className="text-slate-300 group-hover:text-white transition-colors">
                        Public team (visible to everyone)
                      </span>
                    </label>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      CREATE TEAM
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-3 rounded-xl font-semibold transition-all duration-300"
                    >
                      CANCEL
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Reusable esports avatar with neon ring
function TeamAvatar({ name, avatar }: { name: string; avatar?: string | null }) {
  return (
    <div className="relative">
      <div className="absolute -inset-0.5 bg-gradient-to-tr from-cyan-500 via-fuchsia-500 to-purple-600 rounded-full blur opacity-60 group-hover:opacity-90 transition" />
      <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-slate-700 bg-slate-900 flex items-center justify-center text-white font-black">
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatar} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span>{name?.[0]?.toUpperCase() ?? "T"}</span>
        )}
      </div>
    </div>
  );
}

// Team Card Component (Browse)
interface TeamCardProps {
  team: Team;
  onJoin: () => void;
  onViewDetails: () => void;
  currentUserId: string;
}

const TeamCard: React.FC<TeamCardProps> = ({ team, onJoin, onViewDetails, currentUserId }) => {
  const isMember = team.members.some(member => member.userId === currentUserId);
  const isFull = team.members.length >= team.maxMembers;
  const joinable = !isMember && !isFull;

  return (
    <div className="group relative">
      {/* Outer neon frame */}
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/15 via-fuchsia-500/15 to-purple-600/15 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
      
      <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-cyan-500/40 transition-all duration-300 shadow-[0_0_0_1px_rgba(8,145,178,0.15)]">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <TeamAvatar name={team.name} avatar={team.avatar} />
            <div>
              <h3 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
                {team.name}
                {team.isPublic ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    PUBLIC
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-300 border border-slate-600/60">
                    PRIVATE
                  </span>
                )}
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Crown className="w-3.5 h-3.5 text-yellow-400" />
                <span className="truncate">{team.owner.username}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-300 bg-slate-800/60 rounded-lg px-2 py-1 border border-slate-700/60">
            <Users className="w-4 h-4" />
            <span className="font-semibold">{team.members.length}</span>
            <span className="opacity-60">/</span>
            <span>{team.maxMembers}</span>
          </div>
        </div>

        {/* Media banner */}
        {team.avatar && (
          <div className="relative mb-4 overflow-hidden rounded-xl border border-slate-700/50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={team.avatar}
              alt={`${team.name} avatar`}
              className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent"></div>
          </div>
        )}

        {/* Description */}
        <p className="text-slate-300/90 mb-4 line-clamp-3 min-h-[4rem] leading-relaxed">
          {team.description || 'No description available'}
        </p>

        {/* Chips */}
        <div className="flex flex-wrap gap-2 mb-5 min-h-[1.5rem]">
          {team.requireApproval && (
            <span className="px-2 py-1 bg-orange-500/15 text-orange-300 text-xs rounded-full border border-orange-500/30">
              Requires Approval
            </span>
          )}
          {team._count.joinRequests > 0 && (
            <span className="px-2 py-1 bg-cyan-500/15 text-cyan-300 text-xs rounded-full border border-cyan-500/30">
              {team._count.joinRequests} pending
            </span>
          )}
          {isFull && (
            <span className="px-2 py-1 bg-rose-500/15 text-rose-300 text-xs rounded-full border border-rose-500/30">
              Full
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <a href={`/teams/${team.id}`} className="flex-1">
            <button className="w-full bg-slate-800/70 hover:bg-slate-700 text-white px-4 py-2.5 rounded-xl text-sm transition-all duration-300 flex items-center justify-center gap-2 font-semibold border border-slate-600/50 hover:border-cyan-500/40 hover:shadow-[0_0_12px_rgba(8,145,178,0.3)]">
              <Settings className="w-4 h-4" />
              VIEW DETAILS
            </button>
          </a>
          {joinable ? (
            <button
              onClick={onJoin}
              className="bg-gradient-to-r from-cyan-500 to-fuchsia-600 hover:from-cyan-400 hover:to-fuchsia-500 text-white px-4 py-2.5 rounded-xl text-sm transition-all duration-300 flex items-center gap-2 font-semibold transform hover:scale-[1.03] shadow-[0_10px_25px_-10px_rgba(168,85,247,0.45)]"
            >
              <UserPlus className="w-4 h-4" />
              JOIN
            </button>
          ) : isMember ? (
            <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 font-semibold">
              <Check className="w-4 h-4" />
              MEMBER
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

// My Team Card Component
interface MyTeamCardProps {
  membership: TeamMember;
  onManage: () => void;
}

const MyTeamCard: React.FC<MyTeamCardProps> = ({ membership, onManage }) => {
  const { team, teamRole } = membership;
  
  const getRoleIcon = (role: TeamRole) => {
    switch (role) {
      case 'OWNER':
        return <Crown className="w-4 h-4 text-yellow-400" />;
      case 'CAPTAIN':
        return <Shield className="w-4 h-4 text-cyan-400" />;
      default:
        return <User className="w-4 h-4 text-slate-400" />;
    }
  };

  const getRoleText = (role: TeamRole) => {
    switch (role) {
      case 'OWNER':
        return 'Commander';
      case 'CAPTAIN':
        return 'Captain';
      default:
        return 'Member';
    }
  };

  const getRoleBadgeColor = (role: TeamRole) => {
    switch (role) {
      case 'OWNER':
        return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black';
      case 'CAPTAIN':
        return 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black';
      default:
        return 'bg-slate-600 text-white';
    }
  };

  if (!team) return null;

  return (
    <div className="group relative">
      {/* Enhanced glow for own teams */}
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-400/30 via-cyan-400/30 to-purple-400/30 rounded-2xl blur opacity-20 group-hover:opacity-60 transition duration-500"></div>
      
      <div className="relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <TeamAvatar name={team.name} avatar={team.avatar} />
            <h3 className="text-xl font-extrabold text-white truncate pr-2">{team.name}</h3>
          </div>
          <div className={`flex items-center gap-2 text-sm px-3 py-1 rounded-lg font-semibold ${getRoleBadgeColor(teamRole)}`}>
            {getRoleIcon(teamRole)}
            <span>{getRoleText(teamRole)}</span>
          </div>
        </div>

        <p className="text-slate-300 mb-4 min-h-[3rem] line-clamp-2 leading-relaxed">
          {team.description || 'No description available'}
        </p>

        {team.avatar && (
          <div className="relative mb-4 overflow-hidden rounded-xl border border-slate-700/50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={team.avatar}
              alt={`${team.name} avatar`}
              className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
          </div>
        )}

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-slate-400">
              <Users className="w-4 h-4" />
              Team Size
            </span>
            <span className="text-white font-medium">
              {team._count.members}{typeof team.maxMembers === 'number' ? `/${team.maxMembers}` : ''}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-slate-400">
              <Crown className="w-4 h-4" />
              Commander
            </span>
            <span className="text-white font-medium">{team.owner.username}</span>
          </div>

          {/* Team capacity bar */}
          <div className="w-full">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Capacity</span>
              <span>{Math.round((team._count.members / (team.maxMembers || team._count.members)) * 100)}%</span>
            </div>
            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-2 bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round((team._count.members / (team.maxMembers || team._count.members)) * 100))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Join requests notification for owners/captains */}
        {Array.isArray((team as any).joinRequests) && (team as any).joinRequests.length > 0 && (teamRole === 'OWNER' || teamRole === 'CAPTAIN') && (
          <div className="mb-4 p-3 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-xl">
            <div className="flex items-center gap-2 text-orange-300">
              <UserPlus className="w-4 h-4" />
              <span className="text-sm font-medium">
                {((team as any).joinRequests as any[]).length} pending request{((team as any).joinRequests as any[]).length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        )}

        <button
          onClick={onManage}
          className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-[1.02] shadow-lg shadow-purple-500/25"
        >
          <Settings className="w-5 h-5" />
          MANAGE TEAM
        </button>
      </div>
    </div>
  );
};

export default TeamsManagement;
