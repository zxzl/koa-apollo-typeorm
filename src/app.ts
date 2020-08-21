import * as express from "express";
import { Request, Response } from "express";
import { getRepository } from "typeorm";

import { User } from "./entity/user";

import users from "./routes/users";

export const createApp = () => {
  const app = express();
  app.use(express.json());
  app.use("/users", users);

  return app;
};
