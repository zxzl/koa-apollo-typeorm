import { ConnectionOptions } from "typeorm";

export const testConnection: ConnectionOptions = {
  type: "sqlite",
  database: ":memory:",
  entities: ["src/entities/**/*.entity.ts"],
  dropSchema: true,
  synchronize: true,
};
