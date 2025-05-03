import { IncomingMessage } from "http";
import jwt from "jsonwebtoken";

export const getTokenPayload = (token: string) => {
  try {
    return jwt.verify(token, process.env.APP_SECRET!);
  } catch (e: any) {
    if (e.name === "TokenExpiredError") {
      console.warn("Token expired:", e.expiredAt);
    } else {
      console.error("JWT verification error:", e.message);
    }
    return null; // or throw custom error if you want to force auth
  }
};

export const getUserId = (authorization: IncomingMessage | string) => {
  let token: string | undefined;

  if (typeof authorization === "string") {
    token = authorization;
  } else if (
    authorization &&
    "headers" in authorization &&
    typeof authorization.headers?.authorization === "string"
  ) {
    token = authorization.headers.authorization;
  }

  if (!token) {
    throw new Error("Authorization token missing");
  }

  const payload = getTokenPayload(token.replace("Bearer ", ""));

  if (payload && typeof payload === "object" && "userId" in payload) {
    return payload.userId;
  }

  throw new Error("Not authenticated");
};
