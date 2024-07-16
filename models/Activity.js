const Sequelize = require("sequelize");
const db = require("../config/database");

const Activity = db.define("activity", {
  name: {
    type: Sequelize.STRING,
  },
  periodLinker: {
    type: Sequelize.STRING,
  },
  subjectLinker: {
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

Activity.sync().then(() => {
  console.log("activity table created");
});
module.exports = Activity;
