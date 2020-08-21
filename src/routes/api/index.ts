import Router = require("koa-router");
import users from "./users";

const router = new Router();
router.use("/users", users.routes());

export default router;
