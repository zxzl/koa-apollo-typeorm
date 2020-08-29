import { createConnection, getRepository } from "typeorm";
import { Photo } from "../../entities/photo.entity";
import { createFakePhoto } from "../../entities/_faker";
import { Post } from "../../entities/post.entity";
import * as _ from "lodash";

createConnection().then(async () => {
  const photoRepository = getRepository(Photo);
  const postRepository = getRepository(Post);

  const posts = await postRepository.find();

  let photos = [];

  for (let post of posts) {
    const numPhotos = _.random(1, 10);
    for (let i = 0; i < numPhotos; i++) {
      const photo = photoRepository.create(createFakePhoto());
      photo.post = post;
      photos.push(photo);
    }

    if (photos.length > 10000) {
      console.log(`inserting ${photos.length} photos`);
      await photoRepository
        .createQueryBuilder()
        .insert()
        .into(Photo)
        .values(photos)
        .execute();
      photos = [];
    }
  }

  return process.exit(0);
});
