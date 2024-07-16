const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();
const Credential = require("../models/Credential");
const verifySuperAdmin = require("../middleware/verifySuperAdmin");
const verifyAdmin = require("../middleware/verifyAdmin");
const verifyAllStaff = require("../middleware/verifyAllStaff");
const { Op } = require("sequelize");

//register a super admin
router.post("/super", verifyToken, verifySuperAdmin, (req, res) => {
  Credential.create({
    firstname: req.body.name,
    instLinker: req.body.instLinker,
    trace: req.body.trace,
    linker: req.body.linker,
    email: req.userLogger,
    deleted: req.body.deleted || 0,
    live: 1,
    admin: 1,
    tutor: 1,
    finance: 1,
    library: 1,
    status: req.body.status,
  })
    .then((credential) => res.json({ cred: credential, status: 201 }))
    .catch((err) => res.json({ status: "500", message: "Error has occured" }));
});

//register a staff
router.post("/add", verifyToken, verifyAdmin, (req, res) => {
  Credential.create({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    surname: req.body.surname,
    staffReg: req.body.staffReg,
    instLinker: req.body.instLinker,
    credLinker: req.credLinker,
    trace: req.body.trace,
    linker: req.body.linker,
    email: req.body.email,
    contact: req.body.contact,
    live: 1,
    admin: req.body.admin,
    tutor: req.body.tutor,
    finance: req.body.finance,
    library: req.body.library,
    status: req.body.status,
    deleted: 0,
  })
    .then((credential) => {
      req.io
        .to(req.body.instLinker)
        .emit("message", { ...credential, messageType: "staff" });
      res.json({ cred: credential, status: 201 });
    })
    .catch((err) => res.json({ status: "500", message: "Error has occured" }));
});

//edit a staff
router.post("/edit", verifyToken, verifyAdmin, (req, res) => {
  Credential.findOne({
    where: { id: req.body.id, instLinker: req.body.instLinker },
  })
    .then((staff) => {
      if (staff) {
        staff.firstname = req.body.firstname
          ? req.body.firstname
          : staff.firstname;
        staff.lastname = req.body.lastname ? req.body.lastname : staff.lastname;
        staff.surname = req.body.surname ? req.body.surname : staff.surname;
        staff.staffReg = req.body.staffReg ? req.body.staffReg : staff.staffReg;
        staff.email = req.body.email ? req.body.email : staff.email;
        staff.contact = req.body.contact ? req.body.contact : staff.contact;
        staff.admin = req.body.admin ? req.body.admin : staff.admin;
        staff.tutor = req.body.tutor ? req.body.tutor : staff.tutor;
        staff.finance = req.body.finance ? req.body.finance : staff.finance;
        staff.library = req.body.library ? req.body.library : staff.library;
        staff.credLinker = req.credLinker;
        staff.trace = req.body.trace ? req.body.trace : staff.trace;
        staff.live = 1;
        staff.deleted = req.body.deleted ? req.body.deleted : staff.deleted;
        staff.save();
        req.io
          .to(req.body.instLinker)
          .emit("message", { ...staff, messageType: "staff" });
        res.json({ cred: staff, status: 200 });
      } else {
        res.json({ status: 404, message: "staff not found" });
      }
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "staff couldn't be edited",
      })
    );
});

//get staffs
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
