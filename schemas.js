const Joi = require("joi");

module.exports.customerSchema = Joi.object({
  customer: Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required().min(0),
    description: Joi.string().required(),
    location: Joi.string().required(),
  }).required(),
  deleteImages: Joi.array(),
});

module.exports.notificationSchema = Joi.object({
  notification: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required(),
  }).required(),
});
