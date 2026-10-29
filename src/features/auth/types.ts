export const UserRole = {
  SADMIN: 1,
  ROLEMNGR: 2,
  CCS: 3,
  RO: 4,
  FO: 5,
  AGENT: 6,
  IO: 7,
  VO1: 8,
  VO2: 9,
  VO3: 10,
  SALSMNGR: 11,
  SALSEXEC: 12,
  BUYER: 13,
  SELLER: 14,
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export const ROLE_CODES: Record<UserRole, string> = {
  [UserRole.SADMIN]: "SADMIN",
  [UserRole.ROLEMNGR]: "ROLEMNGR",
  [UserRole.CCS]: "CCS",
  [UserRole.RO]: "RO",
  [UserRole.FO]: "FO",
  [UserRole.AGENT]: "AGENT",
  [UserRole.IO]: "IO",
  [UserRole.VO1]: "VO1",
  [UserRole.VO2]: "VO2",
  [UserRole.VO3]: "VO3",
  [UserRole.SALSMNGR]: "SALSMNGR",
  [UserRole.SALSEXEC]: "SALSEXEC",
  [UserRole.BUYER]: "BUYER",
  [UserRole.SELLER]: "SELLER",
};

export interface LoginRequest {
  login_id: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  login_id: string;
  first_name: string;
  last_name: string;
  role_id: UserRole;
  is_first_login: number;
  token: string;
  refreshToken: string;
}

export interface UserProfileResponse {
  first_name: string;
  last_name: string;
  profile_url: string;
  dob: string;
  email: string;
  country_code: string;
  phone_number: string;
}
