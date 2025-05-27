const db = require('../models');
const path = require("path");

//create
exports.create = async (req, res) => {
  try {
    const { name, role, phone } = req.body;
    let data = { name, role, phone };

    const protocol = req.headers["x-forwarded-proto"] || req.protocol;
    const host = req.headers["x-forwarded-host"] || req.headers["host"];
    const imgBaseUrl = `${protocol}://${host}/uploads/`;

    let image = "";
    if (req.fileLocation !== "undefined" || req.fileLocation !== null) {
      image = req.fileLocation;
    }
    if (req.file) {
      try {
        const originalName = path.parse(req.file.originalname).name;
        const extension = path.extname(req.file.originalname);
        const now = new Date();
        const date = now.toISOString().split('T')[0]; // YYYY-MM-DD
        const dateTime = `${date}`;
        const fileName = `${originalName}-${dateTime}${extension}`;
        // const fileName = `${req.userId}${path.extname(req.file.originalname)}`;
        data.image = fileName;
      } catch (error) {
        return res.status(500).send({
          success: false,
          message: `Failed to process uploaded file. Error: ${error.message}`,
        });
      }
    }
    const newItem = await db.items.create(data);
    res.status(200).send({
      success: true,
      message: "Item created successfully!",
      data: newItem,
      imgBaseUrl: imgBaseUrl
    });

  } catch (err) {
    console.error("Create Error:", err);
    res.status(500).send({
      success: false,
      message: "Error while creating item.",
    });
  }
};

// Get all items
exports.findAll = async (req, res) => {
  try {
    const items = await db.items.findAll();

    const protocol = req.headers["x-forwarded-proto"] || req.protocol;
    const host = req.headers["x-forwarded-host"] || req.headers["host"];
    const imgBaseUrl = `${protocol}://${host}/uploads/`;

    res.status(200).send({
      success: true,
      message: "Items fetched successfully",
      data: items,
      imgBaseUrl: imgBaseUrl
    });
  } catch (error) {
    console.error("FindAll Error:", error);
    res.status(500).send({
      success: false,
      message: "Failed to retrieve items"
    });
  }
};

//findone
exports.findOne = async (req, res) => {
  try {
    const id = req.query.id;

    const item = await db.items.findOne({ where: { id } });

    if (!item) {
      return res.status(404).send({
        success: false,
        message: "Item not found.",
      });
    }

    const protocol = req.headers["x-forwarded-proto"] || req.protocol;
    const host = req.headers["x-forwarded-host"] || req.headers["host"];
    const imgBaseUrl = `${protocol}://${host}/uploads/`;

    res.status(200).send({
      success: true,
      message: "Item fetched successfully!",
      data: item,
      imageUrl: item.image ? `${imgBaseUrl}${item.image}` : null
    });

  } catch (err) {
    console.error("FindOne Error:", err);
    res.status(500).send({
      success: false,
      message: "Error while fetching item.",
    });
  }
};

//update

// exports.update = async (req, res) => {
//   try {
//     const { id, ...updateData } = req.body;
//     if (!id) {
//       return res.status(400).send({ success: false, message: "ID is required." });
//     }
//     const existingItem = await db.items.findOne({ where: { id } });
//     if (!existingItem) {
//       return res.status(404).send({ success: false, message: "Item not found." });
//     }

//     const protocol = req.headers["x-forwarded-proto"] || req.protocol;
//     const host = req.headers["x-forwarded-host"] || req.headers["host"];
//     const imgBaseUrl = `${protocol}://${host}/uploads/`;

//     let image = "";
//     if (req.fileLocation !== "undefined" || req.fileLocation !== null) {
//       image = req.fileLocation;
//     }

//     if (req.file) {
//       try {
//         const originalName = path.parse(req.file.originalname);
//         const extension = path.extname(req.file.originalname);
//         const now = new Date();
//         const date = now.toISOString().split('T')[0]; // YYYY-MM-DD
//         const dateTime = `${date}`;
//         const fileName = `${originalName}-${dateTime}${extension}`;
//         // const fileName = `${req.userId}${path.extname(req.file.originalname)}`;
//         updateData.image = fileName;
//       } catch (error) {
//         return res.status(500).send({
//           success: false,
//           message: `Failed to process uploaded file. Error: ${error.message}`,
//         });
//       }
//     }
//     const [updated] = await db.items.update(updateData, { where: { id } });
//     if (updated) {
//       const updatedUser = await db.items.findOne({ where: { id } });
//       return res.status(200).send({ success: true, message: "Client has been updated successfully!", data: updatedUser, imgBaseUrl: imgBaseUrl });
//     }
//     return res.status(200).send({ success: true, message: "No changes were made to the client." });

//   } catch (err) {
//     console.error("Error updating user:", err);
//     return res.status(500).send({ success: false, message: "An error occurred while updating the user.", error: err.message });
//   }
// };

exports.update = async (req, res) => {
  try {
    const { id, ...updateData } = req.body;
    if (!id) {
      return res.status(400).send({ success: false, message: "ID is required." });
    }
    const existingItem = await db.items.findOne({ where: { id } });
    if (!existingItem) {
      return res.status(404).send({ success: false, message: "Item not found." });
    }

    const protocol = req.headers["x-forwarded-proto"] || req.protocol;
    const host = req.headers["x-forwarded-host"] || req.headers["host"];
    const imgBaseUrl = `${protocol}://${host}/uploads/`;

    if (req.fileLocation !== "undefined" && req.fileLocation !== null) {
      updateData.image = req.fileLocation;  // or do something with it if needed
    }

    if (req.file) {
      try {
        const originalName = path.parse(req.file.originalname).name;
        const extension = path.extname(req.file.originalname);
        const now = new Date();
        const date = now.toISOString().split('T')[0]; // YYYY-MM-DD
        const dateTime = `${date}`;

        const fileName = `${originalName}-${dateTime}${extension}`;
        console.log("fileName",fileName)
        updateData.image = fileName;
      } catch (error) {
        return res.status(500).send({
          success: false,
          message: `Failed to process uploaded file. Error: ${error.message}`,
        });
      }
    }
    const [updated] = await db.items.update(updateData, { where: { id } });
    if (updated) {
      const updatedUser = await db.items.findOne({ where: { id } });
      return res.status(200).send({
        success: true,
        message: "Client has been updated successfully!",
        data: {
          ...updatedUser,
          image: `${imgBaseUrl}${updatedUser.image}`,
        },
      });

    }
    return res.status(200).send({ success: true, message: "No changes were made to the client." });

  } catch (err) {
    console.error("Error updating user:", err);
    return res.status(500).send({
      success: false,
      message: "An error occurred while updating the user.",
      error: err.message
    });
  }
};



