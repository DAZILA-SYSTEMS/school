const Sequelize = require("sequelize");
const db = require("../config/database");

const Grade = db.define("grade", {
  min: {
    type: Sequelize.STRING,
  },
  max: {
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
  grade: {
    type: Sequelize.STRING,
  },
  credLinker: {
    type: Sequelize.STRING,
  },
  deleted: {
    type: Sequelize.STRING,
  },
});

Grade.sync().then(() => {
  console.log("grade table created");
});
module.exports = Grade;
