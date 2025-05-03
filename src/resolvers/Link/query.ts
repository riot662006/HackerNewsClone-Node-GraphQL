import { IContext } from "../../types.js";

export const feed = async (
  parent: unknown,
  args: undefined,
  context: IContext
) => context.prisma.link.findMany();
