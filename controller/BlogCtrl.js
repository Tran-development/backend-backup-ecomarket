const express = require("express");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Shop = require("../model/shop");
const Blog = require("../model/blog");
const ErrorHandler = require("../utils/ErrorHandler");
const { isSeller, isAdmin, isAuthenticated } = require("../middleware/auth");
const router = express.Router();
const cloudinary = require("cloudinary");

// create blog
router.post(
  "/create-blog",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shopId = req.body.shopId;
      const shop = await Shop.findById(shopId);
      if (!shop) {
        return next(new ErrorHandler("Shop Id is invalid!", 400));
      } else {
        let images = [];

        if (typeof req.body.images === "string") {
          images.push(req.body.images);
        } else {
          images = req.body.images;
        }

        const imagesLinks = [];

        for (let i = 0; i < images.length; i++) {
          const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "blogs",
          });

          imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
          });
        }

        const productData = req.body;
        productData.images = imagesLinks;
        productData.shop = shop;

        const blog = await Blog.create(productData);

        res.status(201).json({
          success: true,
          blog,
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// get all blogs
router.get("/get-all-blogs", async (req, res, next) => {
  try {
    const blogs = await Blog.find();
    res.status(201).json({
      success: true,
      blogs,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
});

// get all blogs of a shop
router.get(
  "/get-all-blogs/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const blogs = await Blog.find({ shopId: req.params.id });

      res.status(201).json({
        success: true,
        blogs,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// delete Blog of a shop
router.delete(
  "/delete-shop-blog/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const Blog = await Blog.findByIdAndDelete(req.params.id);

      if (!product) {
        return next(new ErrorHandler("Blog is not found with this id", 404));
      }    

      for (let i = 0; 1 < product.images.length; i++) {
        const result = await cloudinary.v2.uploader.destroy(
          Blog.images[i].public_id
        );
      }
    
      // await Blog.remove();

      res.status(201).json({
        success: true,
        message: "Blog Deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// all blogs --- for admin
router.get(
  "/admin-all-blogs",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const blogs = await Blog.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        blogs,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
