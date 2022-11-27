import express from "express";
import bodyParser from "body-parser";
import http from "http";
import { Socket } from "socket.io";

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/",(req,res)=>{
    res.sendFile("index.html");
})

const Server = http.Server(app);

Server.listen(3000, ()=>{
    console.log("Escuchando en el puerto 3000.");
});