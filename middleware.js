const { customerSchema, notificationSchema } = require("./schemas.js");
const Customer = require("./models/customer");
const Notification = require("./models/notification");
const ExpressError = require("./utils/ExpressError");

module.exports.validateNotification = (req, res, next) => {
  const { error } = notificationSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be Signed In");
    return res.redirect("/login");
  }
  next();
};

module.exports.validateCustomer = (req, res, next) => {
  const { error } = customerSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const customer = await Customer.findById(id);
  if (!customer.author.equals(req.user._id)) {
    req.flash("error", "You Do not have permission");
    return res.redirect(`/customers/${id}`);
  }
  next();
};

module.exports.isNotificationAuthor = async (req, res, next) => {
  const { id, notificationID } = req.params;
  const notification = await Notification.findById(notificationID);
  if (!notification.author.equals(req.user._id)) {
    req.flash("error", "You Do not have permission");
    return res.redirect(`/customers/${id}`);
  }
  next();
};
