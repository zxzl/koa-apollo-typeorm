import { createConnection, getRepository, getConnection } from "typeorm";
import { User } from "../entities/user.entity";
import { Photo } from "../entities/photo.entity";
import {
  createFakeUser,
  createFakePhoto,
  createFakePost,
} from "../utils/faker";
import { Post } from "../entities/post.entity";
import * as _ from "lodash";

createConnection().then(async () => {
  const userRepository = getRepository(User);
  const photoRepository = getRepository(Photo);
  const postRepository = getRepository(Post);

  for (let i = 0; i < 1000; i++) {
    i % 100 === 0 && console.log(`${i}th user`);

    const user = userRepository.create(createFakeUser());
    await userRepository.save(user);

    const posts = new Array(10).fill(0).map(() => {
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

    // for (let k = 0; k < 10; k++) {
    //   const post = postRepository.create(createFakePost());
    //   post.author = user;
    //   await postRepository.save(post);

    //   // for (let j = 0; j < 3; j++) {
    //   //   const photo = photoRepository.create(createFakePhoto());
    //   //   photo.post = post;
    //   //   await photoRepository.save(photo);
    //   // }
    // }
  }

  // like
  const users = await userRepository.find();
  const posts = await postRepository.find();

  for (let i = 0; i < 200000; i++) {
    i % 500 === 0 && console.log(`${i}th like`);
    const user = _.sample(users);
    const post = _.sample(posts);

    try {
      await getConnection()
        .createQueryBuilder()
        .relation(Post, "likes")
        .of(post)
        .add(user);
    } catch {
      // in case of duplication
    }
  }

  return process.exit(0);
});
