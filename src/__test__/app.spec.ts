// const request = require("supertest");
// const app = require("../index");

import { createApp } from "../app";
import { createConnection, getConnection } from "typeorm";
import * as request from "supertest";
import * as faker from "faker";

const createUser = () => {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
  };
};

describe("app test", () => {
  let app;

  beforeAll(async () => {
    await createConnection({
      type: "sqlite",
      database: ":memory:",
      entities: ["src/entity/*.ts"],
      dropSchema: true,
      synchronize: true,
    });
    app = createApp();
  });

  it("should return no users at the beginning", async () => {
    const resp = await request(app).get("/users");
    expect(resp.body).toHaveLength(0);
  });

  describe("handle data", () => {
    beforeAll(async () => {
      await request(app)
        .post("/users")
        .send(createUser())
        .set("Accept", "application/json");
      await request(app)
        .post("/users")
        .send(createUser())
        .set("Accept", "application/json");
    });

    it("should list users", async () => {
      const resp = await request(app).get("/users");
      expect(resp.body).toHaveLength(2);
    });

    it("should provide user by id", async () => {
      const resp = await request(app).get("/users");
      const user0 = resp.body[0];
      const id = user0.id;

      const userListResp = await request(app).get(`/users/${id}`);
      expect(userListResp.body).toMatchObject(user0);
    });

    it("should delete user by id", async () => {
      const resp = await request(app).get("/users");
      const user0 = resp.body[0];
      const id = user0.id;

      await request(app).delete(`/users/${id}`);
      const resp2 = await request(app).get("/users");
      expect(resp2.body).toHaveLength(1);
    });

    it("should negate new user without invalid email", async () => {
      const mockUser = createUser();
      mockUser.email = "hi";
      const resp = await request(app)
        .post("/users")
        .send(mockUser)
        .set("Accept", "application/json");
      expect(resp.status).toBeGreaterThanOrEqual(400);
    });
  });

  afterAll(async () => await getConnection().close());
});
