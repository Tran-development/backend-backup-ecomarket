const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your event product name!"],
    },
    description: {
      type: String,
      required: [true, "Please enter your event product description!"],
    },
    category: {
      type: String,
      required: [true, "Please enter your event product category!"],
    },
    // start_Date: {
    //   type: Date,
    //   required: true,
    // },
    status: {
      type: String,
      default: "Running",
    },
    tags: {
      type: String,
    },
    images: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    shopId: {
      type: String,
      required: true,
    },
    shop: {
      type: Object,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    }
  });
//Export the model
module.exports = mongoose.model("Blog", blogSchema);