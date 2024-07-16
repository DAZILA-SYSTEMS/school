const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();
const Credential = require("../models/Credential");
const verifyStaff = require("../middleware/verifyStaff");

//register a guardian
router.post("/add", verifyToken, verifyStaff, (req, res) => {
  Credential.create({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    surname: req.body.surname,
    instLinker: req.body.instLinker,
    credLinker: req.credLinker,
    refLinker: req.body.refLinker,
    trace: req.body.trace,
    linker: req.body.linker,
    email: req.body.email,
    contact: req.body.contact,
    live: 1,
    guardian: 1,
    status: req.body.status,
    deleted: 0,
  })
    .then((credential) => {
      req.io.to(req.body.instLinker).emit("message", {
        ...credential,
        messageType: "guardian",
      });
      res.json({ cred: credential, status: 201 });
    })
    .catch((err) => res.json({ status: "500", message: "Error has occured" }));
});

//edit a guardian
router.post("/edit", verifyToken, verifyStaff, (req, res) => {
  Credential.findOne({
    where: { id: req.body.id, instLinker: req.body.instLinker },
  })
    .then((guardian) => {
      if (guardian) {
        guardian.firstname = req.body.firstname
          ? req.body.firstname
          : guardian.firstname;
        guardian.email = req.body.email ? req.body.email : guardian.email;
        guardian.contact = req.body.contact
          ? req.body.contact
          : guardian.contact;
        guardian.refLinker = req.body.refLinker
          ? req.body.refLinker
          : guardian.refLinker;
        guardian.credLinker = req.credLinker;
        guardian.trace = req.body.trace ? req.body.trace : guardian.trace;
        guardian.live = 1;
        guardian.deleted = req.body.deleted
          ? req.body.deleted
          : guardian.deleted;
        guardian.save();
        req.io.to(req.body.instLinker).emit("message", {
          ...guardian,
          messageType: "guardian",
        });
        res.json({ cred: guardian, status: 200 });
      } else {
        res.json({ status: 404, message: "guardian not found" });
      }
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "guardian couldn't be edited",
      })
    );
});
module.exports = router;
