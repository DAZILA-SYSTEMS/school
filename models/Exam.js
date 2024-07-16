const Sequelize = require("sequelize");
const db = require("../config/database");

const Mode = db.define("exam", {
  activityLinker: {
    type: Sequelize.STRING,
  },

  subjectLinker: {
    type: Sequelize.STRING,
  },

  periodLinker: {
    type: Sequelize.STRING,
  },

  levelLinker: {
    type: Sequelize.STRING,
  },

  facultyLinker: {
    type: Sequelize.STRING,
  },

  yearLinker: {
    type: Sequelize.STRING,
  },

  studentLinker: {
    type: Sequelize.STRING,
  },

  score: {
    type: Sequelize.STRING,
  },

  maxScore: {
    type: Sequelize.STRING,
  },

  comment: {
    type: Sequelize.STRING,
  },

  grade: {
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

Mode.sync().then(() => {
  console.log("exam table created");
});
module.exports = Mode;
