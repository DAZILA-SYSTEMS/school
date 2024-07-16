const Sequelize = require("sequelize");
const db = require("../config/database");

const Book = db.define("book", {
  name: {
    type: Sequelize.STRING,
  },
  details: {
    type: Sequelize.STRING,
  },
  author: {
    type: Sequelize.STRING,
  },
  bookStatus: {
    type: Sequelize.STRING,
  },
  issuedOn: {
    type: Sequelize.STRING,
  },
  returnOn: {
    type: Sequelize.STRING,
  },
  studentLinker: {
    type: Sequelize.STRING,
  },
  bookCode: {
    type: Sequelize.STRING,
  },
  catLinker: {
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

Book.sync().then(() => {
  console.log("book table created");
});
module.exports = Book;
