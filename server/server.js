require("dotenv").config();

const express = require("express");
const bodyparser = require("body-parser");
const passport = require("passport");
const Auth0Strategy = require("passport-auth0");
const session = require("express-session");
const authRouter = require("./routes/auth");
const secured = require("./middleware/secured");
const userInViews = require("./middleware/userInViews");
const userRouter = require("./routes/user");
const {
  getAllSeminars,
  insertNewSeminar
} = require("./infrastructure/database");

const sessionParams = {
  secret: "LoxodontaElephasMammuthusPalaeoloxodonPrimelephas",
  cookie: {},
  resave: false,
  saveUninitialized: false
};

const strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL:
      process.env.AUTH0_CALLBACK_URL || "http://localhost:8080/callback"
  },
  function(accessToken, refreshToken, extraParams, profile, done) {
    return done(null, profile);
  }
);

if (process.env.NODE_ENV === "production") {
  sessionParams.cookie.secure = true; // Serve secure cookies, requires HTTPS
}

const app = express();

app.set("view engine", "pug");
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.use(session(sessionParams));
passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());
app.use(userInViews);
app.use(authRouter);
app.use(userRouter);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get("/health", (req, res) => {
  res.sendStatus(200);
});

app.get("/", (req, res) => {
  res.render("index", {
    title: "UC Davis Seminars",
    message: "Welcome to UC Davis Seminars"
  });
});

app.get("/seminars", async (req, res) => {
  try {
    const seminars = await getAllSeminars();
    res.render("seminars", {
      seminars: seminars.Items
    });
  } catch (err) {
    res.render("error", { err: err });
  }
});

app.get("/add-seminar", secured, (req, res) => {
  res.render("add-seminar");
});

app.post("/seminars", secured, async (req, res) => {
  const { title, description, room, startDate, speaker } = req.body;

  await insertNewSeminar({
    title,
    description,
    room,
    startDate: startDate,
    speaker
  });
  res.redirect("/seminars");
});

app.listen(process.env.PORT);
