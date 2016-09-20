'use strict';

module.exports = function koaFinally() {
  return function* (next) {
    var self = this;

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

    var errorHandlerProcessed = false;

    var processErrorHandler = function() {
      if (! errorHandlerProcessed) {
        self.finally.errorCallbacks.forEach(function(c) {
          try {
            c();
          } catch (error) {
            console.error(`clean middleware error ${error}`);
          }
        });
      }
      errorHandlerProcessed = true;
    }

    try {

      yield* next;

    } catch(ee) {

      processErrorHandler();
      throw ee;

    } finally {
      this.finally.finishCallbacks.forEach(function(c) {
        try {
          c();
        } catch (error) {
          console.error(`clean middleware error ${error}`);
        }
      });
      if (this.response.status > 399) {
        processErrorHandler();
      }
    }
  }
}
