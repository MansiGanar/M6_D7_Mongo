import express from "express";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import blogsRouter from "./services/blogs/blog.js";
import commentsRouter from "./services/comments/comments.js";

const server = express();
const port = process.env.PORT || 3001;
server.use(cors());
server.use(express.json());

server.use("/blogs", blogsRouter);
server.use("/comments", commentsRouter);

mongoose.connect(process.env.MONGO_CONNECTION);

mongoose.connection.on("connected", () => {
  console.log("Connected to Mongo!");

  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`Server running on port ${port}`);
  });
});

mongoose.connection.on("error", (err) => {
  console.log(err);
});
