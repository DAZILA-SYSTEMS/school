const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();
const { Op } = require("sequelize");
const Invoice = require("../models/Invoice");
const verifyFinance = require("../middleware/verifyFinance");

router.post("/add", verifyToken, verifyFinance, (req, res) => {
  //create an invoice
  Invoice.create({
    name: req.body.name,
    details: req.body.details,
    amount: req.body.amount,
    credLinker: req.credLinker,
    studentLinker: req.body.studentLinker,
    instLinker: req.body.instLinker,
    live: 1,
    linker: req.body.linker,
    trace: req.body.trace,
    deleted: req.body.delete || 0,
    status: 0,
  })
    .then((invoice) => {
      req.io
        .to(req.body.instLinker)
        .emit("message", { ...invoice, messageType: "invoice" });
      res.json({ invoice, status: 201 });
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "Invoice couldn't be created",
      })
    );
});

//edit invoice
router.post("/edit", verifyToken, verifyFinance, (req, res) => {
  Invoice.findOne({
    where: { id: req.body.id, instLinker: req.body.instLinker },
  })
    .then((invoice) => {
      if (invoice) {
        invoice.name = req.body.name ? req.body.name : invoice.name;
        invoice.details = req.body.details ? req.body.details : invoice.details;
        invoice.amount = req.body.amount ? req.body.amount : invoice.amount;
        invoice.credLinker = req.credLinker;
        invoice.trace = req.body.trace ? req.body.trace : invoice.trace;
        invoice.live = 1;
        invoice.deleted = req.body.deleted ? req.body.deleted : invoice.deleted;
        invoice.save();
        req.io
          .to(req.body.instLinker)
          .emit("message", { ...invoice, messageType: "invoice" });
        res.json({ invoice, status: 200 });
      } else {
        res.json({ status: 404, message: "Invoice not found" });
      }
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "Invoice couldn't be edited",
      })
    );
});

//get invoices
router.post("/get", verifyToken, verifyFinance, (req, res) => {
  Invoice.findAll({
    where: {
      instLinker: req.body.instLinker,
      trace: { [Op.gt]: req.body.online },
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

module.exports = router;
