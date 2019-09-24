require("dotenv").config();

const express = require("express");
const bodyparser = require("body-parser");

const {
  getAllSeminars,
  insertNewSeminar
} = require("./infrastructure/database");

const app = express();

app.set("view engine", "pug");
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.get("/", (req, res) => {
  res.render("index", {
    title: "UC Davis Seminars",
    message: "Welcome to UC Davis Seminars"
  });
});

app.get("/seminars", async (req, res) => {
  console.log("ok");
  try {
    const seminars = await getAllSeminars();
    res.render("seminars", {
      seminars: seminars.Items
    });
  } catch (err) {
    res.render("error", { err: err });
  }
});

app.get("/add-seminar", (req, res) => {
  res.render("add-seminar");
});

app.get("/health", (req, res) => {
  res.sendStatus(200);
});

app.post("/seminars", async (req, res) => {
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
