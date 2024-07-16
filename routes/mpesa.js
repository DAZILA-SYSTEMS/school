const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");
const router = express.Router();
const Mode = require("../models/Mode");
const { Op } = require("sequelize");
const fetch = require("isomorphic-fetch");

//const get access token
const GetAccessToken = (callBack) => {
  const auth =
    "Basic " +
    new Buffer.from(
      process.env.MPESA_KEY + ":" + process.env.MPESA_KEY
    ).toString("base64");
  fetch(
    `https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: auth,
      },
      method: "POST",
      body: JSON.stringify({}),
    }
  )
    .then((data) => {
      console.log(data);
    })
    .catch((err) => console.log(err));
};

router.post("/access-token", (req, res) => {
  GetAccessToken(() => {});
  res.send("success");
});

// const initiate STK push
router.post("/push", (req, res) => {
  GetAccessToken(() => {});

  const IntPush = (accessToken) => {
    const auth = "Bearer " + accessToken;
    const now = new Date();
    const timestamp = `${now.getFullYear()}${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}${now
      .getHours()
      .toString()
      .padStart(2, "0")}${now.getMinutes().toString().padStart(2, "0")}${now
      .getSeconds()
      .toString()
      .padStart(2, "0")}`;
    const password = new Buffer.from(
      "174379" + process.env.pass + timestamp
    ).toString("base64");

    fetch(`${process.env.MPESA_URL}/stkpush/v1/processrequest`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: auth,
      },
      method: "POST",
      body: JSON.stringify({}),
    })
      .then((data) => {
        console.log(data);
      })
      .catch((err) => console.log(err));
  };
  res.send("success");
});

router.post("/add", verifyToken, verifyAdmin, (req, res) => {
  //create a mode
  Mode.create({
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
    .then((mode) => {
      req.io
        .to(req.body.instLinker)
        .emit("message", { ...mode, messageType: "mode" });
      res.json({ mode, status: 201 });
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "Mode couldn't be created",
      })
    );
});

//edit mode
router.post("/edit", verifyToken, verifyAdmin, (req, res) => {
  Mode.findOne({
    where: { id: req.body.id, instLinker: req.body.instLinker },
  })
    .then((mode) => {
      if (mode) {
        mode.name = req.body.name ? req.body.name : mode.name;
        mode.details = req.body.details ? req.body.details : mode.details;
        mode.credLinker = req.credLinker;
        mode.trace = req.body.trace ? req.body.trace : mode.trace;
        mode.live = 1;
        mode.deleted = req.body.deleted ? req.body.deleted : mode.deleted;
        mode.save();
        req.io
          .to(req.body.instLinker)
          .emit("message", { ...mode, messageType: "mode" });
        res.json({ mode, status: 200 });
      } else {
        res.json({ status: 404, message: "Mode not found" });
      }
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "Mode couldn't be edited",
      })
    );
});

//get modes
router.post("/get", verifyToken, (req, res) => {
  Mode.findAll({
    where: {
      instLinker: req.body.instLinker,
      trace: { [Op.gt]: req.body.online },
    },
  })
    .then((modes) => {
      res.json({ modes, status: 200 });
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "Unknown error",
      })
    );
});

module.exports = router;
