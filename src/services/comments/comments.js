import express from "express";
import CommentsModel from "./commentsSchema.js";

const commentsRouter = express.Router();

commentsRouter.post("/", async (req, res, next) => {
  try {
    const newcomment = new CommentsModel(req.body);
    await newcomment.save();
    res.send(newcomment);
  } catch (error) {
    next(error);
  }
});

commentsRouter.get("/", async (req, res, next) => {
  try {
    const comments = await CommentsModel.find();
    res.send(comments);
  } catch (error) {
    next(error);
  }
});

commentsRouter.get("/:commentsId", async (req, res, next) => {
  try {
    const commentsId = req.params.commentsId;

    const comment = await CommentsModel.findById(commentsId);
    if (comment) {
      res.send(comment);
    } else {
      next(createHttpError(404, `blog with id ${commentsId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

commentsRouter.put("/:commentsId", async (req, res, next) => {
  try {
    const commentsId = req.params.commentsId;
    const updatedComment = await CommentsModel.findByIdAndUpdate(
      commentsId,
      req.body,
      {
        new: true,
      }
    );
    if (updatedComment) {
      res.send(updatedComment);
    } else {
      next(createHttpError(404, `User with id ${commentsId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

commentsRouter.delete("/:commentsId", async (req, res, next) => {
  try {
    const commentsId = req.params.commentsId;
    const deletedComment = await CommentsModel.findByIdAndDelete(commentsId);
    if (deletedComment) {
      res.status(204).send();
    } else {
      next(createHttpError(404, `User with id ${commentsId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

export default commentsRouter;
