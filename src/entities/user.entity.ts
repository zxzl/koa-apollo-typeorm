import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
} from "typeorm";
import { IsEmail, validateOrReject } from "class-validator";
import { Photo } from "./photo.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
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
  @OneToMany((type) => Photo, (photo) => photo.user)
  photos: Photo[];
}
