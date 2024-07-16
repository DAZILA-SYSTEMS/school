const Sequelize = require("sequelize");
const db = require("../config/database");

const Lesson = db.define("lesson", {
  intervalLinker: {
    type: Sequelize.STRING,
  },
  subjectLinker: {
    type: Sequelize.STRING,
  },
  day: {
    type: Sequelize.STRING,
  },
  tutor: {
    type: Sequelize.STRING,
  },
  venue: {
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

Lesson.sync().then(() => {
  console.log("lesson table created");
});
module.exports = Lesson;
