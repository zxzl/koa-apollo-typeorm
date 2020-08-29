import { createConnection, getRepository, getConnection } from "typeorm";
import { User } from "../../entities/user.entity";
import { createFakeUser, createFakePost } from "../../entities/_faker";
import { Post } from "../../entities/post.entity";
import * as _ from "lodash";
import { PostLikesUser } from "../../entities/postLikeUser.entity";

createConnection().then(async () => {
  const userRepository = getRepository(User);
  const postRepository = getRepository(Post);
  const postLikesUserRepository = getRepository(PostLikesUser);

  for (let i = 0; i < 10000; i++) {
    i % 100 === 0 && console.log(`${i}th user`);

    const user = userRepository.create(createFakeUser());
    await userRepository.save(user);

    const posts = new Array(20).fill(0).map(() => {
      const post = postRepository.create(createFakePost());
      post.author = user;
      return post;
    });

    await postRepository
      .createQueryBuilder()
      .insert()
      .into(Post)
      .values(posts)
      .execute();
  }

  // like
  const users = await userRepository.find();
  const posts = await postRepository.find();

  let likes = [];

  for (let i = 0; i < 2000000; i++) {
    const user = _.sample(users);
    const post = _.sample(posts);

    likes.push(
      postLikesUserRepository.create({
        postId: post.id,
        userId: user.id,
      })
    );

    if (i % 500 === 0) {
      console.log(`${i}th like`);

      try {
        await postLikesUserRepository
          .createQueryBuilder()
          .insert()
          .into(PostLikesUser)
          .values(likes)
          .execute();
      } catch {
        // handle error from duplicate entry
      }

      likes = [];
    }
  }

  return process.exit(0);
});
