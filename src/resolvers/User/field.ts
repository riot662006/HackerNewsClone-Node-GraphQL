import { IContext, IUser } from "../../types";

export const links = async (
  parent: IUser,
  args: undefined,
  context: IContext
) =>
  await context.prisma.user
    .findUnique({
      where: { id: Number(parent.id) },
    })
    .links();
