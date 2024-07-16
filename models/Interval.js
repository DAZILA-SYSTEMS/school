const Sequelize = require("sequelize");
const db = require("../config/database");

const Interval = db.define("interval", {
  startAt: {
    type: Sequelize.STRING,
  },
  endAt: {
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

Interval.sync().then(() => {
  console.log("interval table created");
});
module.exports = Interval;
