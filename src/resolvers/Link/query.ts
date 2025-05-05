import { IContext } from "../../types.js";

export const feed = async (
  parent: unknown,
  args: { filter: string },
  context: IContext
) => {
  if (!context.userId) {
    throw new Error("Not authenticated");
  }

  const where = args.filter
    ? {
        OR: [
          { description: { contains: args.filter } },
          { url: { contains: args.filter } },
        ],
      }
    : {};

  return await context.prisma.link.findMany({
    where,
  });
};
