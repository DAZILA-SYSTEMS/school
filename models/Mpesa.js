const Sequelize = require("sequelize");
const db = require("../config/database");

const Mpesa = db.define("mpesa", {
  key: {
    type: Sequelize.STRING,
  },
  secret: {
    type: Sequelize.STRING,
  },
  shortCode: {
    type: Sequelize.STRING,
  },
  api: {
    type: Sequelize.STRING,
  },
  trace: {
    type: Sequelize.STRING,
  },
  live: {
    type: Sequelize.STRING,
  },
  linker: {
    type: Sequelize.STRING,
  },
  status: {
    type: Sequelize.STRING,
  },
  instLinker: {
    type: Sequelize.STRING,
  },
  credLinker: {
    type: Sequelize.STRING,
  },
  deleted: {
    type: Sequelize.STRING,
  },
});

Mpesa.sync().then(() => {
  console.log("mpesa table created");
});
module.exports = Mpesa;
