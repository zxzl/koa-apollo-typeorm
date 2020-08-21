import * as faker from "faker";

export const createFakeUser = () => {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
  };
};
export const createFakePhoto = () => {
  return {
    url: faker.image.image(),
  };
};
