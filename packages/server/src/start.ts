import { createApp } from "./app";
import { createConnection } from "typeorm";

createConnection().then(() => {
  const app = createApp();
  app.listen(3000);
});
