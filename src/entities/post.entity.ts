import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  getManager,
} from "typeorm";
import { User } from "./user.entity";
import { Photo } from "./photo.entity";

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 2000 })
  body: string;

  /**
   * Relations
   */
  @ManyToOne((type) => User, (user) => user.posts, { nullable: false })
  author: User;

  @OneToMany((type) => Photo, (photo) => photo.post)
  photos: Photo[];

  /**
   * Methods
   */
  static findPostsByAuthorId = async (authorId: string) => {
    const manager = getManager();

    const posts = await manager.query(
      `SELECT id, body
      FROM post
      WHERE authorId = '${authorId}'
      `
    );

    const ids = posts.map((p) => `'${p.id}'`).join(",");
    const likes = await manager.query(
      `SELECT postId, count(*) AS count
      FROM post_likes_user
      WHERE postId IN (${ids})
      GROUP BY postId
      `
    );

    const postsWithLikes = posts.map((p) => ({
      ...p,
      likes: likes.find((l) => l.postId === p.id)?.count || 0,
    }));

    return postsWithLikes;
  };
}
