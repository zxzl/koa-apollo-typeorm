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
  @ManyToOne((type) => User, (user) => user.posts, {
    nullable: false,
  })
  author: User;

  @OneToMany((type) => Photo, (photo) => photo.post)
  photos: Photo[];

  /**
   * Methods
   */
  static getPostsByAuthorId = async (authorId: string) => {
    const manager = getManager();

    const posts = await manager.query(
      `SELECT id, body, authorId
      FROM post
      WHERE authorId = '${authorId}'
      `
    );

    return posts;
  };

  static getPosts = async (limit: number, skip: number) => {
    const manager = getManager();

    const posts = await manager.query(
      `SELECT id, body, authorId
      FROM post
      ORDER BY id DESC
      LIMIT ${limit}
      OFFSET ${skip}
      `
    );

    return posts;
  };
}
