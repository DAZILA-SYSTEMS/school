const Sequelize = require("sequelize");
const db = require("../config/database");

const Credential = db.define("credential", {
  studentReg: {
    type: Sequelize.STRING,
  },
  staffReg: {
    type: Sequelize.STRING,
  },
  firstname: {
    type: Sequelize.STRING,
  },
  lastname: {
    type: Sequelize.STRING,
  },
  surname: {
    type: Sequelize.STRING,
  },
  contact: {
    type: Sequelize.STRING,
  },
  email: {
    type: Sequelize.STRING,
  },
  refLinker: {
    type: Sequelize.STRING,
  },
  credLinker: {
    type: Sequelize.STRING,
  },
  instLinker: {
    type: Sequelize.STRING,
  },
  student: {
    type: Sequelize.TEXT,
  },
  tutor: {
    type: Sequelize.TEXT,
  },
  finance: {
    type: Sequelize.TEXT,
  },
  library: {
    type: Sequelize.STRING,
  },
  admin: {
    type: Sequelize.STRING,
  },
  guardian: {
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
  deleted: {
    type: Sequelize.STRING,
  },
  level: {
    type: Sequelize.STRING,
  },
  faculty: {
    type: Sequelize.STRING,
  },
  year: {
    type: Sequelize.STRING,
  },
  period: {
    type: Sequelize.STRING,
  },
  token: {
    type: Sequelize.STRING,
  },
  socket: {
    type: Sequelize.STRING,
  },
  status: {
    type: Sequelize.STRING,
  },
});

Credential.sync().then(() => {
  console.log("credential table created");
});
module.exports = Credential;
