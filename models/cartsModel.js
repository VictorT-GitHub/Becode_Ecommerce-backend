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
  products: [
    {
      productId: {
        type: String,
      },
      quantity: {
        type: Number,
      },
    },
  ],
});

module.exports = { CartsModel };
