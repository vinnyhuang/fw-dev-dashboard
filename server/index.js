#!/usr/bin/env node
"use strict";

var SocketIO = require("socket.io");
var _ = require("lodash");
var formatOutput = require("../utils/format-output.js");

function Server(options) {
  var port = options.port || 9838;
  var server = SocketIO(port);
  var plugin = server.of('/plugin');
  var dashboard = server.of('/dashboard');

  var state = {};
  state.buildLog = state.lintLog = state.testLog = state.operation = state.buildStatus = state.lintStatus = state.testStatus = "";
  state.progress = 0;

  plugin.on("connection", function(socket) {
    socket.emit("event", state);

    socket.on("event", function(message) {
      state = processEvents(state, message);
      dashboard.emit("event", state);
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

function processEvents(state, events) {
  // console.log(events);
  var newState = _.assign({}, state);
  _.forEach(events, function(event) {
    // console.log("processing", event.type);
    switch (event.type) {
      case "progress": {
        newState.progress = parseInt(event.value * 100);
        break;
      }
      case "operations": {
        newState.operations = event.value;
        break;
      }
      case "status": {
        newState.buildStatus = event.value; // In original, used renderStatus()
        break;
      }
      case "stats": {
        var stats = {
          hasErrors: function() {
            return event.value.errors;
          },
          hasWarnings: function() {
            return event.value.warnings;
          },
          toJson: function() {
            return event.value.data;
          }
        };
        if (stats.hasErrors()) {
          newState.buildStatus = "Failed";  // Originally "{red-fg}{bold}Failed{/}"
        }
        newState.buildLog = state.buildLog + formatOutput(stats);
        break;
      }
      case "log": {
        // var filteredValue = event.value.replace(/[{}]/g, "");
        // newState.buildLog = filteredValue;
        newState.buildLog = state.buildLog + event.value;
        // console.log("in case log", event.value, newState.buildLog);
        break;
      }
      case "clear": {
        newState.buildLog = "";
        break;
      }
      case "lint-status": {
        newState.lintStatus = event.value;  // renderStatus
        break;
      }
      case "lint": {  // self.minimal?
        // var formatted = event.value.replace(/\[\d+m/g, "");
        // var indented = formatted.match()
        // newState.lintLog = state.lintLog + formatted;
        newState.lintLog = state.lintLog + event.value;
        break;
      }
      case "test-status": {
        newState.testStatus = event.value;;  // renderStatus
        break;
      }
      case "test": {
        newState.testLog = state.testLog + event.value;
        break;
      }
    }
  });

  return newState;
}

module.exports = Server;