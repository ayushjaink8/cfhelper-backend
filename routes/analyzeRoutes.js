const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const {getAllDeltas} = require ("../services/predictRatingService");


router.get("/getRatingChangeData", 
  asyncHandler(async (req, res) => {
    const {contestId} = req.query;
    const data = await getAllDeltas(contestId);
    res.status(200).send(data);
  })
)

module.exports = router;
