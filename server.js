var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);
var path = require("path");

app.get("/", function(req, res, next) {
    res.sendFile(__dirname + "/public/index.html");
    app.use("/public", express.static(path.join(__dirname, "public")));
});

app.use(express.static("public"));

io.on("connection", function(client) {
    console.log("Client connected...");

    client.on("join", function(data) {
        console.log(data);

        client.emit("loadmessages", function(data) {
            //TODO: read data from xmls and generate code
        })
    });

    client.on("messages", function(data) {
        client.emit("thread", data);
        client.broadcast.emit("thread", data);
        //TODO. add to xml
    });
});

server.listen(7777);