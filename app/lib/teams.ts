// types/team.ts
export type TeamRole = 'OWNER' | 'CAPTAIN' | 'MEMBER';
export type JoinRequestStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED';

export interface User {
  id: string;
  username: string;
  name?: string;
  email?: string;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  isPublic: boolean;
  requireApproval: boolean;
  maxMembers: number;
  createdAt: string;
  ownerId: string;
  owner: Pick<User, 'username' | 'name'>;
  members: TeamMember[];
  joinRequests?: TeamJoinRequest[];
  _count: {
    members: number;
    joinRequests: number;
  };
}

export interface TeamMember {
  id: string;
  teamRole: TeamRole;
  joinedAt: string;
  teamId: string;
  userId: string;
  team?: Team;
  user: Pick<User, 'username' | 'name' | 'email'>;
}

export interface TeamJoinRequest {
  id: string;
  status: JoinRequestStatus;
  message?: string;
  createdAt: string;
  teamId: string;
  userId: string;
  team?: Team;
  user: Pick<User, 'username' | 'name'>;
}

export interface CreateTeamData {
  name: string;
  description?: string;
  maxMembers: number;
  requireApproval: boolean;
  isPublic: boolean;
}

export interface JoinTeamData {
  message?: string;
}

export interface TeamsResponse {
  teams: Team[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface MyTeamsResponse {
  teams: TeamMember[];
}