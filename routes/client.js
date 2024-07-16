const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();
const Payment = require("../models/Payment");
const Invoice = require("../models/Invoice");
const Exam = require("../models/Exam");
const verifyStudent = require("../middleware/verifyStudent");
const Book = require("../models/Book");

//get payments
router.post("/payments", verifyToken, verifyStudent, (req, res) => {
  Payment.findAll({
    where: {
      instLinker: req.body.instLinker,
      studentLinker: req.credLinker,
    },
  })
    .then((payments) => {
      res.json({ payments, status: 200 });
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "Unknown error",
      })
    );
});

//get invoices
router.post("/invoices", verifyToken, verifyStudent, (req, res) => {
  Invoice.findAll({
    where: {
      instLinker: req.body.instLinker,
      studentLinker: req.credLinker,
    },
  })
    .then((invoices) => {
      res.json({ invoices, status: 200 });
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "Unknown error",
      })
    );
});

//get exams
router.post("/exams", verifyToken, verifyStudent, (req, res) => {
  Exam.findAll({
    where: {
      instLinker: req.body.instLinker,
      studentLinker: req.credLinker,
    },
  })
    .then((exams) => {
      res.json({ exams, status: 200 });
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "Unknown error",
      })
    );
});

//get books
router.post("/books", verifyToken, verifyStudent, (req, res) => {
  Book.findAll({
    where: {
      instLinker: req.body.instLinker,
      studentLinker: req.credLinker,
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
