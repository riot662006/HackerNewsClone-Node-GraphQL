import { Link as LinkType } from "../types.js";

import { Mutation } from "./mutation.js";
import { Query } from "./query.js";

const Link = {
  id: (parent: LinkType) => parent.id,
  description: (parent: LinkType) => parent.description,
  url: (parent: LinkType) => parent.url,
};

export const resolvers = {
  Query,
  Mutation,
  Link,
};
