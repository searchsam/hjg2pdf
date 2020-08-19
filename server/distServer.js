import compression from "compression";
import express from "express";
import open from "open";
import path from "path";

const app = express();
const cors = require("cors");
const port = 8002;

app.use(compression());
app.use(express.static("client/dist"));

app.options('*', cors());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

app.listen(port, err => {
  console.log(`CORS-enabled web server listening on port ${port}`);
  if (err) {
    console.log(err);
  } else {
    open(`http://localhost:${port}`);
  }
});
