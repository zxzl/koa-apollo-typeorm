import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
} from "typeorm";
import { IsEmail, validateOrReject } from "class-validator";
import { Post } from "./post.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @IsEmail()
  @Column()
  email: string;

  @BeforeInsert()
  @BeforeUpdate()
  async validate(): Promise<void> {
    await validateOrReject(this);
  }

  /**
   * Relations
   */
  @OneToMany((type) => Post, (post) => post.author)
  posts: Post[];
}
