const express = require("express");
const router = express.Router();
const axios = require("axios");
const crypto = require("crypto");
const Ticket = require("./models/ticketModel");
const Buses=require("./models/busModel")
const redis = require("./redisClient");
const tokenChecker = require("./middleware/tokenChecker");
require("dotenv").config();

const APP_ID = process.env.CASHFREE_API_ID;
const SECRET_KEY = process.env.CASHFREE_API_SECRET;

router.post("/create-payment-link",tokenChecker,  async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, amount } = req.body;

    const data = {
      customer_details: {
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
      },
      link_amount: amount,
      link_currency: "INR",
      link_id: `${Date.now().toString(36) + Math.random().toString(36)}`,
      // link_notify: true,
      link_purpose: "Bus ticket booking",
      link_expiry: Math.floor(Date.now() / 1000) + 3600 * 24,
      link_notify: {
        send_sms: true,
        send_email: true,
      },
    };

    const response = await axios.post(
      "https://sandbox.cashfree.com/pg/links",
      data,
      {
        headers: {
          "x-client-id": APP_ID,
          "x-client-secret": SECRET_KEY,
          "Content-Type": "application/json",
          "x-api-version": "2023-08-01",
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to create payment link" });
  }
});

router.post(
  "/webhook/payment",
  express.json({ type: "*/*" }),
  async (req, res) => {
    const data1 = req.body;
    console.log("📬 Webhook received:", req.body);
    
    if (data1.data.payment.payment_status === "SUCCESS") {
      const email = data1.data.customer_details.customer_email;
      const getTicket = await Ticket.findOne({ email, status: "PENDING" });
      getTicket.status = "CONFIRMED";
      await getTicket.save();
      const BusNumber = getTicket.BusNumber;
      const getBus = await Buses.findOne({ BusNumber });
      getBus.SeatCount = getBus.SeatCount - 1;
      await getBus.save();
      const ticket_cacheKey = `User ticket registered with email:${getTicket.email}`;
      const getRedis_ticket = await redis.get(ticket_cacheKey);
      if (!getRedis_ticket) {
        await redis.setEx(ticket_cacheKey, 60, JSON.stringify(getTicket));
      }
      const bus_cacheKey = `Bus from ${getBus.from} to ${getBus.to}`;
      await redis.setEx(bus_cacheKey, 60, JSON.stringify(getBus));

    }
    
    res.sendStatus(200); // Always respond 200 quickly
  }
);

module.exports = router;
