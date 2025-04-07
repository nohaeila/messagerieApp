if (typeof setImmediate === 'undefined') {
    global.setImmediate = (callback, ...args) => setTimeout(callback, 0, ...args);
  }