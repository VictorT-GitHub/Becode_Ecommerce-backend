const router = require("express").Router();
const ObjectID = require("mongoose").Types.ObjectId;

const { ProductsModel } = require("../models/productsModel.js");
const {
  checkAuthToken,
  checkIfAdmin,
} = require("../middleware/authMiddleware.js");

// GET all Products
router.get("/", (req, res) => {
  ProductsModel.find((err, data) => {
    if (err) res.status(400).send("GET products ERROR: " + err);
    else res.send(data);
  });
});

// GET one Product
router.get("/:id", (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ERROR productID unknow: " + req.params.id);
  }
  ProductsModel.findById(req.params.id, (err, data) => {
    if (err) res.status(400).send("GET product ERROR: " + err);
    else res.send(data);
  });
});

// POST new Product (ADMIN)
router.post("/", checkAuthToken, checkIfAdmin, (req, res) => {
  const newProduct = new ProductsModel({
    title: req.body.title,
    price: req.body.price,
    description: req.body.description,
    category: req.body.category,
    image: req.body.image,
    rating: req.body.rating,
  });

  newProduct.save((err, data) => {
    if (err) res.status(400).send(err);
    else res.status(201).send(data);
  });
});

// UPDATE Product (ADMIN)
router.put("/:id", checkAuthToken, checkIfAdmin, (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ERROR productID unknow: " + req.params.id);
  }

  const updateProduct = {
    title: req.body.title,
    price: req.body.price,
    description: req.body.description,
    category: req.body.category,
    image: req.body.image,
    rating: req.body.rating,
  };

  ProductsModel.findByIdAndUpdate(
    req.params.id,
    { $set: updateProduct },
    { new: true },
    (err, data) => {
      if (err) res.status(400).send("Update product ERROR: " + err);
      else res.send(data);
    }
  );
});

// DELETE Product (ADMIN)
router.delete("/:id", checkAuthToken, checkIfAdmin, (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ERROR productID unknow: " + req.params.id);
  }

  ProductsModel.findByIdAndDelete(req.params.id, (err, data) => {
    if (err) res.status(400).send("Delete product ERROR: " + err);
    else res.send(data);
  });
});

module.exports = router;
