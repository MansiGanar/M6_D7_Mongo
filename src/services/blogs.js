import express from "express";
import createHttpError from "http-errors";
import BlogModel from "./schema.js";

const blogsRouter = express.Router();

blogsRouter.post("/", async (req, res, next) => {
  try {
    const newUser = new BlogModel(req.body); // here happens validation of req.body, if it is not ok Mongoose will throw an error (if it is ok user it is not saved in db yet)
    const { _id } = await newUser.save(); // this is the line in which the interaction with Mongo happens

    res.status(201).send({ _id });
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

blogsRouter.get("/:userId", async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const user = await BlogModel.findById(userId);
    if (user) {
      res.send(user);
    } else {
      next(createHttpError(404, `User with id ${userId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.put("/:userId", async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const updatedUser = await BlogModel.findByIdAndUpdate(userId, req.body, {
      new: true,
    }); // by default findByIdAndUpdate returns the document pre-update, if I want to retrieve the updated document, I should use new:true as an option
    if (updatedUser) {
      res.send(updatedUser);
    } else {
      next(createHttpError(404, `User with id ${userId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.delete("/:userId", async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const deletedUser = await BlogModel.findByIdAndDelete(userId);
    if (deletedUser) {
      res.status(204).send();
    } else {
      next(createHttpError(404, `User with id ${userId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

export default blogsRouter;
