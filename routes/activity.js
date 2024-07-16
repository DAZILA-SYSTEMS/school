const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");
const router = express.Router();
const Activity = require("../models/Activity");
const verifyUser = require("../middleware/verifyUser");
const { Op } = require("sequelize");

//register an institution
router.post("/add", verifyToken, verifyAdmin, (req, res) => {
  //create a activity
  Activity.create({
    name: req.body.name,
    periodLinker: req.body.periodLinker,
    facultyLinker: req.body.facultyLinker,
    levelLinker: req.body.levelLinker,
    subjectLinker: req.body.subjectLinker,
    credLinker: req.credLinker,
    instLinker: req.body.instLinker,
    live: 1,
    linker: req.body.linker,
    trace: req.body.trace,
    deleted: req.body.deleted || 0,
    status: 0,
  })
    .then((activity) => {
      req.io
        .to(req.body.instLinker)
        .emit("message", { ...activity, messageType: "activity" });
      res.json({ activity, status: 201 });
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "Activity couldn't be created",
      })
    );
});

//edit activity
router.post("/edit", verifyToken, verifyAdmin, (req, res) => {
  Activity.findOne({
    where: { linker: req.body.linker, instLinker: req.body.instLinker },
  })
    .then((activity) => {
      if (activity) {
        activity.name = req.body.name ? req.body.name : activity.name;
        activity.facultyLinker = req.body.facultyLinker
          ? req.body.facultyLinker
          : activity.facultyLinker;
        activity.levelLinker = req.body.levelLinker
          ? req.body.levelLinker
          : activity.levelLinker;
        activity.periodLinker = req.body.periodLinker
          ? req.body.periodLinker
          : activity.periodLinker;
        activity.subjectLinker = req.body.subjectLinker
          ? req.body.subjectLinker
          : activity.subjectLinker;
        activity.credLinker = req.credLinker;
        activity.trace = req.body.trace ? req.body.trace : activity.trace;
        activity.live = 1;
        activity.deleted = req.body.deleted
          ? req.body.deleted
          : activity.deleted;
        activity.save();
        req.io
          .to(req.body.instLinker)
          .emit("message", { ...activity, messageType: "activity" });
        res.json({ activity, status: 200 });
      } else {
        res.json({ status: 404, message: "Activity not found" });
      }
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "Activity couldn't be edited",
      })
    );
});

//get activitys
router.post("/get", verifyToken, verifyUser, (req, res) => {
  Activity.findAll({
    where: {
      instLinker: req.body.instLinker,
      trace: { [Op.gt]: req.body.online },
    },
  })
    .then((activities) => {
      res.json({ activities, status: 200 });
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "Unknown error",
      })
    );
});

module.exports = router;
