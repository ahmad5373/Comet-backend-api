const { Sequelize } = require("sequelize");
require('dotenv').config();
const pg = require('pg');

let connection;

if (process.env.NODE_ENV === 'production') {
  // Use the POSTGRES_URL for production
  connection = new Sequelize(process.env.POSTGRES_URL, {
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
} else {
  connection = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    dialectModule: pg, // Use the explicitly required 'pg' module
  });
}

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
