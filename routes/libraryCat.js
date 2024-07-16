const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();
const LibraryCat = require("../models/LibraryCat");
const verifyLibrary = require("../middleware/verifyLibrary");
const verifyUser = require("../middleware/verifyUser");
const { Op } = require("sequelize");

router.post("/add", verifyToken, verifyLibrary, (req, res) => {
  //create a libraryCat
  LibraryCat.create({
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
    .then((libraryCat) => {
      req.io.to(req.body.instLinker).emit("message", {
        ...libraryCat,
        messageType: "libraryCat",
      });
      res.json({ libraryCat, status: 201 });
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "LibraryCat couldn't be created",
      })
    );
});

//edit libraryCat
router.post("/edit", verifyToken, verifyLibrary, (req, res) => {
  LibraryCat.findOne({
    where: { id: req.body.id, instLinker: req.body.instLinker },
  })
    .then((libraryCat) => {
      if (libraryCat) {
        libraryCat.name = req.body.name ? req.body.name : libraryCat.name;
        libraryCat.details = req.body.details
          ? req.body.details
          : libraryCat.details;
        libraryCat.credLinker = req.credLinker;
        libraryCat.trace = req.body.trace ? req.body.trace : libraryCat.trace;
        libraryCat.live = 1;
        libraryCat.deleted = req.body.deleted
          ? req.body.deleted
          : libraryCat.deleted;
        libraryCat.save();
        req.io.to(req.body.instLinker).emit("message", {
          ...libraryCat,
          messageType: "libraryCat",
        });
        res.json({ libraryCat, status: 200 });
      } else {
        res.json({ status: 404, message: "LibraryCat not found" });
      }
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "LibraryCat couldn't be edited",
      })
    );
});

//get libraryCats
router.post("/get", verifyToken, verifyUser, (req, res) => {
  LibraryCat.findAll({
    where: {
      instLinker: req.body.instLinker,
      trace: { [Op.gt]: req.body.online },
    },
  })
    .then((libraryCats) => {
      res.json({ libraryCats, status: 200 });
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "Unknown error",
      })
    );
});

module.exports = router;
