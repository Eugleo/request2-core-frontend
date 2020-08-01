import { Team } from '../Team/Team';

export type Role = 'Admin' | 'Operator' | 'Client';

export type User = {
  email: string;
  password: string;
  name: string;
  roles: Array<Role>;
  teamId: number;
  dateCreated: number;
  active: boolean;
};

export type UserDetails = {
  name: string;
  roles: Array<Role>;
  team: Team;
  dateCreated: Date;
};

export type UserInfo = {
  apiKey: string;
  userId: number;
  roles: Array<Role>;
};
