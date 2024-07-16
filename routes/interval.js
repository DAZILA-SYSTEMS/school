const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();
const Interval = require("../models/Interval");
const verifyStaff = require("../middleware/verifyStaff");
const verifyUser = require("../middleware/verifyUser");
const { Op } = require("sequelize");

router.post("/add", verifyToken, verifyStaff, (req, res) => {
  //create a interval
  Interval.create({
    startAt: req.body.startAt,
    endAt: req.body.endAt,
    credLinker: req.credLinker,
    instLinker: req.body.instLinker,
    live: 1,
    linker: req.body.linker,
    trace: req.body.trace,
    deleted: req.body.deleted || 0,
    status: 0,
  })
    .then((interval) => {
              req.io.to(req.body.instLinker).emit("message", {
                ...interval,
                messageType: "interval",
              });
      res.json({ interval, status: 201 });
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "Interval couldn't be created",
      })
    );
});

//edit interval
router.post("/edit", verifyToken, verifyStaff, (req, res) => {
  Interval.findOne({
    where: { id: req.body.id, instLinker: req.body.instLinker },
  })
    .then((interval) => {
      if (interval) {
        interval.startAt = req.body.startAt
          ? req.body.startAt
          : interval.startAt;
        interval.endAt = req.body.endAt ? req.body.endAt : interval.endAt;
        interval.credLinker = req.credLinker;
        interval.trace = req.body.trace ? req.body.trace : interval.trace;
        interval.live = 1;
        interval.deleted = req.body.deleted
          ? req.body.deleted
          : interval.deleted;
        interval.save();
        req.io.to(req.body.instLinker).emit("message", {
          ...interval,
          messageType: "interval",
        });
        res.json({ interval, status: 200 });
      } else {
        res.json({ status: 404, message: "Interval not found" });
      }
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "Interval couldn't be edited",
      })
    );
});

//get intervals
router.post("/get", verifyToken, verifyUser, (req, res) => {
  Interval.findAll({
    where: {
      instLinker: req.body.instLinker,
      trace: { [Op.gt]: req.body.online },
    },
  })
    .then((intervals) => {
      res.json({ intervals, status: 200 });
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "Unknown error",
      })
    );
});

module.exports = router;
