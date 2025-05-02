import { Context } from "../types.js";
import { GraphQLResolveInfo } from "graphql";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getUserId } from "../utils.js";

export const Mutation = {
  post: async (
    parent: unknown,
    args: { url: string; description: string },
    context: Context,
    info: GraphQLResolveInfo
  ) => {
    if (!context.userId) throw new Error("Not authenticated");

    const newLink = await context.prisma.link.create({
      data: {
        url: args.url,
        description: args.description,
        postedBy: {
          connect: { id: Number(context.userId) },
        },
      },
    });
    return newLink;
  },
  updateLink: async (
    parent: unknown,
    args: { id: string; url: string; description: string },
    context: Context,
    info: GraphQLResolveInfo
  ) => {
    if (!context.userId) {
      throw new Error("Not authenticated");
    }

    const existingLink = await context.prisma.link.findUnique({
      where: { id: Number(args.id) },
    });

    if (!existingLink) {
      throw new Error("Link not found");
    }

    if (existingLink.postedById !== Number(context.userId)) {
      throw new Error("Not authorized to update this link");
    }

    const updatedLink = await context.prisma.link.update({
      where: { id: Number(args.id) },
      data: {
        url: args.url,
        description: args.description,
      },
    });

    return updatedLink;
  },
  deleteLink: async (
    parent: unknown,
    args: { id: string },
    context: Context,
    info: GraphQLResolveInfo
  ) => {
    if (!context.userId) {
      throw new Error("Not authenticated");
    }

    const existingLink = await context.prisma.link.findUnique({
      where: { id: Number(args.id) },
    });

    if (!existingLink) {
      throw new Error("Link not found");
    }

    if (existingLink.postedById !== Number(context.userId)) {
      throw new Error("Not authorized to delete this link");
    }

    const deletedLink = await context.prisma.link.delete({
      where: { id: Number(args.id) },
    });

    return deletedLink;
  },
  signIn: async (
    parent: unknown,
    args: { email: string; password: string },
    context: Context,
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
  },
  signUp: async (
    parent: unknown,
    args: { email: string; password: string; name: string },
    context: Context,
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
  },
};
