const express = require("express");
const busRoute = express.Router();
console.log("importing bus model")
const Busmodel = require("../models/busModel");
console.log("bus model file imported")
const redis = require("../redisClient");
const tokenChecker = require("../middleware/tokenChecker");


const getBuses = async (req, res) => {
  try {
    const { from, to } = req.body;
    const cacheKey = `buses from ${from} to ${to}`;
    const findBus = await redis.get(cacheKey);
    if (findBus)
      return res
        .status(200)
        .json({
          message: `buses from ${from} to ${to} (from cache)`,
          retrieve: JSON.parse(findBus),
        });
    const currentTime = Date.now();
    const retrieveBuses = await Busmodel.find({
      from,
      to,
      SeatCount: { $gt: 0 },
    });
    await redis.setEx(cacheKey, 60, JSON.stringify(retrieveBuses));
    return res
      .status(200)
      .json({
        message: `retrieved buses from ${from} to ${to} (from DB)`,
        retrieveBuses,
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "error occured while getting buses" });
  }
};


const addBus = async (req, res) => {
  try {
    const {
      BusOperator,
      BusType,
      ServiceType,
      SeatCount,
      from,
      to,
      via,
      BusFare,
      departure,
      arrival,
      BusNumber
    } = req.body;
    if (
      !BusOperator ||
      !BusType ||
      !ServiceType ||
      !SeatCount ||
      !from ||
      !to ||
      !via ||
      !BusFare ||
      !departure ||
      !arrival||!BusNumber
    )
      return res
        .status(400)
        .json({ message: "Please provide complete information" });
    const createBus = new Busmodel({
      BusOperator,
      BusType,
      ServiceType,
      SeatCount,
      from,
      to,
      via,
      BusFare,
      departure,
      arrival,BusNumber
    });
    await createBus.save();
    return res.status(200).json({ message: "Bus added succesfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "error ocuured while adding bus" });
  }
};


const retrieveBusDetails = async (req, res) => {
  const {BusNumber} = req.body;
  if (!BusNumber) return res.status(400).json({ message: "Please provide id" });
  try {
    const cacheKey = `busNumber:${BusNumber}`;
    const getBus = await redis.get(cacheKey);
    if (getBus)
      return res
        .status(200)
        .json({
          message: "Retrived bus from cache(redis)",
          busDetails: JSON.parse(getBus),
        });
    const findBus = await Busmodel.findOne({BusNumber});
    if (!findBus)
      return res.status(404).json({ message: "bus does not exists" });
    await redis.setEx(cacheKey, 60, JSON.stringify(findBus));
    return res
      .status(200)
      .json({ message: "requested Bus data (from db)", findBus });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "error occured while fetching bus details" });
  }
};

busRoute.post("/addBus", addBus);
busRoute.post("/getBuses/getBusDetails", retrieveBusDetails);
busRoute.post("/getBuses", getBuses);
module.exports = busRoute;
