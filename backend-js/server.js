import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));

const CLIENT_ID = "eaeda082a6cb9bc7e434";
const CLIENT_SECRET = "eeb06371d838a48c069ac0d9d74bfb62edf57283";

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/getAccessToken", async function (req, res) {
    const params =
        "?client_id=" +
        CLIENT_ID +
        "&client_secret=" +
        CLIENT_SECRET +
        "&code=" +
        req.query.code;
    await fetch("https://github.com/login/oauth/access_token"+params, {
        method: "POST", 
        headers: {
            "Accept": "application/json"
        }
    }).then((response) => {
        return response.json();
    }).then((data)=> {
        console.log(data);
        res.cookie("accessToken", { httpOnly: true });
        res.json(data);
    })
});

app.get('/getUserData', async function(req,res){
    req.get("Authorization");
    await fetch("https://api.github.com/user", {
        method: "GET",
        headers: {
            "Authorization": req.get("Authorization") //Bearer ACCESSTOKEN
        }
    }).then((response) => {
        console.log(response);
        return response.json();
    }).then((data) => {
        console.log(data);
        res.json(data);
    })
});

app.listen(4000, function () {
    console.log("Backend server running on port 4000!");
});
