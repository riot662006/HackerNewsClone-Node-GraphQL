import LinkResolvers from "./Link/index.js";
import BaseResolvers from "./Base.js";
import AuthResolvers from "./Auth/index.js";
import UserResolvers from "./User/index.js";

export const resolvers = {
  Query: {
    ...BaseResolvers.Query,
    ...LinkResolvers.Query,
    ...AuthResolvers.Query,
  },
  Mutation: {
    ...BaseResolvers.Mutation,
    ...LinkResolvers.Mutation,
    ...AuthResolvers.Mutation,
  },
  Subscription: {
    ...BaseResolvers.Subscription,
    ...LinkResolvers.Subscription,
  },
  Link: LinkResolvers.Link,
  User: UserResolvers.User,
};
