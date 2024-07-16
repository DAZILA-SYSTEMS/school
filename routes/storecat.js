const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();
const StoreCat = require("../models/StoreCat");
const { Op } = require("sequelize");
const verifyAllStaff = require("../middleware/verifyAllStaff");

router.post("/add", verifyToken, verifyAllStaff, (req, res) => {
  //create a storeCat
  StoreCat.create({
    name: req.body.name,
    details: req.body.details,
    credLinker: req.credLinker,
    instLinker: req.body.instLinker,
    live: 1,
    linker: req.body.linker,
    trace: req.body.trace,
    deleted: req.body.deleted || 0,
    status: 0,
  })
    .then((storeCat) => {
      req.io
        .to(req.body.instLinker)
        .emit("message", { ...storeCat, messageType: "storeCat" });
      res.json({ storeCat, status: 201 });
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "StoreCat couldn't be created",
      })
    );
});

//edit storeCat
router.post("/edit", verifyToken, verifyAllStaff, (req, res) => {
  StoreCat.findOne({
    where: { id: req.body.id, instLinker: req.body.instLinker },
  })
    .then((storeCat) => {
      if (storeCat) {
        storeCat.name = req.body.name ? req.body.name : storeCat.name;
        storeCat.details = req.body.details
          ? req.body.details
          : storeCat.details;
        storeCat.credLinker = req.credLinker;
        storeCat.trace = req.body.trace ? req.body.trace : storeCat.trace;
        storeCat.live = 1;
        storeCat.deleted = req.body.deleted
          ? req.body.deleted
          : storeCat.deleted;
        storeCat.save();
        req.io
          .to(req.body.instLinker)
          .emit("message", { ...storeCat, messageType: "storeCat" });
        res.json({ storeCat, status: 200 });
      } else {
        res.json({ status: 404, message: "StoreCat not found" });
      }
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "StoreCat couldn't be edited",
      })
    );
});

//get storeCats
router.post("/get", verifyToken, verifyAllStaff, (req, res) => {
  StoreCat.findAll({
    where: {
      instLinker: req.body.instLinker,
      trace: { [Op.gt]: req.body.online },
    },
  })
    .then((storeCats) => {
      res.json({ storeCats, status: 200 });
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "Unknown error",
      })
    );
});

module.exports = router;
