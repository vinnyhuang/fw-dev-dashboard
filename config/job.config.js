module.exports = [
  {
    // "name": "full compile",
    command: "npm start",
    autoStart: true,
    emitEventOnStart: "webpack:started",
    emitEventOnStdOutput: "webpack:log",
    emitEventOnStop: function(quitCode) {
      return "webpack:stopped";
    },
    triggerByEvents: [
      { type: "webpack:stopped" } // this will automatically restart when webpack stopped
    ]

  }
]