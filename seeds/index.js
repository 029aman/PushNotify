const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Customer = require("../models/customer");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.set("strictQuery", false);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

const seedDB = async () => {
  await Customer.deleteMany({});

  for (let i = 0; i < 5; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Customer({
      author: "63df8a3488d3ae684e6ad885",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quidem porro perferendis, ad sequi culpa est aspernatur odio officia modi voluptas velit voluptatibus facere corrupti minus natus tenetur, sint animi repudiandae veniam facilis suscipit! Rerum enim odio labore assumenda quidem suscipit excepturi, cupiditate nihil exercitationem? Inventore cum animi officiis est non!",
      price: price,
      images: [
        {
          url: "https://res.cloudinary.com/dg9tkwbcn/image/upload/v1675787761/PushNotify/lltrmfrbwneqsjexykjq.jpg",
          filename: "PushNotify/lltrmfrbwneqsjexykjq",
        },
        {
          url: "https://res.cloudinary.com/dg9tkwbcn/image/upload/v1675787761/PushNotify/d2vctvuhqnkzvanncs2s.jpg",
          filename: "PushNotify/d2vctvuhqnkzvanncs2s",
        },
      ],
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
