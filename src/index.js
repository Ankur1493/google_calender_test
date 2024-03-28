import express from "express";
import { google } from "googleapis"
import dotenv from "dotenv";
import { v4 as uuid } from "uuid"
dotenv.config()
const app = express();

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
);

const calendar = google.calendar({
  version: "v3",
  auth: process.env.API_KEY,
})
const event = {
  'summary': 'test',
  'location': 'A93 st6 east Azad Nagar',
  'description': 'This is the most important test',
  'start': {
    'dateTime': '2024-03-29T17:00:00+05:30',
    'timeZone': 'Asia/Kolkata',
  },
  'end': {
    'dateTime': '2024-03-29T19:00:00+05:30',
    'timeZone': 'Asia/Kolkata',
  },
  'attendees': [
    { 'email': 'uditkapoor060@gmail.com' },
  ],
  'conferenceData': {
    'createRequest': {
      'requestId': uuid()
    }
  },
  'reminders': {
    'useDefault': false,
    'overrides': [
      { 'method': 'email', 'minutes': 24 * 60 },
      { 'method': 'popup', 'minutes': 10 },
    ],
  },
};

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

app.get("/", async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oauth2Client.getToken(code)
  oauth2Client.setCredentials(tokens);

  res.send("user authenticated, it's working")
})


app.get("/schedule_event", async (req, res) => {

  console.log(oauth2Client.credentials.access_token)

  await calendar.events.insert({
    calendarId: "primary",
    auth: oauth2Client,
    requestBody: event,
    sendUpdates: "all",
    conferenceDataVersion: 1,
  });

  res.send("Completed");
});


app.listen(5000, () => {
  console.log("server running on port 5000")
})
