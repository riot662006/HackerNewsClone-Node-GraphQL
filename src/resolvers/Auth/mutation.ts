import { GraphQLResolveInfo } from "graphql";
import { IContext } from "../../types";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signIn = async (
  parent: unknown,
  args: { email: string; password: string },
  context: IContext,
  info: GraphQLResolveInfo
) => {
  const user = await context.prisma.user.findUnique({
    where: { email: args.email },
  });
  if (!user) {
    throw new Error("User not found");
  }

  const validPassword = await bcrypt.compare(args.password, user.password);

  if (!validPassword) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET!, {
    expiresIn: "1h",
  });

  return {
    token,
    user,
  };
};

export const signUp = async (
  parent: unknown,
  args: { email: string; password: string; name: string },
  context: IContext,
  info: GraphQLResolveInfo
) => {
  const hashedPassword = await bcrypt.hash(args.password, 10);
  const newUser = await context.prisma.user.create({
    data: {
      ...args,
      password: hashedPassword,
    },
  });

  const token = jwt.sign({ userId: newUser.id }, process.env.APP_SECRET!, {
    expiresIn: "1h",
  });

  return {
    token,
    user: newUser,
  };
};
