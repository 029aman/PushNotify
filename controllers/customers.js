const Customer = require("../models/customer");
const Notification = require("../models/notification");

const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
  const customers = await Customer.find({}).populate("author");
  res.render("customers/index", { customers });
};

module.exports.renderNewForm = (req, res) => {
  res.render("customers/new");
};

module.exports.createCustomer = async (req, res, next) => {
  const customer = new Customer(req.body.customer);
  customer.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  customer.author = req.user._id;
  if (customer.title.length == String(customer.author).length) {
    const addhar = await Customer.findById(customer.title);
    if (addhar) {
      addhar.company.push(customer._id);
      // console.log(addhar.company);
      // console.log(addhar);
      await addhar.save();
    }
  }
  await customer.save();
  // console.log(customer);
  req.flash("success", "Successfully made a new Customer");
  res.redirect(`/customers/${customer._id}`);
};

module.exports.showCampgorund = async (req, res) => {
  const customer = await Customer.findById(req.params.id)
    .populate({
      path: "notifications",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!customer) {
    req.flash("error", "Cannot Find that customer");
    return res.redirect("/customers");
  }
  res.render("customers/show", { customer });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const customer = await Customer.findById(id);
  if (!customer) {
    req.flash("error", "Cannot Find that customer");
    return res.redirect("/customers");
  }
  res.render("customers/edit", { customer });
};

module.exports.updateCustomer = async (req, res) => {
  const { id } = req.params;
  // console.log(req.body);
  const camp = await Customer.findById(id);
  const arrayCompany = camp.company;
  // console.log(arrayCompany);
  for (let i = 0; i < arrayCompany.length; i++) {
    const theCompany = await Customer.findById(arrayCompany[i]);
    if (theCompany) {
      // console.log(arrayCompany[i]);
      // console.log(theCompany);
      theCompany.notifications = [];
      const notification = new Notification({
        body: req.body.customer.location,
        rating: 1,
        author: theCompany.author,
      });
      // console.log(notification);
      theCompany.notifications.push(notification);
      // console.log(theCompany);
      await notification.save();
      await theCompany.save();
    }
  }
  const customer = await Customer.findByIdAndUpdate(id, {
    ...req.body.customer,
  });
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  customer.images.push(...imgs);
  await customer.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await customer.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  // console.log(customer);
  req.flash("success", `Successfully updated ${customer.title}`);
  res.redirect(`/customers/${id}`);
};

module.exports.deleteCustomer = async (req, res) => {
  const { id } = req.params;
  await Customer.findByIdAndDelete(id);
  req.flash("success", "Successfully Deleted a Customer");
  res.redirect("/customers");
};
