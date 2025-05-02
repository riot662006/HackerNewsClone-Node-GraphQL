import { Context, User as UserType } from "../types.js";

export const User = {
  links: async (parent: UserType, args: undefined, context: Context) =>
    await context.prisma.user
      .findUnique({
        where: { id: Number(parent.id) },
      })
      .links(),
};
