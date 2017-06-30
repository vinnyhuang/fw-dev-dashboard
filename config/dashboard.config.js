
module.exports = {
  logElements: [
    {
      key: "log",
      name: "Build Log",
      stateProp: "buildLog",
      startParams: { x: 0, y: 0, w: 8, h: 5 }
    },
    {
      key: "lint",
      name: "Lint Log",
      stateProp: "lintLog",
      startParams: { x: 0, y: 5, w: 5, h: 5 }
    },
    {
      key: "test",
      name: "Test Log",
      stateProp: "testLog",
      startParams: { x: 5, y: 5, w: 5, h: 5 },
      replaceRules: [
        {
          from: /\n[\s]*(\d)/g,
          to: function(match, p1) { return  '\n  ' + p1 }
        },
        {
          from: /\n[\s]*at/g,
          to: '\n    at'
        }
      ]
    }
  ],
  
  statusElements: [
    {
      key: "operation",
      name: "Operation",
      stateProp: "operations",
      startParams: { x: 8, y: 0, w: 2, h: 1 }
    },
    {
      key: "build-status",
      name: "Build Status",
      stateProp: "buildStatus",
      startParams: { x: 8, y: 2, w: 2, h: 1 }
    },
    {
      key: "lint-status",
      name: "Lint Status",
      stateProp: "lintStatus",
      startParams: { x: 8, y: 3, w: 2, h: 1 }
    },
    {
      key: "test-status",
      name: "Test Status",
      stateProp: "testStatus",
      startParams: { x: 8, y: 4, w: 2, h: 1 }
    }
  ],

  progressElements: [
    {
      key: "progress",
      name: "Build Progress",
      stateProp: "progress",
      startParams: { x: 8, y: 1, w: 2, h: 1 }
    }
  ]
}
