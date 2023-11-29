var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const amqp = require("amqplib");
const { sendMessage } = require("./send");
const cors = require("cors");

var app = express();

app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send("Real-time application");
});
app.post("/message", (req, res) => {
  const message = {
    jobTitleAndLocation: req.body.jobTitleAndLocation,
    toEmail: req.body.email,
  };
  console.log("--->", message);
  // const message = [req.body.jobTitleAndLocation, req.body.toEmail];
  sendMessage(JSON.stringify(message));

  res.sendStatus(200);
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err,
  });
});

app.listen(3003, () => {
  console.log("Server started on port 3000");
});

module.exports = app;
