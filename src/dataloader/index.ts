const DataLoader = require("dataloader");
import { PostLikesUser } from "../entities/postLikeUser.entity";

const batchLoadLikes = async (postIds: string[]) => {
  const likes = await PostLikesUser.findLikesByPostIds(postIds);
  return postIds.map((postId: string) => {
    const like = likes.find((l) => l.postId === postId);
    if (like) return like;

    return {
      postId: postId,
      count: 0,
    };
  });
};

export const likesLoader = new DataLoader(batchLoadLikes, { cache: false });
