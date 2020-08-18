import { Team } from '../Team/Team';
import { WithID } from '../Utils/WithID';

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
  team: WithID<Team>;
  dateCreated: Date;
};

export type UserInfo = {
  apiKey: string;
  roles: Array<Role>;
};
