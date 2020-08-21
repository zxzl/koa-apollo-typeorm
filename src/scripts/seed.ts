import { createConnection, getRepository } from "typeorm";
import { User, createFakeUser } from "../entities/user.entity";
import { Photo, createFakePhoto } from "../entities/photo.entity";

createConnection().then(async () => {
  const userRepository = getRepository(User);
  const photoRepository = getRepository(Photo);

  //@ts-ignore
  for (let i = 0; i < 10; i++) {
    const user = await userRepository.create(createFakeUser());
    await userRepository.save(user);

    for (let j = 0; j < 10; j++) {
      const photo = await photoRepository.create(createFakePhoto());
      photo.user = user;
      await photoRepository.save(photo);
    }
  }
  return process.exit(0);
});
