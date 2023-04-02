const Customer = require("../models/customer");
const Notification = require("../models/notification");

module.exports.createNotification = async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  const notification = new Notification(req.body.notification);
  notification.author = req.user._id;
  // console.log(notification);
  customer.notifications.push(notification);
  await notification.save();
  await customer.save();
  req.flash("success", "Successfully added a Notification");
  res.redirect(`/customers/${customer._id}`);
};

module.exports.deleteNotification = async (req, res) => {
  const { id, notificationID } = req.params;
  await Customer.findByIdAndUpdate(id, {
    $pull: { notifications: notificationID },
  });
  await Notification.findByIdAndDelete(notificationID);
  req.flash("success", "Successfully Deleted a Notification");
  res.redirect(`/customers/${id}`);
};

module.exports.updateNotification = async (req, res) => {
  const { id, notificationID } = req.params;
  const customer = await Customer.findById(id);
  customer.location = req.body.address;
  // console.log(customer.location);
  // console.log(req.body.address);
  await customer.save();
  await Customer.findByIdAndUpdate(id, {
    $pull: { notifications: notificationID },
  });
  await Notification.findByIdAndDelete(notificationID);
  req.flash("success", "Successfully Updated an Address");
  res.redirect(`/customers/${id}`);
};
