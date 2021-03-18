const express = require("express");
const bodyParser = require("body-parser");
const router = require("./src/routes");

const app = express();

const port = 5000;

app.use(express.json());

app.use("/api/v1", router);

// app.get("/", (req, res) => {
//   res.send("hello ihsan");
// });

app.listen(port, () => console.log("berhasil"));
