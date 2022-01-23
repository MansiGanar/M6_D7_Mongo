import express from "express";
import createHttpError from "http-errors";
import BlogModel from "./blogSchema.js";
import CommentsModel from "../comments/commentsSchema.js";

const blogsRouter = express.Router();

blogsRouter.post("/", async (req, res, next) => {
  try {
    const newBlog = new BlogModel(req.body);
    await newBlog.save();

    res.status(201).send(newBlog);
  } catch (error) {
    next(error);
  }
});

blogsRouter.get("/", async (req, res, next) => {
  try {
    const blog = await BlogModel.find();
    res.send(blog);
  } catch (error) {
    next(error);
  }
});

blogsRouter.get("/:blogId", async (req, res, next) => {
  try {
    const blogId = req.params.blogId;

    const blog = await BlogModel.findById(blogId);
    if (blog) {
      res.send(blog);
    } else {
      next(createHttpError(404, `blog with id ${blogId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.put("/:blogId", async (req, res, next) => {
  try {
    const blogId = req.params.blogId;
    const updatedBlog = await BlogModel.findByIdAndUpdate(blogId, req.body, {
      new: true,
    });
    if (updatedBlog) {
      res.send(updatedBlog);
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
    const deletedBlog = await BlogModel.findByIdAndDelete(blogId);
    if (deletedBlog) {
      res.status(204).send();
    } else {
      next(createHttpError(404, `User with id ${blogId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

// crud for comments inside the blogs

// POST

blogsRouter.post("/:blogsId/comments", async (req, res, next) => {
  try {
    const comment = await CommentsModel.findById(req.body.commentsId, {
      _id: 0,
    });
    // console.log(comment);
    if (comment) {
      const commentsToInsert = {
        ...comment.toObject(),
        commentsDate: new Date(),
      };
      // console.log(commentsToInsert);

      const modifiedBlogs = await BlogModel.findByIdAndUpdate(
        req.params.blogsId, // who
        { $push: { comment: commentsToInsert } }, // how
        { new: true }
      );
      console.log(modifiedBlogs);

      if (modifiedBlogs) {
        res.send(modifiedBlogs);
      } else {
        createHttpError(404, `Blog with id ${req.params.blogsId} not found!`);
      }
    } else {
      next(
        createHttpError(404, `Blog with id ${req.body.commentsId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

// GET

blogsRouter.get("/:blogsId/comments", async (req, res, next) => {
  try {
    const blog = await BlogModel.findById(req.params.blogsId);
    if (blog) {
      res.send({ comment: blog.comment });
    } else {
      next(
        createHttpError(404, `Blog with id ${req.body.commentsId} not found!`)
      );
    }
  } catch (error) {
    next(
      createHttpError(404, `Blog with id ${req.body.commentsId} not found!`)
    );
  }
});

// GET by id

blogsRouter.get("/:blogsId/comments/:commentsId", async (req, res, next) => {
  try {
    const blog = await BlogModel.findById(req.params.blogsId);
    if (blog) {
      const givenBlog = blog.comment.find(
        (comment) => comment._id.toString() === req.params.commentsId
      );
      if (givenBlog) {
        res.send(givenBlog);
      } else {
        next(
          createHttpError(
            404,
            `comments with id ${req.params.commentsId} not found!`
          )
        );
      }
    } else {
      next(
        createHttpError(404, `Blog with id ${req.params.blogsId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

// PUT

export default blogsRouter;
