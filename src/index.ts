import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFileSync } from "fs";
import { prisma } from "./db/prisma.js";

import { IContext } from "./types.js";
import { resolvers } from "./resolvers/index.js";
import { getUserId } from "./utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// get schema from schema.graphql file
// resolvers from resolvers/index.ts

const server = new ApolloServer<IContext>({
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

const { url } = await startStandaloneServer<IContext>(server, {
  listen: { port: 4000 },
  context: async ({req}) => {
    return {
      prisma,
      userId: req.headers.authorization ? getUserId(req) : null,
      req,
    };
  },
});

console.log(`🚀  Server ready at: ${url}`);
