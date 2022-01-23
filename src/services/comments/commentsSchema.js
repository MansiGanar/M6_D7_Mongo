import mongoose from "mongoose";

const { Schema, model } = mongoose;

const commentsSchema = new Schema(
  {
    text: { type: String, required: true },
    commentsDate: { type: Date },
  },
  { timestamps: true }
);

export default model("Comments", commentsSchema);
