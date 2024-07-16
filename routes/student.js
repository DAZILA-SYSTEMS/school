const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();
const Credential = require("../models/Credential");
const verifyStaff = require("../middleware/verifyStaff");
const { Op } = require("sequelize");
const verifyAllStaff = require("../middleware/verifyAllStaff");

//register a student
router.post("/add", verifyToken, verifyStaff, (req, res) => {
  Credential.create({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    surname: req.body.surname,
    studentReg: req.body.studentReg,
    level: req.body.level,
    year: req.body.year,
    faculty: req.body.faculty,
    period: req.body.period,
    instLinker: req.body.instLinker,
    credLinker: req.credLinker,
    trace: req.body.trace,
    linker: req.body.linker,
    email: req.body.email,
    contact: req.body.contact,
    live: 1,
    student: 1,
    status: req.body.status,
    deleted: req.body.deleted || 0,
  })
    .then((credential) => {
      req.io.to(req.body.instLinker).emit("message", {
        ...credential,
        messageType: "student",
      });
      res.json({ cred: credential, status: 201 });
    })
    .catch((err) => res.json({ status: "500", message: "Error has occured" }));
});

//edit a student
router.post("/edit", verifyToken, verifyStaff, (req, res) => {
  Credential.findOne({
    where: { id: req.body.id, instLinker: req.body.instLinker },
  })
    .then((student) => {
      if (student) {
        student.firstname = req.body.firstname
          ? req.body.firstname
          : student.firstname;
        student.lastname = req.body.lastname
          ? req.body.lastname
          : student.lastname;
        student.surname = req.body.surname ? req.body.surname : student.surname;
        student.studentReg = req.body.studentReg
          ? req.body.studentReg
          : student.studentReg;
        student.email = req.body.email ? req.body.email : student.email;
        student.contact = req.body.contact ? req.body.contact : student.contact;
        student.level = req.body.level ? req.body.level : student.level;
        student.faculty = req.body.faculty ? req.body.faculty : student.faculty;
        student.year = req.body.year ? req.body.year : student.year;
        student.period = req.body.period ? req.body.period : student.period;
        student.credLinker = req.credLinker;
        student.trace = req.body.trace ? req.body.trace : student.trace;
        student.live = 1;
        student.deleted = req.body.deleted ? req.body.deleted : student.deleted;
        student.save();
        req.io.to(req.body.instLinker).emit("message", {
          ...student,
          messageType: "student",
        });
        res.json({ cred: student, status: 200 });
      } else {
        res.json({ status: 404, message: "student not found" });
      }
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "student couldn't be edited",
      })
    );
});

//transition students
router.post("/transition", verifyToken, verifyStaff, (req, res) => {
  Credential.update(
    {
      year: req.body.ToYear,
      faculty: req.body.ToFaculty,
      period: req.body.ToPeriod,
      level: req.body.ToLevel,
      trace: req.body.trace,
      credLinker: req.credLinker,
    },
    {
      where: {
        year: req.body.FromYear,
        faculty: req.body.FromFaculty,
        period: req.body.FromPeriod,
        level: req.body.FromLevel,
        student: 1,
        instLinker: req.body.instLinker,
      },
    }
  )
    .then(() => {
      req.io.to(req.body.instLinker).emit("message", {
        ...req.body,
        messageType: "student-transition",
        credLinker: req.credLinker,
      });
      res.json({ status: 200, message: "successful transition" });
    })
    .catch(() => res.json({ status: 500, message: "Transition Failed" }));
});

//get students/ guardians
router.post("/get", verifyToken, verifyAllStaff, (req, res) => {
  Credential.findAll({
    where: {
      instLinker: req.body.instLinker,
      trace: { [Op.gt]: req.body.online },
      [Op.or]: [
        {
          admin: 1,
        },
        {
          library: 1,
        },
        {
          finance: 1,
        },
        {
          tutor: 1,
        },
        { student: 1 },
        { guardian: 1 },
      ],
    },
  })
    .then((creds) => {
      res.json({ creds, status: 200 });
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "Unknown error",
      })
    );
});

module.exports = router;
