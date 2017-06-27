#!/usr/bin/env node
"use strict";

var commander = require("commander");
var spawn = require("cross-spawn");
// var Dashboard = require("../dashboard/terminal.js");
var SocketIOClient = require("socket.io-client");
var Server = require("../server/index.js");
var express = require("express");
// var morgan = require("morgan");
var path = require("path");

var program = new commander.Command("fw-dev-dashboard");

var pkg = require("../package.json");
program.version(pkg.version);
program.option("-c, --color [color]", "Dashboard color");
program.option("-m, --minimal", "Minimal mode");
program.option("-t, --title [title]", "Terminal window title");
program.option("-p, --port [port]", "Socket listener port");
program.usage("[options] -- [script] [arguments]");
program.parse(process.argv);

if (!program.args.length) {
  program.outputHelp();
  return;
}

var command = program.args[0];
var args = program.args.slice(1);
var env = process.env;

env.FORCE_COLOR = true;

var child = spawn(command, args, {
  env: env,
  stdio: [null, null, null, null],
  detached: true
});

var port = program.port || 9838;
Server({ port: program.port });

// var dashboard = new Dashboard({
//   color: program.color || "green",
//   minimal: program.minimal || false,
//   title: program.title || null
// });

// var host = "127.0.0.1";
// var socket = SocketIOClient("http://" + host + ":" + port + "/dashboard");

// socket.on("event", function(event) {
//   dashboard.setData(event);
// });

// child.stdout.on("data", function (data) {
//   dashboard.setData([{
//     type: "log",
//     value: data.toString("utf8")
//   }]);
// });

// child.stderr.on("data", function (data) {
//   dashboard.setData([{
//     type: "log",
//     value: data.toString("utf8")
//   }]);
// });

var host = "127.0.0.1";
var socket = SocketIOClient("http://" + host + ":" + port + "/plugin");

child.stdout.on("data", function (data) {
  socket.emit("event", [{
    type: "log",
    value: data.toString("utf8")
  }]);
});

child.stderr.on("data", function (data) {
  socket.emit("event", [{
    type: "log",
    value: data.toString("utf8")
  }]);
});

var app = express();
app.use(express.static(path.resolve(__dirname, '..', 'dashboard')));

process.on("exit", function () {
  process.kill(process.platform === "win32" ? child.pid : -child.pid);
});
