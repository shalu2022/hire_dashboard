const express = require("express");
const app = express();
const cors = require("cors");
const routes = require("./routes/jobRoutes");

app.use(cors());
app.use("/", routes);

app.listen(4000, () => {
  console.log("server is listening");
});
