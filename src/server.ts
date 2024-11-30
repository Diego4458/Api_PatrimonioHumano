require('express-async-errors');

import express from "express";

//Set Locale has to be settled before Routes because of the calling order
import { setLocale } from "yup";
import { pt } from "yup-locale-pt";
setLocale(pt);

import routes from "./router";
import { ValidationErrorHandler } from "./Utils/ValidationErrorHandling";
import dotenv from "dotenv";

var cors = require("cors");
var bodyParser = require("body-parser");

//Init dotenv
dotenv.config();

const app = express();
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public'))
app.use(routes);
app.use(ValidationErrorHandler);

app.use(express.static('Secret'))

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.warn(`[server]: Server is running at http://localhost:${port}`);
});
