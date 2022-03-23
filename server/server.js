const express = require("express");
const app = express();
const fs = require("fs");
const monk = require("monk");
const helmet = require("helmet");
const PORT = process.env.PORT || 8080;
const dotenv = require('dotenv');

app.use(helmet());
app.use(express.static("/public"));
app.use(express.json);

dotenv.config();

app.get("/", (req, res, next) =>{
    res.status(200).send({
        "message": "ok"
    })
})

app.get("/:id", (req, res, next) => {
    res.status(200).send({
        "message": "test"
    })
})

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})