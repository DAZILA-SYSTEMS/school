const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();
const Exam = require("../models/Exam");
const verifyTutor = require("../middleware/verifyTutor");
const verifyAllStaff = require("../middleware/verifyAllStaff");
const { Op } = require("sequelize");

router.post("/add", verifyToken, verifyTutor, (req, res) => {
  //create a exam
  Exam.create({
    activityLinker: req.body.activityLinker,
    subjectLinker: req.body.subjectLinker,
    periodLinker: req.body.periodLinker,
    levelLinker: req.body.levelLinker,
    facultyLinker: req.body.facultyLinker,
    yearLinker: req.body.yearLinker,
    studentLinker: req.body.studentLinker,
    score: req.body.score,
    maxScore: req.body.maxScore,
    comment: req.body.comment,
    grade: req.body.grade,
    credLinker: req.credLinker,
    instLinker: req.body.instLinker,
    live: 1,
    linker: req.body.linker,
    trace: req.body.trace,
    deleted: req.body.deleted || 0,
    status: 0,
  })
    .then((exam) => {
      req.io.to(req.body.instLinker).emit("message", {
        ...exam,
        messageType: "exam",
      });
      res.json({ exam, status: 201 });
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "Exam couldn't be created",
      })
    );
});

//edit exam
router.post("/edit", verifyToken, verifyTutor, (req, res) => {
  Exam.findOne({
    where: { id: req.body.id, instLinker: req.body.instLinker },
  })
    .then((exam) => {
      if (exam) {
        exam.activityLinker = req.body.activityLinker || exam.activityLinker;
        exam.subjectLinker = req.body.subjectLinker || exam.subjectLinker;
        exam.periodLinker = req.body.periodLinker || exam.periodLinker;
        exam.levelLinker = req.body.levelLinker || exam.levelLinker;
        exam.facultyLinker = req.body.facultyLinker || exam.facultyLinker;
        exam.yearLinker = req.body.yearLinker || exam.yearLinker;
        exam.studentLinker = req.body.studentLinker || exam.studentLinker;
        exam.score = req.body.score || exam.score;
        exam.maxScore = req.body.maxScore || exam.maxScore;
        exam.comment = req.body.comment || exam.comment;
        exam.grade = req.body.grade || exam.grade;
        exam.credLinker = req.credLinker;
        exam.trace = req.body.trace ? req.body.trace : exam.trace;
        exam.live = 1;
        exam.deleted = req.body.deleted ? req.body.deleted : exam.deleted;
        exam.save();
        req.io.to(req.body.instLinker).emit("message", {
          ...exam,
          messageType: "exam",
        });
        res.json({ exam, status: 200 });
      } else {
        res.json({ status: 404, message: "Exam not found" });
      }
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "Exam couldn't be edited",
      })
    );
});

//get exams
router.post("/get", verifyToken, verifyAllStaff, (req, res) => {
  Exam.findAll({
    where: {
      instLinker: req.body.instLinker,
      trace: { [Op.gt]: req.body.online },
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

module.exports = router;
