const Sequelize = require("sequelize");
const db = require("../config/database");

const StoreEntry = db.define("storeEntry", {
  type: {
    type: Sequelize.STRING,
  },
  details: {
    type: Sequelize.STRING,
  },
  supplier: {
    type: Sequelize.STRING,
  },
  quantity: {
    type: Sequelize.STRING,
  },
  itemLinker: {
    type: Sequelize.STRING,
  },
  patientLinker: {
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

StoreEntry.sync().then(() => {
  console.log("storeEntry table created");
});
module.exports = StoreEntry;
