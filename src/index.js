import express from "express";
import { google } from "googleapis"
import dotenv from "dotenv";
dotenv.config()
const app = express();

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
);

const scopes = [
  'https://www.googleapis.com/auth/calendar'
];

app.get("/google", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes
  });
  res.redirect(url);
})

app.get("/", (req, res) => {
  res.send("user authenticated, it's working")
})

app.listen(5000, () => {
  console.log("server running on port 5000")
})
