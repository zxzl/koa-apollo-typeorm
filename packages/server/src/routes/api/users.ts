import * as Router from "koa-router";

import { getRepository } from "typeorm";

import { User } from "../../entities/user.entity";
import { Post } from "../../entities/post.entity";

const router = new Router();

router.get("/", async (ctx) => {
  const userRepository = getRepository(User);
  const users = await userRepository.find();
  ctx.body = users;
});

router.get("/:id", async (ctx) => {
  const userRepository = getRepository(User);
  const results = await userRepository.findOne(ctx.params.id);
  ctx.body = results;
});

router.get("/:id/posts", async (ctx) => {
  const { id } = ctx.params;
  const postsWithLikes = await Post.getPostsByAuthorId(id);
  ctx.body = postsWithLikes;
});

router.post("/", async (ctx) => {
  const userRepository = getRepository(User);
  try {
    //@ts-ignore
    const user = await userRepository.create(ctx.request.body);
    const results = await userRepository.save(user);
    ctx.body = results;
  } catch (e) {
    ctx.status = 400;
    ctx.body = e;
  }
});

router.put("/:id", async (ctx) => {
  const userRepository = getRepository(User);

  const user = await userRepository.findOne(ctx.params.id);
  //@ts-ignore
  userRepository.merge(user, ctx.request.body);
  const results = await getRepository(User).save(user);
  ctx.body = results;
});

router.delete("/:id", async (ctx) => {
  const userRepository = getRepository(User);

  const results = await userRepository.delete(ctx.params.id);
  ctx.body = results;
});

export default router;
