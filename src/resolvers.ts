import { getRepository } from "typeorm";
import { Post } from "./entities/post.entity";
import { PostLikesUser } from "./entities/postLikeUser.entity";

export const resolvers = {
  Query: {
    posts: async () => {
      const limit = 10;
      const postRepository = getRepository(Post);
      const posts = await postRepository
        .createQueryBuilder("post")
        .take(limit)
        .getMany();

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
      const likes = await PostLikesUser.findLikesByPostIds([post.id]);
      if (Array.isArray(likes) && likes.length > 0) {
        return likes[0].count;
      }
      return 0;
    },
  },
};
