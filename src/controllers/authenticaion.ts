import express from "express";
import { getUserByEmail, createUser } from "../db/user.schema";
import { random, authentication } from "../utils";

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

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.sendStatus(400);
    }
    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password" // ! Since we set select to false in the schema, we need to explicitly select it
    );
    if (!user || !user.authentication) {
      return res.sendStatus(404);
    }
    const expectedHash = authentication(user.authentication.salt, password);
    if (user.authentication.password !== expectedHash) {
      return res.sendStatus(403);
    }
    const salt = random();
    const sessionToken = authentication(salt, random());
    user.authentication.sessionToken = sessionToken;
    await user.save();
    res.cookie("sessionToken", sessionToken);
    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
