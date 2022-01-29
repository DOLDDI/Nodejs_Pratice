const express = require("express");
const app = express();
const path = require("path");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


const main = require("./routes/main");
app.use("/", main);


var port = 3000;
app.listen(port, function() {
    console.log("서버 시작", port);
});