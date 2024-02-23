const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: 'https://gulzhankarakul.github.io/my-portfolio/',
  methods: ['POST'], // Указываете только методы, которые разрешены на вашем сервере
  optionsSuccessStatus: 200 // Необходимо для старых браузеров
}));

app.use(express.json());

const contactEmail = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

contactEmail.verify((error) => {
  if (error) {
    console.error('Error verifying email connection:', error);
  } else {
    console.log("Ready to Send");
  }
});

app.post("/contact", (req, res) => {
  const { firstName, lastName, email, message, phone } = req.body;
  const name = `${firstName} ${lastName}`;

  const mail = {
    from: {
      name: `${name}`,
      address: process.env.EMAIL_USER,
    },
    to: "karakulgulzhan@gmail.com",
    subject: "Contact Form Submission - Portfolio",
    html: `<p>Name: ${name}</p>
           <p>Email: ${email}</p>
           <p>Phone: ${phone}</p>
           <p>Message: ${message}</p>`,
  };

  contactEmail.sendMail(mail, (error) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Failed to send email' });
    } else {
      res.status(200).json({ message: "Message Sent" });
    }
  });
});

exports.addMessage = functions.https.onRequest(app);
