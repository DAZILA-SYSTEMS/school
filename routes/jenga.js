const fetch = require("isomorphic-fetch");
const express = require("express");
const Sub = require("../models/Sub");
const router = express.Router();

const GenerateAccessToken = async (req, res) => {
  try {
    const customHeaders = new Headers();
    customHeaders.append("Api-Key", process.env.JENGA_KEY);
    customHeaders.append("Content-Type", "application/json");
    const response = await fetch(
      `https://uat.finserve.africa/authentication/api/v3/authenticate/merchant`,
      {
        method: "POST",
        body: JSON.stringify({
          merchantCode: process.env.JENGA_CODE,
          consumerSecret: process.env.JENGA_SECRET,
        }),
        headers: customHeaders,
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to generate Access Token:", error);
  }
};

router.post("/token", async (req, res) => {
  try {
    let response = await GenerateAccessToken(req, res);
    console.log(response);
    res.status(200).json({ status: "success", response });
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to capture order." });
  }
});

module.exports = router;
