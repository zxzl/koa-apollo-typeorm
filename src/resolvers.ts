import { getRepository } from "typeorm";
import { Post } from "./entities/post.entity";
import { likesLoader } from "./dataloader";
import { User } from "./entities/user.entity";

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

    postsByAuthor: async (_, { authorId }) => {
      const posts = await Post.getPostsByAuthorId(authorId);
      return posts;
    },

    user: async (_, { id }) => {
      const user = await getRepository(User).findOne(id);
      return user;
    },
  },

  Post: {
    likes: async (post) => {
      const likes = await likesLoader.load(post.id);
      return likes.count;
    },
  },
};
