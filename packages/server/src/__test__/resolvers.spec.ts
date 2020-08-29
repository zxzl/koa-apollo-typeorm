import { createApp } from "../app";
import { createConnection, getConnection, getRepository } from "typeorm";
import { User } from "../entities/user.entity";
import { testConnection } from "../connections";
import { createFakeUser, createFakePost } from "../entities/_faker";
import { Post } from "../entities/post.entity";

describe("/api/users/:id/posts", () => {
  let resolver, userRepository, postRepository;

  beforeAll(async () => {
    await createConnection(testConnection);
    resolver = require("../resolvers").resolvers;
    userRepository = getRepository(User);
    postRepository = getRepository(Post);
  });

  describe("Query", () => {
    it("user resolver should lookup user", async () => {
      const user = userRepository.create(createFakeUser());
      await userRepository.save(user);

      const resp = await resolver.Query.user({}, { id: user.id });
      expect(resp.id).toBe(user.id);
    });

    it("postsByAuthor resolver should lookup posts by author", async () => {
      const user = userRepository.create(createFakeUser());
      await userRepository.save(user);

      const post = postRepository.create(createFakePost());
      post.author = user;
      await postRepository.save(post);

      const resp = await resolver.Query.postsByAuthor(
        {},
        { authorId: user.id }
      );
      expect(resp).toHaveLength(1);
      expect(resp[0].authorId).toBe(user.id);
      expect(resp[0].id).toBe(post.id);
    });

    it("likesLoader should count like", async () => {
      const user = userRepository.create(createFakeUser());
      await userRepository.save(user);
      const post = postRepository.create(createFakePost());
      post.author = user;
      await postRepository.save(post);

      const likeBefore = await resolver.Post.likes({ id: post.id });
      expect(likeBefore).toBe(0);

      await resolver.Mutation.likePost(
        {},
        { userId: user.id, postId: post.id }
      );

      const likeAfter = await resolver.Post.likes({ id: post.id });
      expect(likeAfter).toBe(1);
    });
  });

  describe("Mutation", () => {
    let user, post;
    beforeAll(async () => {
      user = userRepository.create(createFakeUser());
      await userRepository.save(user);

      post = postRepository.create(createFakePost());
      post.author = user;
      await postRepository.save(post);
    });

    it("like should increase count", async () => {
      const likeBefore = await resolver.Post.likes({ id: post.id });

      const resp = await resolver.Mutation.likePost(
        {},
        { userId: user.id, postId: post.id }
      );
      expect(resp.postLikes).toBe(likeBefore + 1);
    });

    it("unlike should increase count", async () => {
      const likeBefore = await resolver.Post.likes({ id: post.id });

      const resp = await resolver.Mutation.unlikePost(
        {},
        { userId: user.id, postId: post.id }
      );
      expect(resp.postLikes).toBe(likeBefore - 1);
    });
  });
  afterAll(async () => {
    await getConnection().dropDatabase();
    await getConnection().close();
  });
});
