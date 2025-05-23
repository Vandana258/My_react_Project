const db = require('../models');

exports.create = async (req, res) => {
  try {
    const { quoteRequestId, name, quantity,unitOfMeasurement,category } = req.body;
    let image = "";
    if (req.fileLocation !== "undefined" || req.fileLocation !== null) {
      image = req.fileLocation;
    }

    const newItem = await db.items.create({
      name,
      quoteRequestId,
      quantity,
      unitOfMeasurement,
      category,
      image
    });

    res.status(200).send({
      success: true,
      message: "Item created successfully!",
      data: newItem
    });

  } catch (err) {
    console.error("Create Error:", err);
    res.status(500).send({
      success: false,
      message: "Error while creating item.",
    });
  }
};