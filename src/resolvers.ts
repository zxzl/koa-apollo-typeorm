import { getRepository, AdvancedConsoleLogger } from "typeorm";
import { Post } from "./entities/post.entity";
import { likesLoader } from "./dataloader";
import { User } from "./entities/user.entity";
import { PostLikesUser } from "./entities/postLikeUser.entity";

export const resolvers = {
  Query: {
    posts: async (_, { pageSize = 10, skip = 0 }) => {
      const posts = await Post.getPosts(pageSize, skip);
      return posts;
    },

    post: async (_, { id }) => {
      const post = await getRepository(Post).findOne(id);
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

  Mutation: {
    like: async (_, { userId, postId }) => {
      const like = getRepository(PostLikesUser).create({
        userId,
        postId,
      });
      await getRepository(PostLikesUser).save(like);
      return {
        success: true,
      };
    },
    unlike: async (_, { userId, postId }) => {
      await getRepository(PostLikesUser).remove({
        postId,
        userId,
      });
      return {
        success: true,
      };
    },
  },

  Post: {
    likes: async (post) => {
      const likes = await likesLoader.load(post.id);
      return likes.count;
    },
  },
};
