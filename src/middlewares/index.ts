import express from "express";
import { get, merge } from "lodash";
import { getUserBySessionToken } from "../db/user.schema";

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const sessionToken = req.cookies.sessionToken;
    if (!sessionToken) {
      return res.sendStatus(403);
    }
    const user = await getUserBySessionToken(sessionToken);
    if (!user) {
      return res.sendStatus(403);
    }
    merge(req, { user });
    return next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const isOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params;
    const currentUserId = get(req, "user.id");
    if (!currentUserId) {
      return res.sendStatus(400);
    }
    if (currentUserId !== id) {
      return res.sendStatus(403);
    }
    return next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
