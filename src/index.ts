import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
// ? Dotenv import and config
import * as dotenv from "dotenv";
dotenv.config();
// ? End of Dotenv import and config

const app = express();

// * CORS : Cross-Origin Resource Sharing (CORS) is a security feature that restricts what resources a web page can request from another origin.
app.use(
  cors({
    credentials: true,
  })
);

// * Compression: Compression is a simple, effective way to save bandwidth and speed up your site.
app.use(compression());

// * Cookie Parser: Parse Cookie header and populate req.cookies with an object keyed by the cookie names.
app.use(cookieParser());

// * Body Parser: Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(8080, () => {
  console.log("Server is running on port 8080");
});
mongoose.Promise = Promise;
mongoose.connect(process.env.MONGO_URI as string);
mongoose.connection.on("error", (error: Error) => {
  console.log(error);
});
