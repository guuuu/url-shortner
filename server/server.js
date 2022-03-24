const dotenv = require('dotenv');
dotenv.config();
const express = require("express");
const app = express();
const monk = require("monk");
const helmet = require("helmet");
const PORT = process.env.PORT || 8080;
const yup = require("yup");
const { nanoid } = require("nanoid");
const db = monk(process.env.MONGODB_URI)
const urls = db.get("urls");
const path = require("path");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit")

const limiter = rateLimit({
	windowMs: 60 * 60 * 1000,
	max: 4,
    message: "Your making too many requests (20 urls per hour)",
	standardHeaders: true,
	legacyHeaders: false,
});

app.use(helmet());
app.use(express.json());
app.use("/gen", limiter);
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const schema = yup.object().shape({
    id: yup.string().trim().matches(/[a-zA-Z0-9_\-]/i),
    url: yup.string().trim().url().required()
})
app.get("/:id", async (req, res, next) => {
    const { id } = req.params;
    const data = await urls.findOne({ "id": id });
    if(!data){ res.status(404).redirect(`/?error=${id} not found`); }
    else{ res.status(301).redirect(data.url); }
});

app.post("/gen", limiter, async (req, res, next) => {
    if(req.rateLimit.remaining > 0){
        let { id, url } = req.body;
        try{
            if(!id){ id = nanoid(6); }
            else{
                const exists = await urls.findOne({ id });
                if(exists){ throw new Error("This short URL is already in use. 🍔"); }
            }
            await schema.validate({ id, url });
            id = id.toLowerCase();
            const ins = await urls.insert({ "id": id, "url": url });
            if(ins){ res.status(200).json({ "message": null, "short_url": `${req.secure ? "https" : "http"}:\/\/${req.get("host")}/${id}` }); }
            else{ throw new Error("Something went wrong. 🤦"); }
        }
        catch(err){ next(err) }
    }
    else{ res.status(429).json({ "message": "Your sending too many requests." }) }
});

app.use((error, req, res, next) => {
    if(error.status) res.status(error.status)
    else res.status(500)
    res.json({
        message: error.message,
        stack: process.env.NODE_ENV === "production" ? "🥞" : error.stack
    });
});

app.listen(PORT, () => { console.log(`Server listening on port ${PORT}`); })