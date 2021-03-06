import mongoose from "mongoose";

const { Schema, model } = mongoose;

const blogSchema = new Schema(
  {
    category: { type: String, required: true },
    title: { type: String, required: true },
    cover: { type: String, required: true },
    readTime: { value: { type: Number }, unit: { type: Number } },
    comment: [
      {
        text: { type: String },
        commentsDate: { type: Date },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default model("Blog", blogSchema);
