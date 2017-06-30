module.exports = [
  {
    type: "progress",
    payload: {
      value: Number
    }
  },

  {
    type: "operations",
    payload: {
      value: String
    }
  },

  {
    type: "status",
    payload: {
      value: String
    }
  },

  {
    type: "stats",
    payload: {
      errors: Boolean,
      warnings: Boolean,
      data: Object
    }
  },

  {
    type: "log",
    payload: {
      value: String
    }
  },

  {
    type: "clear",
    payload: {}
  },

  {
    type: "lint-status",
    payload: {
      value: String
    }
  },

  {
    type: "lint",
    payload: {
      value: String
    }
  },

  {
    type: "test-status",
    payload: {
      value: String
    }
  },

  {
    type: "test",
    payload: {
      value: String
    }
  }
]