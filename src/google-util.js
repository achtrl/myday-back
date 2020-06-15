const { google } = require("googleapis");
const axios = require("axios");

require("dotenv").config();

class googleUtil {
  constructor() {
    this.clientId = process.env.GOOGLE_CLIENT_ID;
    this.clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    this.redirect = process.env.GOOGLE_CLIENT_REDIRECT;
    this.defaultScope = [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/calendar.events.readonly",
    ];
  }

  createConnection() {
    return new google.auth.OAuth2(
      this.clientId,
      this.clientSecret,
      this.redirect
    );
  }

  getConnectionUrl(auth) {
    return auth.generateAuthUrl({
      access_type: "offline",
      prompt: "consent", // access type and approval prompt will force a new refresh token to be made each time signs in
      scope: this.defaultScope,
    });
  }

  urlGoogle() {
    const auth = this.createConnection();
    const url = this.getConnectionUrl(auth);
    return url;
  }

  async getAccessTokenFromCode(code) {
    return await axios
      .post("https://oauth2.googleapis.com/token", {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: this.redirect,
        grant_type: "authorization_code",
        code,
      })
      .then((response) => {
        return response;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async getGoogleUserInfos(access_token) {
    return await axios
      .get("https://www.googleapis.com/oauth2/v1/userinfo?alt=json", {
        headers: {
          Authorization: "Bearer" + access_token,
        },
      })
      .then((response) => {
        return response;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async getGoogleCalendarEvents(access_token) {
    var start = new Date();
    start.setHours(0, 0, 0, 0);
    var end = new Date();
    end.setHours(23, 59, 59, 999);

    return await axios
      .get(`https://www.googleapis.com/calendar/v3/calendars/primary/events`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        params: {
          orderBy: 'startTime',
          singleEvents: 'true',
          timeMin: `${start.toISOString()}`,
          timeMax: `${end.toISOString()}`
        }
      })
      .then((response) => {
        return response;
      })
      .catch((err) => {
        console.log("error");
      });
  }
}

module.exports = googleUtil;
