// database/connection.js
const { Sequelize } = require("sequelize");
require('dotenv').config(); // load environment variable from env file 


const connection = new Sequelize(process.env.DB_NAME , process.env.DB_USER  , process.env.DB_PASSWORD,{
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT, // Change dialect to postgres
});

// Test the connection
connection.authenticate()
  .then(() => {
    console.log("Database connection established successfully.");
  })
  .catch((err) => {
    console.log("Unable to connect with the database", err);
  });

// Sync the database
connection.sync({
  logging: console.log,
  force: false,
})
  .then(() => {
    console.log("Sync to database connection established successfully.");
  })
  .catch((err) => {
    console.log("Unable to sync database connection", err);
  });

module.exports = connection;
