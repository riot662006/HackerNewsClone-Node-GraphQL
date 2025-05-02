import { Link as LinkType } from "../types.js";

export const Link = {
  id: (parent: LinkType) => parent.id,
  description: (parent: LinkType) => parent.description,
  url: (parent: LinkType) => parent.url,
};
