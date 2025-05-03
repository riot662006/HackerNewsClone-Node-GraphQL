import { GraphQLResolveInfo, subscribe } from "graphql";
import { IContext } from "../../types.js";
import { withFilter } from "graphql-subscriptions";

export const newLink = {
  subscribe: withFilter<IContext>(
    (
      parent: unknown,
      args: undefined,
      context: IContext,
      info: GraphQLResolveInfo
    ) => context.pubsub.asyncIterableIterator("NEW_LINK"),
    (payload, variables) => {
      return true;
    }
  ),
};
