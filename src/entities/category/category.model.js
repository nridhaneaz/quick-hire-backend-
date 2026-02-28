import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    // required
    name: { type: String, required: true, trim: true },

    // required for UI icon/image
    image: { type: String, default: "" }, // cloudinary url

    isActive: { type: Boolean, default: true },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

const Category =
  mongoose.models.Category || mongoose.model("Category", CategorySchema);

export default Category;
