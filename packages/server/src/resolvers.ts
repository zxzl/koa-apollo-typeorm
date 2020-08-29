import PostService from "./servicies/post";
import UserService from "./servicies/user";

export const resolvers = {
  Query: {
    posts: async (_, { pageSize = 10, skip = 0 }) => {
      const posts = await PostService.getPosts(pageSize, skip);
      return posts;
    },

    post: async (_, { id }) => {
      const post = await PostService.getPost(id);
      return post;
    },

    postsByAuthor: async (_, { authorId }) => {
      const posts = await PostService.getPostsByAuthorId(authorId);
      return posts;
    },

    user: async (_, { id }) => {
      const user = await UserService.getUser(id);
      return user;
    },
  },

  Mutation: {
    likePost: async (_, { userId, postId }) => {
      await PostService.like(userId, postId);
      const count = await PostService.getLike(postId);
      return {
        success: true,
        postLikes: count,
      };
    },
    unlikePost: async (_, { userId, postId }) => {
      await PostService.unlike(userId, postId);
      const count = await PostService.getLike(postId);
      return {
        success: true,
        postLikes: count,
      };
    },
  },

  Post: {
    likes: async (post) => {
      const likes = await PostService.getLike(post.id);
      return likes;
    },
  },
};
