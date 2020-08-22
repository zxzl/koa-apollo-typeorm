import { createApp } from "../app";
import { createConnection, getConnection } from "typeorm";
import { testConnection } from "../connections";
import { createFakeUser } from "../entities/_faker";

describe("/api/users CRUD", () => {
  let request;
  let server;

  beforeAll(async () => {
    await createConnection(testConnection);
    const app = createApp();
    server = app.listen();
    request = require("supertest").agent(server);
  });

  it("should return no users at the beginning", async () => {
    const resp = await request.get("/api/users");
    expect(resp.body).toHaveLength(0);
  });

  describe("With some users", () => {
    beforeAll(async () => {
      await request
        .post("/api/users")
        .send(createFakeUser())
        .set("Accept", "application/json");
      await request
        .post("/api/users")
        .send(createFakeUser())
        .set("Accept", "application/json");
    });

    it("should list users", async () => {
      const resp = await request.get("/api/users");
      expect(resp.body).toHaveLength(2);
    });

    it("should provide user by id", async () => {
      const resp = await request.get("/api/users");
      const user0 = resp.body[0];
      const id = user0.id;

      const userListResp = await request.get(`/api/users/${id}`);
      expect(userListResp.body).toMatchObject(user0);
    });

    it("should delete user by id", async () => {
      const resp = await request.get("/api/users");
      const user0 = resp.body[0];
      const id = user0.id;

      await request.delete(`/api/users/${id}`);
      const resp2 = await request.get("/api/users");
      expect(resp2.body).toHaveLength(1);
    });

    it("should negate new user without invalid email", async () => {
      const mockUser = createFakeUser();
      mockUser.email = "hi";
      const resp = await request
        .post("/api/users")
        .send(mockUser)
        .set("Accept", "application/json");
      expect(resp.status).toBeGreaterThanOrEqual(400);
    });
  });

  afterAll(async () => {
    await getConnection().close();
    server.close();
  });
});
