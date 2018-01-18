"use strict";

const http = require("http");
const fs = require("fs");
const io = require("socket.io");
const flaschenpost = require("flaschenpost");

const SocketService = function(config) {
  this.config = config;
  this.logger = flaschenpost.getLogger();
  this.server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<h1>hello dear friend!</h1>");
  });
};

SocketService.prototype.start = function() {
  this.server.listen(this.config.socketport);
  this.socket = io.listen(this.server);
  this.receivers = [];

  this.receiverList = function() {
    const tmpReceivers = [];

    for (let i = 0, len = this.receivers.length; i < len; i++) {
      tmpReceivers.push({
        id: this.receivers[i].id,
        name: this.receivers[i].name
      });
    }

    return tmpReceivers;
  };

  this.socket.on("connection", client => {
    this.logger.info("Connection to client established");

    client.on("register", opt => {
      if (opt.type === "receiver") {
        client.name = opt.name;
        client.type = opt.type;
        client.uid = opt.uid;
        this.receivers.push(client);
        this.logger.info(`receiver ${opt.name} registered`);
      }

      if (opt.type === "client") {
        this.socket.emit("clientId", client.id);
        this.logger.info(`client ${opt.name} registered`);
      }

      this.socket.emit("receiverList", this.receiverList());
    });

    client.on("getReceivers", () => {
      this.socket.emit("receiverList", this.receiverList());
    });

    client.on("getAnimationList", data => {
      this.socket.to(data.receiverId).emit("sendAnimationsToClient", data);
    });

    client.on("animationsFromReceiver", data => {
      this.socket.to(data.clientId).emit("animationList", data);
    });

    client.on("received", data => {
      this.socket.to(data.clientId).emit("receivedToClient", data);
    });

    client.on("message", event => {
      this.logger.info("Received message from client!", { event });
    });

    client.on("signalFromClient", data => {
      if (this.receivers.length === 0) {
        return this.logger.error("No receiver connected");
      }

      if (!data) {
        return this.logger.error("No payload");
      }

      for (let i = 0, len = this.receivers.length; i < len; i++) {
        if (this.receivers[i].id === data.receiverId) {
          this.logger.info("signalToReceiver", { data });
          this.socket.to(this.receivers[i].id).emit("signalToReceiver", data);
        }
      }
    });

    client.on("disconnect", () => {
      if (client.type === "receiver") {
        this.receivers.splice(this.receivers.indexOf(client), 1);
        this.socket.emit("receiverList", this.receiverList());
      }

      this.logger.info("Client has disconnected");
    });
  });

  this.logger.info(
    `Socket-Server running at: ${this.config.socketurl} Port: ${
      this.config.socketport
    }`
  );
};

module.exports = SocketService;
