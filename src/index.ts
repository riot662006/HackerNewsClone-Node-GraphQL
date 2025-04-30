import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFileSync } from "fs";
import { PrismaClient } from "../generated/prisma/index.js";
import { prisma } from "./utils/prisma.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface Context {
  prisma: PrismaClient;
}

type Link = {
  id: string;
  url: string;
  description: string;
};

const links: [Link] = [
  {
    id: "link-0",
    url: "www.howtographql.com",
    description: "Fullstack tutorial for GraphQL",
  },
];

const resolvers = {
  Query: {
    info: () => `This is the API for a Hackernews Clone`,
    feed: () => links,
  },

  Mutation: {
    post: (parent: any, args: { url: string; description: string }) => {
      const link = {
        id: `link-${links.length}`,
        description: args.description,
        url: args.url,
      };
      links.push(link);
      return link;
    },
    updateLink: (
      parent: any,
      args: { id: string; url: string; description: string }
    ) => {
      const linkIndex = links.findIndex((link) => link.id === args.id);
      if (linkIndex === -1) {
        throw new Error("Link not found");
      }
      const updatedLink = {
        ...links[linkIndex],
        url: args.url ?? links[linkIndex].url,
        description: args.description ?? links[linkIndex].description,
      };
      links[linkIndex] = updatedLink;
      return updatedLink;
    },
    deleteLink: (parent: any, args: { id: string }) => {
      const linkIndex = links.findIndex((link) => link.id === args.id);
      if (linkIndex === -1) {
        throw new Error("Link not found");
      }
      const deletedLink = links[linkIndex];
      links.splice(linkIndex, 1);
      return deletedLink;
    },
  },

  Link: {
    id: (parent: Link) => parent.id,
    description: (parent: Link) => parent.description,
    url: (parent: Link) => parent.url,
  },
};

// get schema from schema.graphql file

const server = new ApolloServer<Context>({
  typeDefs: readFileSync(
    join(__dirname, "..", "src", "schema.graphql"),
    "utf-8"
  ),
  resolvers,
  plugins: [
    {
      async requestDidStart({ contextValue }) {
        if (process.env.NODE_ENV === "production") {
          return {
            async willSendResponse() {
              if (contextValue.prisma) {
                await contextValue.prisma.$disconnect();
                console.log("Disconnected from Prisma Client");
              }
            },
          };
        }
      },
    },
  ],
});

const { url } = await startStandaloneServer<Context>(server, {
  listen: { port: 4000 },
  context: async () => {
    return { prisma };
  },
});

console.log(`🚀  Server ready at: ${url}`);
