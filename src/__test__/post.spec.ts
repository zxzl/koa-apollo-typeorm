import { createApp } from "../app";
import { createConnection, getConnection, getRepository } from "typeorm";
import { User } from "../entities/user.entity";
import { testConnection } from "../db/connections";
import { createFakeUser, createFakePost } from "../utils/faker";
import { Post } from "../entities/post.entity";

describe("/api/users/:id/posts", () => {
  let request;
  let server;

  beforeAll(async () => {
    await createConnection(testConnection);
    const app = createApp();
    server = app.listen();
    request = require("supertest").agent(server);
  });

  describe("With post", () => {
    it("should provide users their posts as well", async () => {
      const userRepository = getRepository(User);

      const user = userRepository.create(createFakeUser());
      await userRepository.save(user);
      const userId = user.id;
      const postRepository = getRepository(Post);

      const post = postRepository.create(createFakePost());
      post.author = user;
      await postRepository.save(post);

      const userResponse = await request.get(`/api/users/${userId}/posts`);
      expect(userResponse.body).toHaveLength(1);
      expect(userResponse.body[0].id).toBe(post.id);
    });
  });

  afterAll(async () => {
    await getConnection().close();
    server.close();
  });
});
