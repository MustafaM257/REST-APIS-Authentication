import express from "express";
import { getUserByEmail, createUser } from "db/user.schema";
import { random, authentication } from "utils";
export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      return res.sendStatus(400);
    }
    const userExists = await getUserByEmail(email);
    if (userExists) {
      return res.sendStatus(409);
    }
    const salt = random();
    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });
    return res.status(201).json(user).end();
    // await createUser({ email, password, username });
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
