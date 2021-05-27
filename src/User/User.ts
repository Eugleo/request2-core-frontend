import { Team } from '../Team/Team';
import { WithID } from '../Utils/WithID';

export type Role = 'Admin' | 'Operator' | 'Client';

export type User = {
  email: string;
  password: string;
  name: string;
  roles: Role[];
  teamIds: number[];
  dateCreated: number;
  active: boolean;
  telephone: string;
  room: string;
};

export type UserName = {
  name: string;
};

export type UserDetails = {
  _id: number;
  name: string;
  email: string;
  roles: Role[];
  teams: WithID<Team>[];
  dateCreated: number;
  telephone: string;
  room: string;
};

export type UserInfo = {
  apiKey: string;
  userId: number;
  roles: Role[];
};
