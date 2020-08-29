import { getRepository } from "typeorm";
import { User } from "../entities/user.entity";

const UserRepository = {
  getUser: async (id) => {
    const user = await getRepository(User).findOne(id);
    return user;
  },
};

export default UserRepository;
