const express = require("express");
const fs = require("fs");
const path = require("path");

const port = 8081;
const app = express();
app.use("/pics", (req, res) => {
  const data = fs.readdirSync(path.join(process.cwd(), "pic"));
  res.json(data);
});
app.use("/dbs", (req, res) => {
  const data = fs.readdirSync(path.join(process.cwd(), "dbs"));
  res.json(data);
});
app.use(express.static(path.join(process.cwd(), "dbs")));
app.use(express.static(path.join(process.cwd(), "pic")));
app.listen(port);
