const Sequelize = require("sequelize");
const db = require("../config/database");

const Structure = db.define("structure", {
  name: {
    type: Sequelize.STRING,
  },
  type: {
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

Structure.sync().then(() => {
  console.log("structure table created");
});
module.exports = Structure;
