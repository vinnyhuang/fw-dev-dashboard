/* eslint-disable */
"use strict";

var webpack = require("webpack");
// var net = require("net");
var SocketIOClient = require("socket.io-client");
var runCommand = require("../utils/run-command.js");

function noop() {}

function DashboardPlugin(options) {
  if (typeof options === "function") {
    this.handler = options;
  } else {
    options = options || {};
    this.port = options.port || 9838;
    this.handler = options.handler || null;
  }
}

function getCurrentTime() {
  return parseInt((new Date()).getTime() / 1000, 10);
}

function getTimeMessage(timer) {
  return ' (' + (getCurrentTime() - timer) + 's)';
}

function removeTerminalColor(text) {
  return text.replace(
    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
    ''
  );
}

DashboardPlugin.prototype.apply = function(compiler) {
  var handler = this.handler;
  var timer;

  if (!handler) {
    handler = noop;
    var port = this.port;
    var host = "127.0.0.1";
    var socket = SocketIOClient("http://" + host + ":" + port + "/plugin");
    socket.on("connect", function() {
      handler = socket.emit.bind(socket, "event");
    });
  }

  compiler.apply(new webpack.ProgressPlugin(function (percent, msg) {
    handler.call(null, [{
      type: "status",
      value: "Compiling"
    }, {
      type: "progress",
      value: percent
    }, {
      type: "operations",
      value: msg + getTimeMessage(timer)
    }]);
  }));

  compiler.plugin("compile", function() {
    timer = getCurrentTime();
    handler.call(null, [{
      type: "status",
      value: "Compiling"
    }]);
  });

  compiler.plugin("invalid", function() {
    handler.call(null, [{
      type: "status",
      value: "Invalidated"
    }, {
      type: "progress",
      value: 0
    }, {
      type: "operations",
      value: "idle"
    }, {
      type: "clear"
    }]);
  });

  compiler.plugin("done", function(stats) {
    handler.call(null, [{
      type: "status",
      value: "Success"
    }, {
      type: "progress",
      value: 1
    }, {
      type: "operations",
      value: "idle" + getTimeMessage(timer)
    }, {
      type: "stats",
      value: {
        errors: stats.hasErrors(),
        warnings: stats.hasWarnings(),
        data: stats.toJson()
      }
    }]);
  });

  compiler.plugin("failed", function() {
    handler.call(null, [{
      type: "status",
      value: "Failed"
    }, {
      type: "operations",
      value: "idle" + getTimeMessage(timer)
    }]);
  });

  compiler.plugin("compile", function() {
    handler.call(null, [{
      type: "lint-status",
      value: "Running"
    }]);

    var appendLintData = function(data) {
      // move errors to the end
      var messages = data.toString('utf-8').split("\n\n");
      var warnings = [];
      var errors = [];
      var others = [];

      messages.forEach(function(m) {
        // console.log("lint message: ", m);
        var messageNoColor = removeTerminalColor(m).trim();
        var lineNumbers = messageNoColor.match(/\n[>\s\d]*\|/g);
        if (lineNumbers === null) { lineNumbers = []; }
        // console.log("lineNumbers", lineNumbers);
        var maxIndentLength = lineNumbers.reduce(function(max, line) {
          return line.length > max ? line.length : max;
        }, 0);
        var indented = messageNoColor.replace(/\n[>\s\d]*\|/g, function(match) {
          return '\n' + Array(maxIndentLength - match.length + 1).fill(' ').join('')+ match.slice(1);
        });

        if (messageNoColor.startsWith('warning:')) {
          // warnings.push(m);
          // warnings.push(messageNoColor);
          warnings.push(indented);
        } else if (messageNoColor.startsWith('error:')) {
          // errors.push(m);
          // errors.push(messageNoColor);
          errors.push(indented);
        } else {
          // others.push(m);
          // others.push(messageNoColor);
          others.push(indented);
        }
      });

      var value = warnings.concat(errors).concat(others).join("\n\n");

      handler.call(null, [{
        type: "lint",
        value: value
      }]);
    };

    var setLintStatus = function(code) {
      handler.call(null, [{
        type: "lint-status",
        value: code === 0 ? 'Success' : 'Failed'
      }]);
    };

    runCommand("npm run --silent lint_min", appendLintData, appendLintData, setLintStatus);
  });

  compiler.plugin("done", function(stats) {
    handler.call(null, [{
      type: "test-status",
      value: "Running"
    }]);

    var appendTestData = function(data) {
      var value = data.toString('utf-8');

      // escape control commands
      var control1 = '\u001b[2J';
      var control2 = '\u001b[1;3H';
      if (
        !value.startsWith(control1) &&
        !value.startsWith(control2)
      ) {
        handler.call(null, [{
          type: "test",
          value: removeTerminalColor(value)
        }]);
      }
    };

    var appendTestError = function(data) {
      var value = data.toString('utf-8');

      if (!value.startsWith('Warning: ')) {
        handler.call(null, [{
          type: "test",
          value: removeTerminalColor(value)
        }]);
      }
    };

    var setTestStatus = function(code) {
      handler.call(null, [{
        type: "test-status",
        value: code === 0 ? 'Success' : 'Failed'
      }]);
    };

    runCommand("npm run --silent test_min", appendTestData, appendTestError, setTestStatus);
  });
}

module.exports = DashboardPlugin;
