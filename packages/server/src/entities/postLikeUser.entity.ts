import { Entity, PrimaryColumn, getManager } from "typeorm";

@Entity()
export class PostLikesUser {
  @PrimaryColumn()
  public postId: number;

  @PrimaryColumn()
  public userId: number;
}
