import { IContext, IUser } from "../../types.js";

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

export const votes = async (
  parent: IUser,
  args: undefined,
  context: IContext
) =>
  await context.prisma.user
    .findUnique({
      where: { id: Number(parent.id) },
    })
    .votes();