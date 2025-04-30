import { Context } from "../types.js";

export const Query = {
  info: () => `This is the API for a Hackernews Clone`,
  feed: async (parent: unknown, args: undefined, context: Context) =>
    context.prisma.link.findMany(),
};
