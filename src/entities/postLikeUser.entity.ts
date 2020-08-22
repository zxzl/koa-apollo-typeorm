import { Entity, PrimaryColumn, getManager } from "typeorm";

@Entity()
export class PostLikesUser {
  @PrimaryColumn()
  public postId: number;

  @PrimaryColumn()
  public userId: number;

  /**
   * Methods
   */
  static findLikesByPostIds = async (postIds: string[]) => {
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
  };
}
