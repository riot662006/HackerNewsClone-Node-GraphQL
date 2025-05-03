import { GraphQLResolveInfo } from "graphql";
import { IContext } from "../types.js";

const BaseResolvers = {
  Query: {
    info: () => `This is the API for a Hackernews Clone`,
  },
  Mutation: {
    sayHello: async (
      parent: unknown,
      args: { message: string | undefined },
      context: IContext,
      info: GraphQLResolveInfo
    ) => {
      const message = args.message || "Hello World!";

      await context.pubsub.publish("HELLO", { hello: message });
      return "Said Hello";
    },
  },
  Subscription: {
    hello: {
      subscribe: (
        parent: unknown,
        args: undefined,
        context: IContext,
        info: GraphQLResolveInfo
      ) => {
        return context.pubsub.asyncIterableIterator(["HELLO"]);
      },
    },
  },
};

export default BaseResolvers;
