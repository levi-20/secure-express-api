
export type RegisterUserInput = {
  email: string;
  password: string;
};

export type LoginUserInput = RegisterUserInput

export type JWTResponse = {
  accessToken: string,
  refreshToken: string,
  expiresAt: number
}

export type Auth = {
  userId: string;
  expiresAt: Date;
  sessionId?: string;
}

export type RefreshAuth = {
  userId: string,
  familyId: string,
  tokenHash: string
}
