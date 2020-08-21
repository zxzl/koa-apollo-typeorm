import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./user.entity";
import { Post } from "./post.entity";

@Entity()
export class Photo {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column()
  url: string;

  /**
   * Relations
   */
  @ManyToOne((type) => Post, (post) => post.photos, { nullable: false })
  post: Post;
}
