import { IContext } from "../../types";

export const feed = async (
  parent: unknown,
  args: undefined,
  context: IContext
) => context.prisma.link.findMany();
