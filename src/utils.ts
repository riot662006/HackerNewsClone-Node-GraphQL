import { IncomingMessage } from "http";
import jwt from "jsonwebtoken";

export const getTokenPayload = (token: string) => {
  return jwt.verify(token, process.env.APP_SECRET!) as { userId: string };
};

export const getUserId = (req: IncomingMessage | null, authToken?: string) => {
  if (req && req.headers && req.headers.authorization) {
    const token = req.headers.authorization.replace("Bearer ", "");

    if (token) {
      const { userId } = getTokenPayload(token);
      return userId;
    }
  } else if (authToken) {
    const { userId } = getTokenPayload(authToken);
    return userId;
  }

  throw new Error("Not authenticated");
};
