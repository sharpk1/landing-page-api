const express = require("express");
const app = express();
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();
app.use(cors());

app.use(express.json());

app.post("/api/send-email", (req, res) => {
  const formData = req.body;

  // Create a Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Create the email message
  const message = {
    from:  process.env.EMAIL_USER,
    to:  process.env.EMAIL_USER,
    subject: "New project inquiry",
    html: `
      <p>First Name: ${formData.firstName}</p>
      <p>Last Name: ${formData.lastName}</p>
      <p>Email: ${formData.email}</p>
      <p>Phone Number: ${formData.phoneNumber}</p>
      <p>Project Description: ${formData.projectDescription}</p>
    `,
  };

  // Send the email
  transporter.sendMail(message, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "An error occurred while sending the email" });
    } else {
      console.log("Email sent:", info.response);
      res.status(200).json({ message: "Email sent successfully" });
    }
  });
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
