const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const notifications = require("../controllers/notifications");
const {
  validateNotification,
  isLoggedIn,
  isNotificationAuthor,
} = require("../middleware.js");

router.post(
  "/",
  isLoggedIn,
  validateNotification,
  catchAsync(notifications.createNotification)
);

router
  .route("/:notificationID")
  .delete(
    isLoggedIn,
    isNotificationAuthor,
    catchAsync(notifications.deleteNotification)
  )
  .put(
    isLoggedIn,
    isNotificationAuthor,
    catchAsync(notifications.updateNotification)
  );

module.exports = router;
