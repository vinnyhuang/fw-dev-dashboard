#!/usr/bin/env node
"use strict";

var SocketIO = require("socket.io");

function Server(options) {
  var port = options.port || 9838;
  var server = SocketIO(port);
  var plugin = server.of('/plugin');
  var dashboard = server.of('/dashboard');

  plugin.on("connection", function(socket) {
    socket.on("event", function(message) {
      dashboard.emit("event", message);
    });
  });
  dashboard.on("connection", function(socket) {
    // console.log("dashboard connected");
    socket.on("job", function(message) {
      plugin.emit("job", message);
    });
  });

  server.on("error", function(err) {
    console.log(err);
  });
}

module.exports = Server;