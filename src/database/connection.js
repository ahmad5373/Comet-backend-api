// database/connection.js
const { Sequelize } = require("sequelize");
require('dotenv').config(); // load environment variable from env file 
// const pg = require('pg'); // require 'pg' module explicitly

let connection;

if (process.env.NODE_ENV === 'production') {
  connection = new Sequelize(process.env.POSTGRES_URL, {
    dialect: 'postgres',
    dialectOptions: {
          ssl: process.env.NODE_ENV === 'production', // Enable SSL only in production
        },
  });
} else {
  connection = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    dialectOptions: {
          ssl: process.env.NODE_ENV === 'production', // Enable SSL only in production
        },
  });
}
// const connection = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
//   host: process.env.DB_HOST,
//   dialect: 'postgres', 
//   logging: false, // Disable logging to reduce noise
//   dialectOptions: {
//     ssl: process.env.NODE_ENV === 'production', // Enable SSL only in production
//   },
//   dialectModule: pg, // Use the explicitly required 'pg' module
// });

// // Test the connection
// connection.authenticate()
//   .then(() => {
//     console.log("Database connection established successfully.");
//   })
//   .catch((err) => {
//     console.log("Unable to connect with the database", err);
//   });

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
