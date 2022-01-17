const mongoose = require("mongoose");

const CartsModel = mongoose.model("carts", {
  userid: {
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
        unique: true,
      },
      quantity: {
        type: Number,
      },
    },
  ],
});

module.exports = { CartsModel };
