import { Auth, RefreshAuth } from "./types.ts";

declare global {
  namespace Express {
    interface Request {
      auth?: Auth,
      refreshAuth?: RefreshAuth
    }
  }
}

export { };
