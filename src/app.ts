import * as Koa from "koa";
import * as bodyParser from "koa-bodyparser";
import * as Router from "koa-router";

const { ApolloServer } = require("apollo-server-koa");

import api from "./routes/api";
import { resolvers } from "./resolvers";
import { typeDefs } from "./typeDefs";

export const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

export const createApp = () => {
  const app = new Koa();

  const router = new Router();
  router.use("/api", api.routes());

  app
    .use(bodyParser())
    .use(router.routes())
    .use(router.allowedMethods())
    .use(apolloServer.getMiddleware());

  return app;
};
