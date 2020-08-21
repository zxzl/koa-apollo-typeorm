const Koa = require("koa");
var bodyParser = require("koa-bodyparser");

import users from "./routes/users";
import Router = require("koa-router");

export const createApp = () => {
  const app = new Koa();
  const router = new Router();
  router.use("/users", users.routes());

  app.use(bodyParser()).use(router.routes()).use(router.allowedMethods());

  return app;
};
