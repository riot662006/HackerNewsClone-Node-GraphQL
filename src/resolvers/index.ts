import LinkResolvers from "./Link/index.js";
import BaseResolvers from "./Base.js";
import AuthResolvers from "./Auth/index.js";
import UserResolvers from "./User/index.js";
import VoteResolvers from "./Vote/index.js";
import FeedResolvers from "./Feed/index.js";

export const resolvers = {
  Query: {
    ...BaseResolvers.Query,
    ...FeedResolvers.Query,
    ...AuthResolvers.Query,
  },
  Mutation: {
    ...BaseResolvers.Mutation,
    ...LinkResolvers.Mutation,
    ...AuthResolvers.Mutation,
    ...VoteResolvers.Mutation,
  },
  Subscription: {
    ...BaseResolvers.Subscription,
    ...LinkResolvers.Subscription,
  },
  Link: LinkResolvers.Link,
  User: UserResolvers.User,
  Vote: VoteResolvers.Vote,
};
