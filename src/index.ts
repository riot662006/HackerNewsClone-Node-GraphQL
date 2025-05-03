import express from "express";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { startStandaloneServer } from "@apollo/server/standalone";

import cors from "cors";
import http from "http";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { PubSub } from "graphql-subscriptions";
import { WebSocketServer } from "ws";

import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFileSync } from "fs";
import { prisma } from "./db/prisma.js";

import { IContext } from "./types.js";
import { resolvers } from "./resolvers/index.js";
import { getUserId } from "./utils.js";

import { useServer } from "graphql-ws/use/ws";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const schema = makeExecutableSchema({
  typeDefs: readFileSync(
    join(__dirname, "..", "src", "schema.graphql"),
    "utf-8"
  ),
  resolvers,
});

const pubsub = new PubSub();

const app = express();
const httpServer = http.createServer(app);

const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/subscriptions",
});

const serverCleanup = useServer(
  {
    schema,
    context: async (ctx) => {
      const { connectionParams } = ctx;
      const token =
        connectionParams?.Authorization || connectionParams?.authorization;
      const userId = token ? getUserId(token as string) : null;

      return {
        prisma,
        pubsub,
        userId,
      };
    },
  },
  wsServer
);

// get schema from schema.graphql file
// resolvers from resolvers/index.ts

const server = new ApolloServer<IContext>({
  schema,
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
      // Proper shutdown for the HTTP server.
    },
    ApolloServerPluginDrainHttpServer({ httpServer }),
    // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

await server.start();

app.use(
  "/graphql",
  cors<cors.CorsRequest>(),
  express.json(),
  expressMiddleware<IContext>(server, {
    context: async ({ req }) => ({
      prisma,
      pubsub,
      userId: req.headers.authorization ? getUserId(req) : null,
      req,
    }),
  })
);

httpServer.listen({ port: 4000 }, () => {
  console.log("🚀  Server ready at: http://localhost:4000/graphql");
});
