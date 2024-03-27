import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter the product name"],
      maxLength: [200, "Product name cannot exceed 200 characters"],
    },

    price: {
      type: Number,
      required: [true, "Please enter the price"],
      maxLength: [5, "Product price cannot exceed 5 digits"],
    },

    description: {
      type: String,
      required: [true, "Please enter the product description"],
    },

    ratings: {
      type: Number,
      default: 0,
    },

    images: [
      {
        public_id: String,
        url: String,
      },
    ],

    category: {
      type: String,
      required: [true, "Please select product category"],
      enum: {
        values: [
          "Laptops",
          "Cameras",
          "Electronics",
          "Accessories",
          "Headphones",
          "Food",
          "Books",
          "Sports",
          "Home",
        ],
        message: "Please select correct category",
      },
    },

    seller: {
      type: String,
      required: [true, "Please enter the seller description"],
    },

    stock: {
      type: Number,
      required: [true, "Please enter product stock"],
    },

    numOfReviews: {
      type: Number,
      default: 0,
    },

    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },

        rating: {
          type: Number,
          required: true,
        },

        comment: {
          type: String,
          required: true,
        },
      },
    ],

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
