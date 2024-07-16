const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();
const Lesson = require("../models/Lesson");
const verifyStaff = require("../middleware/verifyStaff");
const { Op } = require("sequelize");
const verifyUser = require("../middleware/verifyUser");

router.post("/add", verifyToken, verifyStaff, (req, res) => {
  //create a lesson
  Lesson.create({
    intervalLinker: req.body.intervalLinker,
    subjectLinker: req.body.subjectLinker,
    day: req.body.day,
    tutor: req.body.tutor,
    venue: req.body.venue,
    credLinker: req.credLinker,
    instLinker: req.body.instLinker,
    live: 1,
    linker: req.body.linker,
    trace: req.body.trace,
    deleted: req.body.deleted || 0,
    status: 0,
  })
    .then((lesson) => {
      req.io.to(req.body.instLinker).emit("message", {
        ...lesson,
        messageType: "lesson",
      });
      res.json({ lesson, status: 201 });
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "Lesson couldn't be created",
      })
    );
});

//edit lesson
router.post("/edit", verifyToken, verifyStaff, (req, res) => {
  Lesson.findOne({
    where: { id: req.body.id, instLinker: req.body.instLinker },
  })
    .then((lesson) => {
      if (lesson) {
        lesson.intervalLinker = req.body.intervalLinker
          ? req.body.intervalLinker
          : lesson.intervalLinker;
        lesson.subjectLinker = req.body.subjectLinker
          ? req.body.subjectLinker
          : lesson.subjectLinker;
        lesson.day = req.body.day ? req.body.day : lesson.day;
        lesson.tutor = req.body.tutor ? req.body.tutor : lesson.tutor;
        lesson.venue = req.body.venue ? req.body.venue : lesson.venue;
        lesson.credLinker = req.credLinker;
        lesson.trace = req.body.trace ? req.body.trace : lesson.trace;
        lesson.live = 1;
        lesson.deleted = req.body.deleted ? req.body.deleted : lesson.deleted;
        lesson.save();
        req.io.to(req.body.instLinker).emit("message", {
          ...lesson,
          messageType: "lesson",
        });
        res.json({ lesson, status: 200 });
      } else {
        res.json({ status: 404, message: "Lesson not found" });
      }
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "Lesson couldn't be edited",
      })
    );
});

//get lessons
router.post("/get", verifyToken, verifyUser, (req, res) => {
  Lesson.findAll({
    where: {
      instLinker: req.body.instLinker,
      trace: { [Op.gt]: req.body.online },
    },
  })
    .then((lessons) => {
      res.json({ lessons, status: 200 });
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "Unknown error",
      })
    );
});

module.exports = router;
