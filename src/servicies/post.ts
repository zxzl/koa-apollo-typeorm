import { Post } from "../entities/post.entity";
import { getRepository, getManager } from "typeorm";
import { PostLikesUser } from "../entities/postLikeUser.entity";
const DataLoader = require("dataloader");

const PostRepository = {
  getPosts: async (pageSize, skip) => {
    const posts = await Post.getPosts(pageSize, skip);
    return posts;
  },
  getPost: async (id) => {
    const post = await getRepository(Post).findOne(id);
    return post;
  },

  getPostsByAuthorId: async (authorId) => {
    const posts = await Post.getPostsByAuthorId(authorId);
    return posts;
  },

  getLike: async (id) => {
    const likes = await likesLoader.load(id);
    return likes.count;
  },

  _getLikesByPostIds: async (
    postIds: string[]
  ): Promise<[{ postId: string; count: number }]> => {
    const manager = getManager();

    const joindPostIds = postIds.join(",");
    const likes = await manager.query(
      `SELECT postId, count(*) AS count
      FROM post_likes_user
      WHERE postId IN (${joindPostIds})
      GROUP BY postId
      `
    );

    return likes;
  },

  like: async (userId, postId) => {
    const like = getRepository(PostLikesUser).create({
      userId,
      postId,
    });
    await getRepository(PostLikesUser).save(like);
  },

  unlike: async (userId, postId) => {
    await getRepository(PostLikesUser).remove({
      postId,
      userId,
    });
  },
};

const batchLoadLikes = async (postIds: string[]) => {
  const likes = await PostRepository._getLikesByPostIds(postIds);
  return postIds.map((postId: string) => {
    const like = likes.find((l) => l.postId == postId);
    if (like) return like;

    return {
      postId: postId,
      count: 0,
    };
  });
};

const likesLoader = new DataLoader(batchLoadLikes, { cache: false });

export default PostRepository;
