import * as Koa from "koa";
import * as bodyParser from "koa-bodyparser";

import users from "./routes/users";
import * as Router from "koa-router";

export const createApp = () => {
  const app = new Koa();
  const router = new Router();
  router.use("/users", users.routes());

  app.use(bodyParser()).use(router.routes()).use(router.allowedMethods());

  return app;
};
