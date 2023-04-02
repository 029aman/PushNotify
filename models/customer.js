const mongoose = require("mongoose");
const Notification = require("./notification");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const CustomerSchema = new Schema({
  title: String,
  images: [ImageSchema],
  price: Number,
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  notifications: [
    {
      type: Schema.Types.ObjectId,
      ref: "Notification",
    },
  ],
  company: [
    {
      type: String,
    },
  ],
});

CustomerSchema.post("findOneAndDelete", async (doc) => {
  if (doc) {
    await Notification.deleteMany({
      _id: {
        $in: doc.notifications,
      },
    });
  }
});

module.exports = mongoose.model("Customer", CustomerSchema);
