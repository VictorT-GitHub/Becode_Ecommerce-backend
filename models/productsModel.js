const mongoose = require("mongoose");

const ProductsModel = mongoose.model("products", {
  title: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  rating: {
    rate: {
      type: Number,
    },
    count: {
      type: Number,
    },
  },
});

module.exports = { ProductsModel };
