import express from "express";
import createHttpError from "http-errors";
import BlogModel from "./schema.js";

const blogsRouter = express.Router();

blogsRouter.post("/", async (req, res, next) => {
  try {
    const newBlog = new BlogModel(req.body);
    const { _id } = await newBlog.save();

    res.status(201).send(newBlog);
  } catch (error) {
    next(error);
  }
});

blogsRouter.get("/", async (req, res, next) => {
  try {
    const users = await BlogModel.find();
    res.send(users);
  } catch (error) {
    next(error);
  }
});

blogsRouter.get("/:blogId", async (req, res, next) => {
  try {
    const blogId = req.params.blogId;

    const user = await BlogModel.findById(blogId);
    if (user) {
      res.send(user);
    } else {
      next(createHttpError(404, `User with id ${blogId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.put("/:blogId", async (req, res, next) => {
  try {
    const blogId = req.params.blogId;
    const updatedUser = await BlogModel.findByIdAndUpdate(blogId, req.body, {
      new: true,
    });
    if (updatedUser) {
      res.send(updatedUser);
    } else {
      next(createHttpError(404, `User with id ${blogId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.delete("/:blogId", async (req, res, next) => {
  try {
    const blogId = req.params.blogId;
    const deletedUser = await BlogModel.findByIdAndDelete(blogId);
    if (deletedUser) {
      res.status(204).send();
    } else {
      next(createHttpError(404, `User with id ${blogId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

export default blogsRouter;
