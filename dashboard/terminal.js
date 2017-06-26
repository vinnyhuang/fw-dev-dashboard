/* eslint-disable */
"use strict";

var os = require("os");
var blessed = require("blessed");
var SocketIOClient = require("socket.io-client")

var formatOutput = require("../utils/format-output.js");

function Dashboard(options) {
  var title = options && options.title || "SPARK Dashboard";

  this.color = options && options.color || "green";
  this.invertedColor = options && options.invertedColor || "#8F00FF";
  this.minimal = options && options.minimal || false;
  this.setData = this.setData.bind(this);

  this.screen = blessed.screen({
    terminal: 'xterm-256color',
    smartCSR: true,
    title: title,
    dockBorders: false,
    fullUnicode: true,
    autoPadding: true
  });

  this.layoutLog.call(this);
  this.layoutStatus.call(this);
  !this.minimal && this.layoutLints.call(this);
  !this.minimal && this.layoutTests.call(this);

  this.screen.key(["escape", "q", "C-c"], function() {
    process.exit(0);
  });

  this.screen.on('element focus', function(cur, old) {
    var tooltip = 'move around with mouse scrolling or VI key bindings';
    var suffix = ' [Active]';
    if (old.parent.border) {
      var oldText = old.parent._label.getText();
      old.parent.style.border.fg = this.color;
      if (oldText.endsWith(suffix)) {
        old.parent._label.setContent(oldText.slice(0, oldText.length - suffix.length));
      }
      old.parent._label.removeHover();
    }
    if (cur.parent.border) {
      cur.parent.style.border.fg = this.invertedColor;
      cur.parent._label.setContent(cur.parent._label.getText() + suffix);
      cur.parent._label.setHover(tooltip);
    }
    this.screen.render();
  }.bind(this));

  this.screen.render();
}

function renderStatus(value) {
  switch(value) {
    case "Success":
      return "{green-fg}{bold}" + value + "{/}";
    case "Failed":
      return "{red-fg}{bold}" + value + "{/}";
    default:
      return "{bold}" + value + "{/}";
  }
}

Dashboard.prototype.setData = function(dataArr) {
  var self = this;

  dataArr.forEach(function(data) {
    switch (data.type) {
      case "progress": {
        var percent = parseInt(data.value * 100);
        if (self.minimal) {
          percent && self.progress.setContent(percent.toString() + "%");
        } else {
          percent && self.progressbar.setContent(percent.toString() + "%");
          self.progressbar.setProgress(percent);
        }
        break;
      }
      case "operations": {
        self.operations.setContent(data.value);
        break;
      }
      case "status": {
        self.buildStatus.setContent(renderStatus(data.value));
        break;
      }
      case "stats": {
        var stats = {
          hasErrors: function() {
            return data.value.errors;
          },
          hasWarnings: function() {
            return data.value.warnings;
          },
          toJson: function() {
            return data.value.data;
          }
        };
        if (stats.hasErrors()) {
          self.buildStatus.setContent("{red-fg}{bold}Failed{/}");
        }
        self.logText.log(formatOutput(stats));
        break;
      }
      case "log": {
        var filteredValue = data.value.replace(/[{}]/g, "");
        self.logText.log(filteredValue);
        break;
      }
      case "clear": {
        self.logText.setContent("");
        break;
      }
      case "lint-status": {
        self.lintStatus.setContent(renderStatus(data.value));
        break;
      }
      case "lint": {
        if (!self.minimal) {
          self.lintText.log(data.value);
        }
        break;
      }
      case "test-status": {
        self.testStatus.setContent(renderStatus(data.value));
        break;
      }
      case "test": {
        if (!self.minimal) {
          self.testText.log(data.value);
        }
        break;
      }
    }
  });

  this.screen.render();
};

Dashboard.prototype.layoutLog = function() {
  this.log = blessed.box({
    label: "Log",
    padding: 1,
    width: this.minimal ? "100%" : "85%",
    height: this.minimal ? "70%" : "50%",
    left: "0%",
    top: "0%",
    border: {
      type: "line",
    },
    style: {
      fg: -1,
      border: {
        fg: this.color
      }
    },
  });

  this.logText = blessed.log({
    parent: this.log,
    tags: true,
    width: "100%-4",
    scrollable: true,
    input: true,
    alwaysScroll: true,
    scrollbar: {
      ch: " ",
      style: {
        inverse: true
      }
    },
    keys: true,
    vi: true,
    mouse: true
  });

  this.screen.append(this.log);

  if (os.type() === "Darwin" && process.env.TERM_PROGRAM !== "iTerm.app") {
    this.warnText = blessed.box({
      parent: this.log,
      top: "0%-2",
      left: "30%",
      width: "240",
      label: "*** please consider use iTerm instead to better support mouse events ***"
    });
  }
};

Dashboard.prototype.layoutLints = function() {
  this.lints = blessed.box({
    label: "Lint",
    tags: true,
    padding: 1,
    width: "50%",
    height: "50%",
    left: "0%",
    top: "50%",
    border: {
      type: "line",
    },
    style: {
      fg: -1,
      border: {
        fg: this.color,
      },
    },
  });

  this.lintText = blessed.log({
    parent: this.lints,
    tags: true,
    width: "100%-4",
    scrollable: true,
    input: true,
    alwaysScroll: true,
    scrollbar: {
      ch: " ",
      inverse: true
    },
    keys: true,
    vi: true,
    mouse: true
  });

  this.screen.append(this.lints);
};

Dashboard.prototype.layoutTests = function() {
  this.tests = blessed.box({
    label: "Test",
    tags: true,
    padding: 1,
    width: "50%",
    height: "50%",
    left: "50%",
    top: "50%",
    border: {
      type: "line",
    },
    style: {
      fg: -1,
      border: {
        fg: this.color,
      },
    },
  });

  this.testText = blessed.log({
    parent: this.tests,
    tags: true,
    width: "100%-4",
    scrollable: true,
    input: true,
    alwaysScroll: true,
    scrollbar: {
      ch: " ",
      inverse: true
    },
    keys: true,
    vi: true,
    mouse: true
  });

  this.screen.append(this.tests);
};

Dashboard.prototype.layoutStatus = function() {
  this.wrapper = blessed.layout({
    width: this.minimal ? "100%" : "15%",
    height: this.minimal ? "30%" : "50%",
    top: this.minimal ? "70%" : "0%",
    left: this.minimal ? "0%" : "85%",
    layout: "grid"
  });

  this.operations = blessed.box({
    parent: this.wrapper,
    label: "Operation",
    tags: true,
    padding: {
      left: 1,
    },
    width: this.minimal ? "20%" : "100%",
    height: this.minimal ? "100%" : "20%",
    valign: "middle",
    border: {
      type: "line",
    },
    style: {
      fg: -1,
      border: {
        fg: this.color,
      },
    },
  });

  this.progress = blessed.box({
    parent: this.wrapper,
    label: "Progress",
    tags: true,
    padding: this.minimal ? {
      left: 1,
    } : 1,
    width: this.minimal ? "20%" : "100%",
    height: this.minimal ? "100%" : "20%",
    valign: "middle",
    border: {
      type: "line",
    },
    style: {
      fg: -1,
      border: {
        fg: this.color,
      },
    },
  });

  this.progressbar = blessed.ProgressBar({
    parent: this.progress,
    height: 1,
    width: "90%",
    top: "center",
    left: "left",
    hidden: this.minimal,
    orientation: "horizontal",
    style: {
      bar: {
        bg: this.color,
      },
    }
  });

  this.buildStatus = blessed.box({
    parent: this.wrapper,
    label: "Build Status",
    tags: true,
    padding: {
      left: 1,
    },
    width: this.minimal ? "20%" : "100%",
    height: this.minimal ? "100%" : "20%",
    valign: "middle",
    border: {
      type: "line",
    },
    style: {
      fg: -1,
      border: {
        fg: this.color,
      },
    },
  });

  this.lintStatus = blessed.box({
    parent: this.wrapper,
    label: "Lint Status",
    tags: true,
    padding: {
      left: 1,
    },
    width: this.minimal ? "20%" : "100%",
    height: this.minimal ? "100%" : "20%",
    valign: "middle",
    border: {
      type: "line",
    },
    style: {
      fg: -1,
      border: {
        fg: this.color,
      },
    },
  });

  this.testStatus = blessed.box({
    parent: this.wrapper,
    label: "Test Status",
    tags: true,
    padding: {
      left: 1,
    },
    width: this.minimal ? "20%" : "100%",
    height: this.minimal ? "100%" : "20%",
    valign: "middle",
    border: {
      type: "line",
    },
    style: {
      fg: -1,
      border: {
        fg: this.color,
      },
    },
  });

  this.screen.append(this.wrapper);
};

module.exports = Dashboard;
