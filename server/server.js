const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config();
const app = express();
const path = require('path');

var corsOptions = {
  origin: "*"
};

app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());
app.use(bodyParser.json()); 
app.use(express.urlencoded({ extended: true }));
// parse requests of content-type - application/x-www-form-urlencoded

app.get("/", (req, res) => {
  res.json({ message: "Welcome to My application." });
});

app.use('/profileImage', express.static(path.join(__dirname, 'assets/profileimages')));
app.use('/uploads', express.static(path.join(__dirname, 'assets/uploads')));
// app.use('/jobImage', express.static(path.join(__dirname, 'assets/jobImages')));

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/item.routes')(app);
require('./app/routes/dashboard.routes')(app);


const db = require("./app/models");
db.sequelize.sync().then(async() => {    
    try {
        const existingSuperadmin = await db.users.findAll({ where: {role: 'SuperAdmin'} });
        if (existingSuperadmin.length === 0) {
            await db.users.create({ 
                parentId: 0,
                name: 'Super Admin',
                email: 'admin@123.com',
                password: '$2a$10$hhgR9EyNY/qZw9ZK0h8rYOE9MlcOFzuSbhiBX56Ooe3RJNFFRS8PO', //12345678
                role: 'SuperAdmin'
            });
            console.log('Super Admin inserted successfully.');
        } 
    } catch (error) {
        console.error('Error inserting static records:', error);
    }
  console.log("Synced db.");
})
  .catch((err) => {
  console.log("Failed to sync db: " + err.message);
});