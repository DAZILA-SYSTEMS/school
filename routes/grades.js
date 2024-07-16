const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();
const Grade = require("../models/Grade");
const verifyAllStaff = require("../middleware/verifyAllStaff");
const { Op } = require("sequelize");

router.post("/add", verifyToken, verifyAllStaff, (req, res) => {
  //create an grade
  Grade.create({
    min: req.body.min,
    max: req.body.max,
    credLinker: req.credLinker,
    grade: req.body.grade,
    instLinker: req.body.instLinker,
    live: 1,
    linker: req.body.linker,
    trace: req.body.trace,
    deleted: req.body.deleted || 0,
    status: 0,
  })
    .then((grade) => {
      req.io
        .to(req.body.instLinker)
        .emit("message", { ...grade, messageType: "grade" });
      res.json({ grade, status: 201 });
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "Grade couldn't be created",
      })
    );
});

//edit grade
router.post("/edit", verifyToken, verifyAllStaff, (req, res) => {
  Grade.findOne({
    where: { id: req.body.id, instLinker: req.body.instLinker },
  })
    .then((grade) => {
      if (grade) {
        grade.min = req.body.min ? req.body.min : grade.min;
        grade.max = req.body.max ? req.body.max : grade.max;
        grade.grade = req.body.grade ? req.body.grade : grade.grade;
        grade.credLinker = req.credLinker;
        grade.trace = req.body.trace ? req.body.trace : grade.trace;
        grade.live = 1;
        grade.deleted = req.body.deleted ? req.body.deleted : grade.deleted;
        grade.save();
        req.io.to(req.body.instLinker).emit("message", {
          ...grade,
          messageType: "grade",
        });
        res.json({ grade, status: 200 });
      } else {
        res.json({ status: 404, message: "Grade not found" });
      }
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "Grade couldn't be edited",
      })
    );
});

//get grades
router.post("/get", verifyToken, verifyAllStaff, (req, res) => {
  Grade.findAll({
    where: {
      instLinker: req.body.instLinker,
      trace: { [Op.gt]: req.body.online },
    },
  })
    .then((grades) => {
      res.json({ grades, status: 200 });
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "Unknown error",
      })
    );
});

module.exports = router;
