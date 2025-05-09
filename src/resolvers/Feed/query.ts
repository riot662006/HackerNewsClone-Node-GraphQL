import { IContext, ILinkOrderByInput } from "../../types.js";

export const feed = async (
  parent: unknown,
  args: {
    filter: string;
    skip: number;
    take: number;
    orderBy: ILinkOrderByInput;
  },
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

  const links = await context.prisma.link.findMany({
    where,
    skip: args.skip,
    take: args.take,
    orderBy: args.orderBy,
  });

  const count = await context.prisma.link.count({ where });

  return {
    links,
    count,
  };
};
