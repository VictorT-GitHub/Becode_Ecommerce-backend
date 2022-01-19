const mongoose = require("mongoose");

const CartsModel = mongoose.model("carts", {
  userId: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  products: {
    type: [
      {
        productid: {
          type: String,
          // unique: true, // DONT WORK
          // required: true, // DONT WORK
        },
        quantity: Number,
      },
    ],
    // required: true, // DONT WORK FINE
  },
});

module.exports = { CartsModel };
