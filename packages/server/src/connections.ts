import { ConnectionOptions } from "typeorm";

export const testConnection: ConnectionOptions = {
  type: "mysql",
  host: "localhost",
  port: 3307,
  username: "root",
  password: "typeorm",
  database: "typeorm",
  entities: ["src/entities/**/*.entity.ts"],
  dropSchema: true,
  synchronize: true,
};
