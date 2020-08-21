import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
} from "typeorm";
import { User } from "./user.entity";
import { Photo } from "./photo.entity";

@Entity()
export class Post {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column("varchar", { length: 2000 })
  body: string;

  /**
   * Relations
   */
  @ManyToOne((type) => User, (user) => user.posts, { nullable: false })
  author: User;

  @ManyToMany((type) => User)
  @JoinTable()
  likes: User[];

  @OneToMany((type) => Photo, (photo) => photo.post)
  photos: Photo[];
}
