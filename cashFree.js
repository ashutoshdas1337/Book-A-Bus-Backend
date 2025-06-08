const express=require("express")
const router=express.Router()
const axios=require("axios")
const crypto=require("crypto");
const tokenChecker = require("./middleware/tokenChecker");
require("dotenv").config()

const APP_ID =process.env.CASHFREE_API_ID;
const SECRET_KEY = process.env.CASHFREE_API_SECRET

router.post("/create-payment-link", tokenChecker,async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, amount } = req.body;

    const data = {
      customer_details: {
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone
      },
      link_amount: amount,
      link_currency: "INR",
      link_id:`${Date.now().toString(36) + Math.random().toString(36)}`,
      // link_notify: true,
      link_purpose: "Bus ticket booking",
      link_expiry: Math.floor(Date.now() / 1000) + 3600 * 24,
      link_notify:{
        "send_sms":true,
        "send_email":true
      }
    };

    const response = await axios.post(
      "https://sandbox.cashfree.com/pg/links",
      data,
      {
        headers: {
          "x-client-id": APP_ID,
          "x-client-secret": SECRET_KEY,
          "Content-Type": "application/json",
          "x-api-version":"2023-08-01"
        }
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to create payment link" });
  }
});
router.post("/webhook/payment", express.json({ type: "*/*" }), (req, res) => {
    const data=req.body
    if(data.payment.payment_status==="SUCCESS")
  console.log("📬 Webhook received:", req.body);
  res.sendStatus(200); // Always respond 200 quickly
});

module.exports=router