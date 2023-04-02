const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, validateCustomer, isAuthor } = require("../middleware");
const customers = require("../controllers/customers");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router
  .route("/")
  .get(isLoggedIn, catchAsync(customers.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCustomer,
    catchAsync(customers.createCustomer)
  );

router.get("/new", isLoggedIn, customers.renderNewForm);

router
  .route("/:id")
  .get(catchAsync(customers.showCampgorund))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateCustomer,
    catchAsync(customers.updateCustomer)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(customers.deleteCustomer));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(customers.renderEditForm)
);

module.exports = router;
