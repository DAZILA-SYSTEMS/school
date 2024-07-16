const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();
const Book = require("../models/Book");
const verifyLibrary = require("../middleware/verifyLibrary");
const verifyUser = require("../middleware/verifyUser");
const { Op } = require("sequelize");

router.post("/add", verifyToken, verifyLibrary, (req, res) => {
  //create a book
  Book.create({
    name: req.body.name,
    details: req.body.details,
    author: req.body.author,
    bookStatus: req.body.bookStatus,
    issuedOn: req.body.issuedOn,
    returnOn: req.body.returnOn,
    studentLinker: req.body.studentLinker,
    bookStatus: req.body.bookStatus,
    bookCode: req.body.bookCode,
    catLinker: req.body.catLinker,
    credLinker: req.credLinker,
    instLinker: req.body.instLinker,
    live: 1,
    linker: req.body.linker,
    trace: req.body.trace,
    deleted: req.body.deleted || 0,
    status: 0,
  })
    .then((book) => {
      req.io
        .to(req.body.instLinker)
        .emit("message", { ...book, messageType: "book" });
      res.json({ book, status: 201 });
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "Book couldn't be created",
      })
    );
});

//edit book
router.post("/edit", verifyToken, verifyLibrary, (req, res) => {
  Book.findOne({
    where: { id: req.body.id, instLinker: req.body.instLinker },
  })
    .then((book) => {
      if (book) {
        book.name = req.body.name ? req.body.name : book.name;
        book.details = req.body.details ? req.body.details : book.details;
        book.author = req.body.author ? req.body.author : book.author;
        book.bookStatus = req.body.bookStatus;
        book.bookCode = req.body.bookCode ? req.body.bookCode : book.bookCode;
        book.studentLinker = req.body.studentLinker;
        book.catLinker = req.body.catLinker
          ? req.body.catLinker
          : book.catLinker;
        book.credLinker = req.credLinker;
        book.trace = req.body.trace ? req.body.trace : book.trace;
        book.live = 1;
        book.deleted = req.body.deleted ? req.body.deleted : book.deleted;
        book.save();
        req.io
          .to(req.body.instLinker)
          .emit("message", { ...book, messageType: "book" });
        res.json({ book, status: 200 });
      } else {
        res.json({ status: 404, message: "Book not found" });
      }
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "Book couldn't be edited",
      })
    );
});

//get books
router.post("/get", verifyToken, verifyUser, (req, res) => {
  Book.findAll({
    where: {
      instLinker: req.body.instLinker,
      trace: { [Op.gt]: req.body.online },
    },
  })
    .then((books) => {
      res.json({ books, status: 200 });
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "Unknown error",
      })
    );
});

module.exports = router;
