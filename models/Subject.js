const Sequelize = require("sequelize");
const db = require("../config/database");

const Subject = db.define("subject", {
  name: {
    type: Sequelize.STRING,
  },
  periodLinker: {
    type: Sequelize.STRING,
  },
  facultyLinker: {
    type: Sequelize.STRING,
  },
  levelLinker: {
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

Subject.sync().then(() => {
  console.log("subject table created");
});
module.exports = Subject;
