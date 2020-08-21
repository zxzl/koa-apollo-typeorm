import * as Koa from "koa";
import * as bodyParser from "koa-bodyparser";

import api from "./routes/api";
import * as Router from "koa-router";

export const createApp = () => {
  const app = new Koa();
  const router = new Router();
  router.use("/api", api.routes());

  app.use(bodyParser()).use(router.routes()).use(router.allowedMethods());

  return app;
};
