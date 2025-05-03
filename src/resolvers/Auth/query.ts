import { GraphQLResolveInfo } from "graphql";
import { IContext } from "../../types.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const me = async (
  parent: unknown,
  args: undefined,
  context: IContext,
  info: GraphQLResolveInfo
) => {
  if (!context.userId) {
    return null;
  }

  const user = await context.prisma.user.findUnique({
    where: { id: Number(context.userId) },
  });

  return user;
};
