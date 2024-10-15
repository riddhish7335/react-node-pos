const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
require('dotenv').config();
const db = require("./config/db");
const authRouter = require("./Routes/authRoutes");
const categoryRouter = require("./Routes/categoryRoutes");
const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(cors())
app.use(bodyParser.json());

app.use("/users",authRouter);
app.use("/categories",categoryRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});