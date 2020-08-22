import * as Koa from "koa";
import * as bodyParser from "koa-bodyparser";
const { ApolloServer } = require("apollo-server-koa");

import api from "./routes/api";
import * as Router from "koa-router";
import { resolvers } from "./resolvers";
import { typeDefs } from "./typeDefs";

export const createApp = () => {
  const app = new Koa();

  const router = new Router();
  router.use("/api", api.routes());

  const apolloServer = new ApolloServer({ typeDefs, resolvers });

  app
    .use(bodyParser())
    .use(router.routes())
    .use(router.allowedMethods())
    .use(apolloServer.getMiddleware());

  return app;
};
