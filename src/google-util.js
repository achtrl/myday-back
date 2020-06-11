const {google} = require("googleapis");
const axios = require("axios");

require("dotenv").config();

const express = require('express');
const router = express.Router();

const googleConfig = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirect: process.env.GOOGLE_CLIENT_REDIRECT,
};

/**
 * Create the google auth object which gives us access to talk to google's apis.
 */
function createConnection() {
  return new google.auth.OAuth2(
    googleConfig.clientId,
    googleConfig.clientSecret,
    googleConfig.redirect
  );
}

/**
 * This scope tells google what information we want to request.
 */
const defaultScope = [
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/calendar.readonly"
];

/**
 * Get a url which will open the google sign-in page and request access to the scope provided (such as calendar events).
 */
function getConnectionUrl(auth) {
  return auth.generateAuthUrl({
    access_type: "offline",
    prompt: "consent", // access type and approval prompt will force a new refresh token to be made each time signs in
    scope: defaultScope,
  });
}

/**
 * Create the google url to be sent to the client.
 */
function urlGoogle() {
  const auth = createConnection(); // this is from previous step
  const url = getConnectionUrl(auth);
  return url;
}

/**
 * Create access token from code
 */

async function getAccessTokenFromCode(code) {
  return await axios.post("https://oauth2.googleapis.com/token", {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_CLIENT_REDIRECT,
      grant_type: 'authorization_code',
      code
  })
  .then((response) => {
    // console.log(response); // { access_token, expires_in, token_type, refresh_token }
    return response;
  })
  .catch((err) => {
    console.log(err);
  });
  
};

async function getGoogleUserInfos(access_token) {
  return await axios.get("https://www.googleapis.com/oauth2/v1/userinfo?alt=json", {
    headers: {
      Authorization: 'Bearer' + access_token,
    }
  })
  .then((response) => {
    return response;
  })
  .catch((err) => {
    console.log(err);
  })
};

async function getGoogleCalendarEvents(access_token) {
  return await axios.get("https://www.googleapis.com/calendar/v3/users/me/calendarList", {
    headers: {
      Authorization: 'Bearer' + access_token,
    }
  })
  .then((response) => {
    return response;
  })
  .catch((err) => {
    console.log(err);
  })
}

/**
 * Google route
 */

router.get('/', (req, res) => {
  res.send(urlGoogle());
});

router.post('/', (req,res) => {
  const code = req.body.code;
  getAccessTokenFromCode(code).then((response) => {
    // getGoogleUserInfos(response.data.access_token).then((response) => {
    //   console.log(response.data);
    // })
    // console.log(response.data);
    getGoogleCalendarEvents(response.data.access_token).then((response) => {
      console.log(response);
    })
  })
});

module.exports = router;