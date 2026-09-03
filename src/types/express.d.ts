declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
        expiresAt: Date;
        sessionId: string;
      };
    }
  }
}

export { };
