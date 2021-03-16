const app = require('./app'); // Express aplikacija 
const http = require('http');
const config = require('./utils/config');

const server = http.createServer(app);

const io = require("socket.io")(server, {
    cors: {
        origin: "*"
    }
});

//----SOCKET.IO DOGAĐAJI----//
const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
const NEW_MESSAGE_NOTIFICATION_EVENT = "newMessageNotification";
const USER_EJECTED_FROM_CHANNEL_EVENT = "userEjectedNotification";

// što će se dogoditi na određeni događaj
io.on("connection", (socket) => {
    // most između websocketa i httpa
    // dogovaraju se detalji veze i ukoliko je sve u redu, ostvaruje se veza (websocket)
    // query je ono na čemu se dogovaraju server i klijent (soba)
    const { soba } = socket.handshake.query;
    socket.join(soba);
    console.log(`connected`);

    // kada primi novu poruku od korisnika u kanalu, emitira je ostalim korisnicima
    socket.on(NEW_CHAT_MESSAGE_EVENT, (data) => {
        io.in(soba).emit(NEW_CHAT_MESSAGE_EVENT, data);
    });

    // kada se pošalje poruka na nekom kanalu, emitira se obavijest o tome ostalim korisnicima
    socket.on(NEW_MESSAGE_NOTIFICATION_EVENT, (data) => {
        console.log("new notification");
        io.emit(NEW_MESSAGE_NOTIFICATION_EVENT, data);
    });

    // kada se izbaci korisnika na nekom kanalu, emitira se obavijest o tome ostalim korisnicima 
    // (ali na klijentu osluškuje samo onaj kome je namijenjena)
    socket.on(USER_EJECTED_FROM_CHANNEL_EVENT, (data) => {
        console.log("user ejected");
        io.emit(USER_EJECTED_FROM_CHANNEL_EVENT, data);
    });

    // kada korisnik izađe iz sobe, prekida se direktna veza
    socket.on("disconnect", () => {
        console.log("disconnected");
        socket.leave(soba);
    });
});

server.listen(config.PORT, () => {
    console.log(`Server je pokrenut na portu ${config.PORT}`);
})