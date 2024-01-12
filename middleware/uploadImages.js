const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const storage = multer.diskStorage({
    // goal folder 
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../public/images/"));
    },
    // create name for img be uploaded
    filename: function (req, file, cb) {
        const uniquesuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        // callback func
        cb(null, file.fieldname + "-" + uniquesuffix + ".jpeg");
    },
});

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb({ message: "Unsupported file format" }, false);
    }
};

// Định nghĩa hàm middleware để thay đổi kích thước và chất lượng ảnh
const productImgResize = (req, res, next) => {
  if (!req.files) return next();
  Promise.all(
    req.files.map(async (file) => {
      await sharp(file.path)
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/images/products/${file.filename}`);
      fs.unlinkSync(file.path);
    })
  )
    .then(() => next())
    .catch((error) => next(error));
};

module.exports = { productImgResize };