import { getRepository } from "typeorm";
import { User } from "./entities/user.entity";
import { PostLikesUser } from "./entities/postLikeUser.entity";

import PostRepository from "./repositories/post";

export const resolvers = {
  Query: {
    posts: async (_, { pageSize = 10, skip = 0 }) => {
      const posts = await PostRepository.getPosts(pageSize, skip);
      return posts;
    },

    post: async (_, { id }) => {
      const post = await PostRepository.getPost(id);
      return post;
    },

    postsByAuthor: async (_, { authorId }) => {
      const posts = await PostRepository.getPostsByAuthorId(authorId);
      return posts;
    },

    user: async (_, { id }) => {
      const user = await getRepository(User).findOne(id);
      return user;
    },
  },

  Mutation: {
    likePost: async (_, { userId, postId }) => {
      const like = getRepository(PostLikesUser).create({
        userId,
        postId,
      });
      await getRepository(PostLikesUser).save(like);

      const count = await PostRepository.getLike(postId);
      return {
        success: true,
        postLikes: count,
      };
    },
    unlikePost: async (_, { userId, postId }) => {
      await getRepository(PostLikesUser).remove({
        postId,
        userId,
      });
      const count = await PostRepository.getLike(postId);
      return {
        success: true,
        postLikes: count,
      };
    },
  },

  Post: {
    likes: async (post) => {
      const likes = await PostRepository.getLike(post.id);
      return likes;
    },
  },
};
