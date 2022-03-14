
const express = require("express");
const app = express()
require('dotenv').config()

const http = require("http");
const httpServer = http.createServer(app);
const io = require("socket.io")(httpServer, {cors: {origin: "*",}, });

const { v4 } = require("uuid") 



app.set("view engine","ejs")
app.use(express.static("public"))

app.get("/" , (req,res) =>{
    res.redirect(`${v4()}`)
})


app.get("/:room",(req,res)=>{
    res.render('room' ,{roomId : req.params.room})
})


io.on("connection",(socket) => {
    socket.on("join-room" , (roomId,userId) =>{
        console.log(roomId,userId);
        socket.join(roomId)
        socket.to(roomId).emit('user-connected', userId)

        socket.on("disconnect" , ()=>{
            socket.to(roomId).emit('user-disconnect' , userId)
        })
    })
 
})



httpServer.listen(process.env.SERVER_PORT || 3000, () => {
    console.log( process.env.SERVER_PORT + "............");
});