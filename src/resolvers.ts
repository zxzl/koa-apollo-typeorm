import { getRepository } from "typeorm";
import { Post } from "./entities/post.entity";
import { likesLoader } from "./dataloader";

export const resolvers = {
  Query: {
    posts: async (_, { pageSize = 10, skip = 0 }) => {
      const posts = await Post.getPosts(pageSize, skip);
      return posts;
    },

    post: async (_, { id }) => {
      const postRepository = getRepository(Post);

      const post = await postRepository.findOne(id);

      return post;
    },
  },

  Post: {
    likes: async (post) => {
      const likes = await likesLoader.load(post.id);
      return likes.count;
    },
  },
};
