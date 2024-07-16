const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");
const router = express.Router();
const Structure = require("../models/Structure");
const { Op } = require("sequelize");
const verifyUser = require("../middleware/verifyUser");

//register an institution
router.post("/add", verifyToken, verifyAdmin, (req, res) => {
  //create a structure
  Structure.create({
    name: req.body.name,
    type: req.body.type,
    credLinker: req.credLinker,
    instLinker: req.body.instLinker,
    live: 1,
    linker: req.body.linker,
    trace: req.body.trace,
    deleted: req.body.deleted || 0,
    status: 0,
  })
    .then((structure) => {
      res.json({ structure, status: 201 });
      req.io
        .to(req.body.instLinker)
        .emit("message", { ...structure, messageType: "structure" });
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "Structure couldn't be created",
      })
    );
});

//edit structure
router.post("/edit", verifyToken, verifyAdmin, (req, res) => {
  Structure.findOne({
    where: { id: req.body.id, instLinker: req.body.instLinker },
  })
    .then((structure) => {
      if (structure) {
        structure.name = req.body.name ? req.body.name : structure.name;
        structure.type = req.body.type ? req.body.type : structure.type;
        structure.credLinker = req.credLinker;
        structure.trace = req.body.trace ? req.body.trace : structure.trace;
        structure.live = 1;
        structure.deleted = req.body.deleted
          ? req.body.deleted
          : structure.deleted;
        structure.save();
        req.io
          .to(req.body.instLinker)
          .emit("message", { ...structure, messageType: "structure" });
        res.json({ structure, status: 200 });
      } else {
        res.json({ status: 404, message: "Structure not found" });
      }
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "Structure couldn't be edited",
      })
    );
});

//get structures
router.post("/get", verifyToken, verifyUser, (req, res) => {
  Structure.findAll({
    where: {
      instLinker: req.body.instLinker,
      trace: { [Op.gt]: req.body.online },
    },
  })
    .then((structures) => {
      res.json({ structures, status: 200 });
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "Unknown error",
      })
    );
});

module.exports = router;
