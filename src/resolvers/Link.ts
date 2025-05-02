import { Context, Link as LinkType } from "../types.js";

export const Link = {
  id: (parent: LinkType) => parent.id,
  description: (parent: LinkType) => parent.description,
  url: (parent: LinkType) => parent.url,
  postedBy: async (parent: LinkType, args: undefined, context: Context) =>
    await context.prisma.link
      .findUnique({
        where: { id: Number(parent.id) },
      })
      .postedBy(),
};
