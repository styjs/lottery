 /******************************
  promise.js
  author: komachan
*******************************/
let PENDING_STATE = "pending", FULFILLED_STATE = "fulfilled", REJECT_STATE = "reject";
let isType = function(type) {
    return function(obj) {
        return Object.prototype.toString.call(obj) == '[object ' + type + ']';
    }
};
let isObject = isType('Object');
let isString = isType('String');
let isNumber = isType('Number');
let isArray = Array.isArray || isType('Array');
let isFunction = isType('Function');
let isNull = function(obj){return obj === null;};
let isUndefined = function(obj){return obj === undefined;};
let async = function(fn) {setTimeout.call(null, fn, 0);};

let Promise = function(resolver) {
  if (!isFunction(resolver)) throw new TypeError('Promise constructor takes a function argument');
  if(!(this instanceof Promise)) {
    return new Promise(resolver);
  };

  var promise = this;
  promise._state = PENDING_STATE,
  promise._deferreds = [],
  promise._value = null;

  exec(resolver.bind(promise), resolve.bind(promise), reject.bind(promise));
};

Promise.prototype.then = function(onFulfilled, onRejected) {
  var promise = this;
  return new this.constructor(function() {
    handle.call(promise, {
      onFulfilled: onFulfilled,
      onRejected: onRejected,
      promise: this //new promise
    });
  });
};

function resolve(value) {
  var st, val, then,
    promise = this;
  try {
    if(promise === value) throw new TypeError("Resolve a promise with itself");
    if(value instanceof Promise) { //#2.3.2
      st = value._state;
      val = value._value;
      promise._state = st;
      if(st === FULFILLED_STATE || st === REJECT_STATE) {
        promise._value = val;
        finale.call(promise); //exec promise.deferreds
      } else {
        //make current promise defer to value promise
        var deferred = {
          onFulfilled: null,
          onRejected: null,
          promise: promise
        };
        if(isArray(value._deferreds)) {
          value._deferreds.push(deferred);
        } else {
          value._deferreds = [deferred];
        }
      }
      return;
    }
    if(isObject(value) || isFunction(value)) {
      then = value.then;
      if(isFunction(then)) {
        exec(then.bind(value), resolve.bind(promise), reject.bind(promise));
        return;
      }
    }

    promise._state = FULFILLED_STATE;
    promise._value = value;

    finale.call(promise);
  } catch (e) {
    reject.call(promise, e);
  }
}

function reject(reason) {
  var promise = this;
  promise._state = REJECT_STATE;
  promise._value = reason;

  finale.call(promise);
}

function finale() {
  var i, ii,
    promise = this;
  if(isArray(promise._deferreds)) {
    for(i = 0, ii = promise._deferreds.length; i < ii; i++) {
      handle.call(promise, promise._deferreds[i]);
    }
    promise._deferreds = null;
  }
}

function handle(deferred) {
  var promise = this;
  if(promise._state === PENDING_STATE) {
    promise._deferreds.push(deferred);
    return;
  }
  async(function(){
    var cb, ret;
    try {
      cb = promise._state === FULFILLED_STATE ? deferred.onFulfilled : deferred.onRejected;
      if(!isFunction(cb)) {
        (promise._state === FULFILLED_STATE ? resolve : reject).call(deferred.promise, promise._value);
        return;
      }
      resolve.call(deferred.promise, cb(promise._value));
    } catch (e) {
      reject.call(deferred.promise, e);
    }
  });
}

function exec(fn, onFulfilled, onRejected) {
  var done = !1;
  try {
    fn(function(value) {
      if(done) return
      done = !0;
      onFulfilled(value);
    }, function(reason) {
      if(done) return
      done = !0;
      onRejected(reason);
    })
  } catch (e) {
    if(done) return
    done = !0;
    onRejected(e);
  }
}

/*
 * extension
 */
var TRUE = valuePromise(true);
var FALSE = valuePromise(false);
var NULL = valuePromise(null);
var UNDEFINED = valuePromise(undefined);
var ZERO = valuePromise(0);
var EMPTYSTRING = valuePromise('');

function valuePromise(value) {
  return new Promise(function(resolve){
    resolve(value);
  });
}

Promise.resolve = function (value) {
  if (value instanceof Promise) return value;

  if (value === null) return NULL;
  if (value === undefined) return UNDEFINED;
  if (value === true) return TRUE;
  if (value === false) return FALSE;
  if (value === 0) return ZERO;
  if (value === '') return EMPTYSTRING;

  if (isObject(value) || isFunction(value)) {
    try {
      var then = value.then;
      if (isFunction(then)) {
        return new Promise(then.bind(value));
      }
    } catch (ex) {
      return new Promise(function(resolve, reject) {
        reject(ex);
      });
    }
  }
  return valuePromise(value);
};

Promise.reject = function (value) {
  return new Promise(function (resolve, reject) {
    reject(value);
  });
};

Promise.all = function(values){
  if(!isArray(values)) throw new TypeError('Argument of Promise.all is not iterable');

  var args = [].slice.call(values);
  return new Promise(function(resolve, reject) {
    if (args.length === 0) return resolve([]);

    var i, length,
      remaining = args.length;
    for(i = 0, length = args.length; i < length; i++) {
      fn(i, args[i]);
    }
    function fn(i, value) {
      var then;
      try {
        if(isObject(value) || isFunction(value)) {
          then = value.then;
          if(isFunction(then)) {
            value.then.call(value, function(val){
              fn(i, val);
            }, reject);
            return;
          }
        }
        args[i] = value;
        if(--remaining === 0) {
          resolve(args);
        }
      } catch (e) {
          reject(e);
      }
    }
  });
};

Promise.race = function(values) {
  if(!isArray(values)) throw new TypeError('Argument of Promise.race is not iterable');
  return new Promise(function(resolve, reject) {
    if(values.length === 0) return resolve([]);
    values.forEach(function(value){
      Promise.resolve(value).then(resolve, reject);
    });
  });
};

Promise.prototype.done = function() {
  var self = arguments.length ? this.then.apply(this, arguments) : this;
  self.then(null, function(reason) {
        //the error will be catched without async
        async(function(){
            throw reason;
        });
  });
}

Promise.prototype["catch"] = function(onRejected) {
  return this.then(null, onRejected);
};

Promise.prototype['finally'] = function (fn) {
  return this.then(function(value) {
    return Promise.resolve(fn()).then(function() {
      return value;
    });
  }, function(reason) {
    return Promise.resolve(fn()).then(function() {
      throw reason;
    });
  });
};

export default Promise