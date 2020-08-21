import { createApp } from "../app";
import { createConnection, getConnection, getRepository } from "typeorm";
import { User } from "../entities/user.entity";
import { Photo } from "../entities/photo.entity";
import { testConnection } from "../db/connections";
import { createFakeUser, createFakePhoto } from "../utils/faker";

describe("/api/users/:id with photos", () => {
  let request;
  let server;

  beforeAll(async () => {
    await createConnection(testConnection);
    const app = createApp();
    server = app.listen();
    request = require("supertest").agent(server);
  });

  describe("With photo", () => {
    it("should provide users photo as well", async () => {
      const photoRepository = getRepository(Photo);
      const userRepository = getRepository(User);

      const user = userRepository.create(createFakeUser());
      await userRepository.save(user);
      const userId = user.id;

      const photo = photoRepository.create(createFakePhoto());
      photo.user = user;
      await photoRepository.save(photo);

      const userResponse = await request.get(`/api/users/${userId}`);
      expect(userResponse.body.photos).toHaveLength(1);
      expect(userResponse.body.photos[0].id).toBe(photo.id);
    });
  });

  afterAll(async () => {
    await getConnection().close();
    server.close();
  });
});
