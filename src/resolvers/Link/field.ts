import { IContext, ILink } from "../../types.js";

export const postedBy = async (
  parent: ILink,
  args: undefined,
  context: IContext
) =>
  await context.prisma.link
    .findUnique({
      where: { id: Number(parent.id) },
    })
    .postedBy();

export const votes = async (
  parent: ILink,
  args: undefined,
  context: IContext
) =>
  await context.prisma.link
    .findUnique({
      where: { id: Number(parent.id) },
    })
    .votes();
