import express from "express";
import { register } from "../controllers/authenticaion";
export default (router: express.Router) => {
  router.post("/auth/register", register);
};
