const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");
const router = express.Router();
const Subject = require("../models/Subject");
const { Op } = require("sequelize");
const verifyUser = require("../middleware/verifyUser");

//register an institution
router.post("/add", verifyToken, verifyAdmin, (req, res) => {
  //create a subject
  Subject.create({
    name: req.body.name,
    periodLinker: req.body.periodLinker,
    facultyLinker: req.body.facultyLinker,
    levelLinker: req.body.levelLinker,
    credLinker: req.credLinker,
    instLinker: req.body.instLinker,
    live: 1,
    linker: req.body.linker,
    trace: req.body.trace,
    deleted: req.body.deleted || 0,
    status: 0,
  })
    .then((subject) => {
      req.io
        .to(req.body.instLinker)
        .emit("message", { ...subject, messageType: "subject" });
      res.json({ subject, status: 201 });
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "Subject couldn't be created",
      })
    );
});

//edit subject
router.post("/edit", verifyToken, verifyAdmin, (req, res) => {
  Subject.findOne({
    where: { linker: req.body.linker, instLinker: req.body.instLinker },
  })
    .then((subject) => {
      if (subject) {
        subject.name = req.body.name ? req.body.name : subject.name;
        subject.facultyLinker = req.body.facultyLinker
          ? req.body.facultyLinker
          : subject.facultyLinker;
        subject.levelLinker = req.body.levelLinker
          ? req.body.levelLinker
          : subject.levelLinker;
        subject.periodLinker = req.body.periodLinker
          ? req.body.periodLinker
          : subject.periodLinker;
        subject.credLinker = req.credLinker;
        subject.trace = req.body.trace ? req.body.trace : subject.trace;
        subject.live = 1;
        subject.deleted = req.body.deleted ? req.body.deleted : subject.deleted;
        subject.save();
        req.io
          .to(req.body.instLinker)
          .emit("message", { ...subject, messageType: "subject" });
        res.json({ subject, status: 200 });
      } else {
        res.json({ status: 404, message: "Subject not found" });
      }
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "Subject couldn't be edited",
      })
    );
});

//get subjects
router.post("/get", verifyToken, verifyUser, (req, res) => {
  Subject.findAll({
    where: {
      instLinker: req.body.instLinker,
      trace: { [Op.gt]: req.body.online },
    },
  })
    .then((subjects) => {
      res.json({ subjects, status: 200 });
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "Unknown error",
      })
    );
});

module.exports = router;
