import { createApp } from "../app";
import { createConnection, getConnection, getRepository } from "typeorm";
import { createFakeUser, User } from "../entities/user.entity";
import { Photo, createFakePhoto } from "../entities/photo.entity";
import { testConnection } from "../db/connections";

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

    describe("With photo", () => {
      it("should provide users photo as well", async () => {
        const resp = await request.get("/api/users");
        const user0 = resp.body[0];
        const id = user0.id;

        const photoRepository = getRepository(Photo);
        const userRepository = getRepository(User);
        const photo = await photoRepository.create(createFakePhoto());
        photo.user = await userRepository.findOne(id);
        await photoRepository.save(photo);

        const resp2 = await request.get(`/api/users/${id}`);
        expect(resp2.body.photos).toHaveLength(1);
      });
    });
  });

  afterAll(async () => {
    await getConnection().close();
    server.close();
  });
});
