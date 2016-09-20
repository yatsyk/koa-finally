'use strict';

module.exports = function koaFinally() {
  return function* (next) {
    this.finally = {
      errorCallbacks: [],
      finishCallbacks: [],

      onError(cb) {
        this.errorCallbacks.push(cb);
      },

      onFinish(cb) {
        this.finishCallbacks.push(cb);
      }
    }

    yield* next;

    this.finally.finishCallbacks.forEach(function(c) {
      try {
        c();
      } catch (error) {
        console.error(`clean middleware error ${error}`);
      }
    });
    if (this.response.status > 399) {
      console.info('calling error clear handlers');
      this.finally.errorCallbacks.forEach(function(c) {
        try {
          c();
        } catch (error) {
          console.error(`clean middleware error ${error}`);
        }
      });
    }
  }
}
