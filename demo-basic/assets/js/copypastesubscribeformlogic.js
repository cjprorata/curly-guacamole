/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/js/compiled/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "../node_modules/regenerator-runtime/runtime.js":
/*!******************************************************!*\
  !*** ../node_modules/regenerator-runtime/runtime.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var runtime = function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.

  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []); // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.

    generator._invoke = makeInvokeMethod(innerFn, self, context);
    return generator;
  }

  exports.wrap = wrap; // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.

  function tryCatch(fn, obj, arg) {
    try {
      return {
        type: "normal",
        arg: fn.call(obj, arg)
      };
    } catch (err) {
      return {
        type: "throw",
        arg: err
      };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed"; // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.

  var ContinueSentinel = {}; // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.

  function Generator() {}

  function GeneratorFunction() {}

  function GeneratorFunctionPrototype() {} // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.


  var IteratorPrototype = {};

  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));

  if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] = GeneratorFunction.displayName = "GeneratorFunction"; // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.

  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      prototype[method] = function (arg) {
        return this._invoke(method, arg);
      };
    });
  }

  exports.isGeneratorFunction = function (genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor ? ctor === GeneratorFunction || // For the native GeneratorFunction constructor, the best we can
    // do is to check its .name property.
    (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
  };

  exports.mark = function (genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;

      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }

    genFun.prototype = Object.create(Gp);
    return genFun;
  }; // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.


  exports.awrap = function (arg) {
    return {
      __await: arg
    };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);

      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;

        if (value && _typeof(value) === "object" && hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function (value) {
            invoke("next", value, resolve, reject);
          }, function (err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function (unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function (error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function (resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise = // If enqueue has been called before, then we want to wait until
      // all previous Promises have been resolved before calling invoke,
      // so that results are always delivered in the correct order. If
      // enqueue has not been called before, then it is important to
      // call invoke immediately, without waiting on a callback to fire,
      // so that the async generator function has the opportunity to do
      // any necessary setup in a predictable way. This predictability
      // is why the Promise constructor synchronously invokes its
      // executor callback, and why async functions synchronously
      // execute code before the first await. Since we implement simple
      // async functions in terms of async generators, it is especially
      // important to get this right, even though it requires care.
      previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, // Avoid propagating failures to Promises returned by later
      // invocations of the iterator.
      callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
    } // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).


    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);

  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };

  exports.AsyncIterator = AsyncIterator; // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.

  exports.async = function (innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList));
    return exports.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
    : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;
    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        } // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume


        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;

        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);

          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;
        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);
        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;
        var record = tryCatch(innerFn, self, context);

        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done ? GenStateCompleted : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };
        } else if (record.type === "throw") {
          state = GenStateCompleted; // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.

          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  } // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.


  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];

    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError("The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (!info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value; // Resume execution at the desired location (see delegateYield).

      context.next = delegate.nextLoc; // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.

      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }
    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    } // The delegate iterator is finished, so forget it and continue with
    // the outer generator.


    context.delegate = null;
    return ContinueSentinel;
  } // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.


  defineIteratorMethods(Gp);
  Gp[toStringTagSymbol] = "Generator"; // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.

  Gp[iteratorSymbol] = function () {
    return this;
  };

  Gp.toString = function () {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = {
      tryLoc: locs[0]
    };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{
      tryLoc: "root"
    }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function (object) {
    var keys = [];

    for (var key in object) {
      keys.push(key);
    }

    keys.reverse(); // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.

    return function next() {
      while (keys.length) {
        var key = keys.pop();

        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      } // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.


      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];

      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1,
            next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;
          return next;
        };

        return next.next = next;
      }
    } // Return an iterator with no values.


    return {
      next: doneResult
    };
  }

  exports.values = values;

  function doneResult() {
    return {
      value: undefined,
      done: true
    };
  }

  Context.prototype = {
    constructor: Context,
    reset: function reset(skipTempReset) {
      this.prev = 0;
      this.next = 0; // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.

      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;
      this.method = "next";
      this.arg = undefined;
      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },
    stop: function stop() {
      this.done = true;
      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;

      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },
    dispatchException: function dispatchException(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;

      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !!caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }
          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }
          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },
    abrupt: function abrupt(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];

        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },
    complete: function complete(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" || record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },
    finish: function finish(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];

        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },
    "catch": function _catch(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];

        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;

          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }

          return thrown;
        }
      } // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.


      throw new Error("illegal catch attempt");
    },
    delegateYield: function delegateYield(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  }; // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.

  return exports;
}( // If this script is executing as a CommonJS module, use module.exports
// as the regeneratorRuntime namespace. Otherwise create a new empty
// object. Either way, the resulting object will be used to initialize
// the regeneratorRuntime variable at the top of this file.
( false ? undefined : _typeof(module)) === "object" ? module.exports : {});

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/module.js */ "../node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "../node_modules/webpack/buildin/module.js":
/*!*************************************************!*\
  !*** ../node_modules/webpack/buildin/module.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function (module) {
  if (!module.webpackPolyfill) {
    module.deprecate = function () {};

    module.paths = []; // module.parent = undefined by default

    if (!module.children) module.children = [];
    Object.defineProperty(module, "loaded", {
      enumerable: true,
      get: function get() {
        return module.l;
      }
    });
    Object.defineProperty(module, "id", {
      enumerable: true,
      get: function get() {
        return module.i;
      }
    });
    module.webpackPolyfill = 1;
  }

  return module;
};

/***/ }),

/***/ "./js/src/app/contacts/copypastesubscribeform/copypastesubscribeform.logic.js":
/*!************************************************************************************!*\
  !*** ./js/src/app/contacts/copypastesubscribeform/copypastesubscribeform.logic.js ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* eslint-disable */
(function (ElementProto) {
  if (typeof ElementProto.matches !== 'function') {
    ElementProto.matches = ElementProto.msMatchesSelector || ElementProto.mozMatchesSelector || ElementProto.webkitMatchesSelector || function matches(selector) {
      var element = this;
      var elements = (element.document || element.ownerDocument).querySelectorAll(selector);
      var index = 0;

      while (elements[index] && elements[index] !== element) {
        ++index;
      }

      return Boolean(elements[index]);
    };
  }

  if (typeof ElementProto.closest !== 'function') {
    ElementProto.closest = function closest(selector) {
      var element = this;

      while (element && element.nodeType === 1) {
        if (element.matches(selector)) {
          return element;
        }

        element = element.parentNode;
      }

      return null;
    };
  }
})(window.Element ? window.Element.prototype : window.HTMLElement.prototype);

(function () {
  var rootElement = document.documentElement || document.body;

  var xHttpRequestFunc = function xHttpRequestFunc(requestType, url, cm_form) {
    var cm_email_input = cm_form.querySelector('.js-cm-email-input');
    var data = 'email=' + encodeURIComponent(cm_email_input.value) + '&data=' + encodeURIComponent(cm_form.getAttribute('data-id'));
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        cm_form.action = this.responseText;
        cm_form.submit();
      }
    };

    xhttp.open(requestType, url, true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(data);
  };

  var eventCallback = function eventCallback(e) {
    var target = e.target;
    var cm_form = target.closest('.js-cm-form');

    if (!cm_form) {
      return;
    }

    e.preventDefault ? e.preventDefault() : e.returnValue = false;
    xHttpRequestFunc('POST', 'https://createsend.com//t/getsecuresubscribelink', cm_form);
  };

  function registerHandler(target, type, callback) {
    if (target.addEventListener) {
      target.addEventListener(type, callback);
    } else {
      target.attachEvent('on' + type, callback);
    }
  }

  if (!rootElement.getAttribute('data-cm-hook')) {
    registerHandler(rootElement, 'submit', eventCallback);
    rootElement.setAttribute('data-cm-hook', '1');
  }
})();

(function () {
  var mobileNumberField = document.getElementsByName('cm-mobile-number')[0];
  var mobileNumberCountryField = document.getElementsByName('cm-mobile-number-country')[0];
  var smsMarketingConsentCheck = document.getElementsByName('cm-sms-marketing-consent')[0];
  var smsMarketingConsentRequiredLabel = document.getElementById('cm-sms-marketing-consent-required-label');
  var previousValue = '';
  var isDeleteKeyDown = false;

  if (!mobileNumberField || !mobileNumberCountryField || !smsMarketingConsentCheck) {
    return;
  }

  var mobileInputCountryName = {
    UnitedStatesOfAmerica: 'United States of America',
    Canada: 'Canada',
    Australia: 'Australia',
    UnitedKingdom: 'United Kingdom'
  };

  var getMobileInputPropsByCountry = function getMobileInputPropsByCountry(country) {
    switch (country) {
      case mobileInputCountryName.Australia:
        return {
          formatter: function formatter(input) {
            var newValue = input.replace(/\D/g, '').match(/(\d{0,4})(\d{0,3})(\d{0,3})/) || [];
            return newValue[1] + (newValue[2] ? ' ' + newValue[2] : '') + (newValue[3] ? ' ' + newValue[3] : '');
          },
          placeholder: 'E.g. 0491 570 006',
          pattern: '[0-9]{4} [0-9]{3} [0-9]{3}',
          maxLengthOfMobileNumberWithoutSeparators: 10,
          indicesOfSeparatorInDigitsOnlyMobileNumber: [4, 7]
        };

      case mobileInputCountryName.UnitedKingdom:
        return {
          formatter: function formatter(input) {
            var newValue = input.replace(/\D/g, '').match(/(\d{0,3})(\d{0,4})(\d{0,4})/) || [];
            return newValue[1] + (newValue[2] ? ' ' + newValue[2] : '') + (newValue[3] ? ' ' + newValue[3] : '');
          },
          placeholder: 'E.g. 077 0090 0000',
          pattern: '[0-9]{3} [0-9]{4} [0-9]{4}',
          maxLengthOfMobileNumberWithoutSeparators: 11,
          indicesOfSeparatorInDigitsOnlyMobileNumber: [3, 7]
        };

      case mobileInputCountryName.Canada:
      case mobileInputCountryName.UnitedStatesOfAmerica:
      default:
        return {
          formatter: function formatter(input) {
            var newValue = input.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/) || [];
            return newValue[1] + (newValue[2] ? '-' + newValue[2] : '') + (newValue[3] ? '-' + newValue[3] : '');
          },
          placeholder: 'E.g. 123-456-7890',
          pattern: '[0-9]{3}-[0-9]{3}-[0-9]{4}',
          maxLengthOfMobileNumberWithoutSeparators: 10,
          indicesOfSeparatorInDigitsOnlyMobileNumber: [3, 6]
        };
    }
  };

  var updateMobileInputAttributes = function updateMobileInputAttributes(country) {
    var mobileInputProps = getMobileInputPropsByCountry(country);
    var placeholder = mobileInputProps.placeholder;
    var pattern = mobileInputProps.pattern;
    mobileNumberField.value = '';
    mobileNumberField.placeholder = placeholder;
    mobileNumberField.pattern = pattern;
  };

  var updateSmsMarketingConsentCheckRequired = function updateSmsMarketingConsentCheckRequired(state) {
    if (state) {
      smsMarketingConsentCheck.setAttribute('required', '');
    } else {
      smsMarketingConsentCheck.removeAttribute('required');
    }

    if (smsMarketingConsentRequiredLabel) {
      if (state) {
        smsMarketingConsentRequiredLabel.removeAttribute('hidden');
      } else {
        smsMarketingConsentRequiredLabel.setAttribute('hidden', '');
      }
    }
  };

  var findAllNonDigitIndices = function findAllNonDigitIndices(value) {
    var nonDigitRegex = /\D/g;
    var nonDigitIndices = [];
    var match;

    while ((match = nonDigitRegex.exec(value)) !== null) {
      nonDigitIndices.push(match.index);
    }

    return nonDigitIndices;
  };

  var mobileNumberFieldChangeHandler = function mobileNumberFieldChangeHandler(event) {
    // Handle ie11 misfiring input events when there is no change
    if (previousValue === event.currentTarget.value || !previousValue && event.currentTarget.value === '') {
      return;
    }

    var country = mobileNumberCountryField.value;
    var mobileInputProps = getMobileInputPropsByCountry(country);
    var formatter = mobileInputProps.formatter;
    var maxLengthOfMobileNumberWithoutSeparators = mobileInputProps.maxLengthOfMobileNumberWithoutSeparators;
    var indicesOfSeparatorInDigitsOnlyMobileNumber = mobileInputProps.indicesOfSeparatorInDigitsOnlyMobileNumber;
    var cursorLocation = event.currentTarget.selectionEnd || 0;
    var nonDigitIndices = findAllNonDigitIndices(event.currentTarget.value);
    var lengthOfDigitsOnlyValue = event.currentTarget.value.length - nonDigitIndices.length;

    if (lengthOfDigitsOnlyValue > maxLengthOfMobileNumberWithoutSeparators) {
      // do not allow update once any edits fill the string and keep the cursor where it is.
      var increaseInCharacters = event.currentTarget.value.length - previousValue.length;
      event.currentTarget.value = previousValue;
      event.currentTarget.setSelectionRange(cursorLocation - increaseInCharacters, cursorLocation - increaseInCharacters);
    } else {
      var cursorLocationInDigitOnlyValue = cursorLocation - nonDigitIndices.filter(function (nonDigitIndex) {
        return nonDigitIndex < cursorLocation;
      }).length;
      var formatterAddedSeparatorsBeforeCursorLocation = indicesOfSeparatorInDigitsOnlyMobileNumber.filter(function (separatorIndex) {
        return separatorIndex < cursorLocationInDigitOnlyValue;
      }).length;

      if (isDeleteKeyDown) {
        // place cursor after separators
        formatterAddedSeparatorsBeforeCursorLocation = indicesOfSeparatorInDigitsOnlyMobileNumber.filter(function (separatorIndex) {
          return separatorIndex <= cursorLocationInDigitOnlyValue;
        }).length;
      }

      var newCursorLocation = cursorLocationInDigitOnlyValue + formatterAddedSeparatorsBeforeCursorLocation;
      var formattedValue = event.currentTarget.value = formatter(event.currentTarget.value);
      event.currentTarget.setSelectionRange(newCursorLocation, newCursorLocation);
      previousValue = event.currentTarget.value;
      event.currentTarget.value = formattedValue;
      updateSmsMarketingConsentCheckRequired(Boolean(formattedValue));
    }

    previousValue = event.currentTarget.value;
  };

  var mobileNumberCountryFieldChangeHandler = function mobileNumberCountryFieldChangeHandler(event) {
    updateMobileInputAttributes(event.currentTarget.value);
  };

  var onKeyDownEventHandler = function onKeyDownEventHandler(event) {
    isDeleteKeyDown = event.key === 'Delete' || event.keyCode === 46;
  };

  var onKeyUpEventHandler = function onKeyUpEventHandler(event) {
    isDeleteKeyDown = false;
  };

  updateMobileInputAttributes(mobileNumberCountryField.value);
  mobileNumberField.addEventListener('input', mobileNumberFieldChangeHandler);
  mobileNumberField.addEventListener('keydown', onKeyDownEventHandler);
  mobileNumberField.addEventListener('keyup', onKeyUpEventHandler);
  mobileNumberCountryField.addEventListener('change', mobileNumberCountryFieldChangeHandler);
})();

/***/ }),

/***/ 0:
/*!**************************************************************************************************************!*\
  !*** multi regenerator-runtime ./js/src/app/contacts/copypastesubscribeform/copypastesubscribeform.logic.js ***!
  \**************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! regenerator-runtime */"../node_modules/regenerator-runtime/runtime.js");
module.exports = __webpack_require__(/*! C:\buildAgent\work\eb98649fb550fe82\app\js\src\app\contacts\copypastesubscribeform\copypastesubscribeform.logic.js */"./js/src/app/contacts/copypastesubscribeform/copypastesubscribeform.logic.js");


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4uL25vZGVfbW9kdWxlcy9yZWdlbmVyYXRvci1ydW50aW1lL3J1bnRpbWUuanMiLCJ3ZWJwYWNrOi8vLy4uL25vZGVfbW9kdWxlcy93ZWJwYWNrL2J1aWxkaW4vbW9kdWxlLmpzIiwid2VicGFjazovLy8uL2pzL3NyYy9hcHAvY29udGFjdHMvY29weXBhc3Rlc3Vic2NyaWJlZm9ybS9jb3B5cGFzdGVzdWJzY3JpYmVmb3JtLmxvZ2ljLmpzIl0sIm5hbWVzIjpbInJ1bnRpbWUiLCJleHBvcnRzIiwiT3AiLCJPYmplY3QiLCJwcm90b3R5cGUiLCJoYXNPd24iLCJoYXNPd25Qcm9wZXJ0eSIsInVuZGVmaW5lZCIsIiRTeW1ib2wiLCJTeW1ib2wiLCJpdGVyYXRvclN5bWJvbCIsIml0ZXJhdG9yIiwiYXN5bmNJdGVyYXRvclN5bWJvbCIsImFzeW5jSXRlcmF0b3IiLCJ0b1N0cmluZ1RhZ1N5bWJvbCIsInRvU3RyaW5nVGFnIiwid3JhcCIsImlubmVyRm4iLCJvdXRlckZuIiwic2VsZiIsInRyeUxvY3NMaXN0IiwicHJvdG9HZW5lcmF0b3IiLCJHZW5lcmF0b3IiLCJnZW5lcmF0b3IiLCJjcmVhdGUiLCJjb250ZXh0IiwiQ29udGV4dCIsIl9pbnZva2UiLCJtYWtlSW52b2tlTWV0aG9kIiwidHJ5Q2F0Y2giLCJmbiIsIm9iaiIsImFyZyIsInR5cGUiLCJjYWxsIiwiZXJyIiwiR2VuU3RhdGVTdXNwZW5kZWRTdGFydCIsIkdlblN0YXRlU3VzcGVuZGVkWWllbGQiLCJHZW5TdGF0ZUV4ZWN1dGluZyIsIkdlblN0YXRlQ29tcGxldGVkIiwiQ29udGludWVTZW50aW5lbCIsIkdlbmVyYXRvckZ1bmN0aW9uIiwiR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUiLCJJdGVyYXRvclByb3RvdHlwZSIsImdldFByb3RvIiwiZ2V0UHJvdG90eXBlT2YiLCJOYXRpdmVJdGVyYXRvclByb3RvdHlwZSIsInZhbHVlcyIsIkdwIiwiY29uc3RydWN0b3IiLCJkaXNwbGF5TmFtZSIsImRlZmluZUl0ZXJhdG9yTWV0aG9kcyIsImZvckVhY2giLCJtZXRob2QiLCJpc0dlbmVyYXRvckZ1bmN0aW9uIiwiZ2VuRnVuIiwiY3RvciIsIm5hbWUiLCJtYXJrIiwic2V0UHJvdG90eXBlT2YiLCJfX3Byb3RvX18iLCJhd3JhcCIsIl9fYXdhaXQiLCJBc3luY0l0ZXJhdG9yIiwiaW52b2tlIiwicmVzb2x2ZSIsInJlamVjdCIsInJlY29yZCIsInJlc3VsdCIsInZhbHVlIiwiUHJvbWlzZSIsInRoZW4iLCJ1bndyYXBwZWQiLCJlcnJvciIsInByZXZpb3VzUHJvbWlzZSIsImVucXVldWUiLCJjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZyIsImFzeW5jIiwiaXRlciIsIm5leHQiLCJkb25lIiwic3RhdGUiLCJFcnJvciIsImRvbmVSZXN1bHQiLCJkZWxlZ2F0ZSIsImRlbGVnYXRlUmVzdWx0IiwibWF5YmVJbnZva2VEZWxlZ2F0ZSIsInNlbnQiLCJfc2VudCIsImRpc3BhdGNoRXhjZXB0aW9uIiwiYWJydXB0IiwiVHlwZUVycm9yIiwiaW5mbyIsInJlc3VsdE5hbWUiLCJuZXh0TG9jIiwidG9TdHJpbmciLCJwdXNoVHJ5RW50cnkiLCJsb2NzIiwiZW50cnkiLCJ0cnlMb2MiLCJjYXRjaExvYyIsImZpbmFsbHlMb2MiLCJhZnRlckxvYyIsInRyeUVudHJpZXMiLCJwdXNoIiwicmVzZXRUcnlFbnRyeSIsImNvbXBsZXRpb24iLCJyZXNldCIsImtleXMiLCJvYmplY3QiLCJrZXkiLCJyZXZlcnNlIiwibGVuZ3RoIiwicG9wIiwiaXRlcmFibGUiLCJpdGVyYXRvck1ldGhvZCIsImlzTmFOIiwiaSIsInNraXBUZW1wUmVzZXQiLCJwcmV2IiwiY2hhckF0Iiwic2xpY2UiLCJzdG9wIiwicm9vdEVudHJ5Iiwicm9vdFJlY29yZCIsInJ2YWwiLCJleGNlcHRpb24iLCJoYW5kbGUiLCJsb2MiLCJjYXVnaHQiLCJoYXNDYXRjaCIsImhhc0ZpbmFsbHkiLCJmaW5hbGx5RW50cnkiLCJjb21wbGV0ZSIsImZpbmlzaCIsInRocm93biIsImRlbGVnYXRlWWllbGQiLCJtb2R1bGUiLCJyZWdlbmVyYXRvclJ1bnRpbWUiLCJhY2NpZGVudGFsU3RyaWN0TW9kZSIsIkZ1bmN0aW9uIiwid2VicGFja1BvbHlmaWxsIiwiZGVwcmVjYXRlIiwicGF0aHMiLCJjaGlsZHJlbiIsImRlZmluZVByb3BlcnR5IiwiZW51bWVyYWJsZSIsImdldCIsImwiLCJFbGVtZW50UHJvdG8iLCJtYXRjaGVzIiwibXNNYXRjaGVzU2VsZWN0b3IiLCJtb3pNYXRjaGVzU2VsZWN0b3IiLCJ3ZWJraXRNYXRjaGVzU2VsZWN0b3IiLCJzZWxlY3RvciIsImVsZW1lbnQiLCJlbGVtZW50cyIsImRvY3VtZW50Iiwib3duZXJEb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJpbmRleCIsIkJvb2xlYW4iLCJjbG9zZXN0Iiwibm9kZVR5cGUiLCJwYXJlbnROb2RlIiwid2luZG93IiwiRWxlbWVudCIsIkhUTUxFbGVtZW50Iiwicm9vdEVsZW1lbnQiLCJkb2N1bWVudEVsZW1lbnQiLCJib2R5IiwieEh0dHBSZXF1ZXN0RnVuYyIsInJlcXVlc3RUeXBlIiwidXJsIiwiY21fZm9ybSIsImNtX2VtYWlsX2lucHV0IiwicXVlcnlTZWxlY3RvciIsImRhdGEiLCJlbmNvZGVVUklDb21wb25lbnQiLCJnZXRBdHRyaWJ1dGUiLCJ4aHR0cCIsIlhNTEh0dHBSZXF1ZXN0Iiwib25yZWFkeXN0YXRlY2hhbmdlIiwicmVhZHlTdGF0ZSIsInN0YXR1cyIsImFjdGlvbiIsInJlc3BvbnNlVGV4dCIsInN1Ym1pdCIsIm9wZW4iLCJzZXRSZXF1ZXN0SGVhZGVyIiwic2VuZCIsImV2ZW50Q2FsbGJhY2siLCJlIiwidGFyZ2V0IiwicHJldmVudERlZmF1bHQiLCJyZXR1cm5WYWx1ZSIsInJlZ2lzdGVySGFuZGxlciIsImNhbGxiYWNrIiwiYWRkRXZlbnRMaXN0ZW5lciIsImF0dGFjaEV2ZW50Iiwic2V0QXR0cmlidXRlIiwibW9iaWxlTnVtYmVyRmllbGQiLCJnZXRFbGVtZW50c0J5TmFtZSIsIm1vYmlsZU51bWJlckNvdW50cnlGaWVsZCIsInNtc01hcmtldGluZ0NvbnNlbnRDaGVjayIsInNtc01hcmtldGluZ0NvbnNlbnRSZXF1aXJlZExhYmVsIiwiZ2V0RWxlbWVudEJ5SWQiLCJwcmV2aW91c1ZhbHVlIiwiaXNEZWxldGVLZXlEb3duIiwibW9iaWxlSW5wdXRDb3VudHJ5TmFtZSIsIlVuaXRlZFN0YXRlc09mQW1lcmljYSIsIkNhbmFkYSIsIkF1c3RyYWxpYSIsIlVuaXRlZEtpbmdkb20iLCJnZXRNb2JpbGVJbnB1dFByb3BzQnlDb3VudHJ5IiwiY291bnRyeSIsImZvcm1hdHRlciIsImlucHV0IiwibmV3VmFsdWUiLCJyZXBsYWNlIiwibWF0Y2giLCJwbGFjZWhvbGRlciIsInBhdHRlcm4iLCJtYXhMZW5ndGhPZk1vYmlsZU51bWJlcldpdGhvdXRTZXBhcmF0b3JzIiwiaW5kaWNlc09mU2VwYXJhdG9ySW5EaWdpdHNPbmx5TW9iaWxlTnVtYmVyIiwidXBkYXRlTW9iaWxlSW5wdXRBdHRyaWJ1dGVzIiwibW9iaWxlSW5wdXRQcm9wcyIsInVwZGF0ZVNtc01hcmtldGluZ0NvbnNlbnRDaGVja1JlcXVpcmVkIiwicmVtb3ZlQXR0cmlidXRlIiwiZmluZEFsbE5vbkRpZ2l0SW5kaWNlcyIsIm5vbkRpZ2l0UmVnZXgiLCJub25EaWdpdEluZGljZXMiLCJleGVjIiwibW9iaWxlTnVtYmVyRmllbGRDaGFuZ2VIYW5kbGVyIiwiZXZlbnQiLCJjdXJyZW50VGFyZ2V0IiwiY3Vyc29yTG9jYXRpb24iLCJzZWxlY3Rpb25FbmQiLCJsZW5ndGhPZkRpZ2l0c09ubHlWYWx1ZSIsImluY3JlYXNlSW5DaGFyYWN0ZXJzIiwic2V0U2VsZWN0aW9uUmFuZ2UiLCJjdXJzb3JMb2NhdGlvbkluRGlnaXRPbmx5VmFsdWUiLCJmaWx0ZXIiLCJub25EaWdpdEluZGV4IiwiZm9ybWF0dGVyQWRkZWRTZXBhcmF0b3JzQmVmb3JlQ3Vyc29yTG9jYXRpb24iLCJzZXBhcmF0b3JJbmRleCIsIm5ld0N1cnNvckxvY2F0aW9uIiwiZm9ybWF0dGVkVmFsdWUiLCJtb2JpbGVOdW1iZXJDb3VudHJ5RmllbGRDaGFuZ2VIYW5kbGVyIiwib25LZXlEb3duRXZlbnRIYW5kbGVyIiwia2V5Q29kZSIsIm9uS2V5VXBFdmVudEhhbmRsZXIiXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBLElBQUlBLE9BQU8sR0FBSSxVQUFVQyxPQUFWLEVBQW1CO0FBQ2hDOztBQUVBLE1BQUlDLEVBQUUsR0FBR0MsTUFBTSxDQUFDQyxTQUFoQjtBQUNBLE1BQUlDLE1BQU0sR0FBR0gsRUFBRSxDQUFDSSxjQUFoQjtBQUNBLE1BQUlDLFNBQUosQ0FMZ0MsQ0FLakI7O0FBQ2YsTUFBSUMsT0FBTyxHQUFHLE9BQU9DLE1BQVAsS0FBa0IsVUFBbEIsR0FB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QUFPLENBQUNzRixjQUFELENBQVIsQ0FBdEM7QUFDSDs7QUFFRHhDLGlCQUFhLEdBQUcyQixLQUFLLENBQUNDLGFBQU4sQ0FBb0J0SyxLQUFwQztBQUNILEdBN0NEOztBQStDQSxNQUFJbUwscUNBQXFDLEdBQUcsU0FBeENBLHFDQUF3QyxDQUFVZCxLQUFWLEVBQWlCO0FBQ3pEVCwrQkFBMkIsQ0FBQ1MsS0FBSyxDQUFDQyxhQUFOLENBQW9CdEssS0FBckIsQ0FBM0I7QUFDSCxHQUZEOztBQUlBLE1BQUlvTCxxQkFBcUIsR0FBRyxTQUF4QkEscUJBQXdCLENBQVVmLEtBQVYsRUFBaUI7QUFDekMxQixtQkFBZSxHQUFHMEIsS0FBSyxDQUFDNUgsR0FBTixLQUFjLFFBQWQsSUFBMEI0SCxLQUFLLENBQUNnQixPQUFOLEtBQWtCLEVBQTlEO0FBQ0gsR0FGRDs7QUFJQSxNQUFJQyxtQkFBbUIsR0FBRyxTQUF0QkEsbUJBQXNCLENBQVVqQixLQUFWLEVBQWlCO0FBQ3ZDMUIsbUJBQWUsR0FBRyxLQUFsQjtBQUNILEdBRkQ7O0FBSUFpQiw2QkFBMkIsQ0FBQ3RCLHdCQUF3QixDQUFDdEksS0FBMUIsQ0FBM0I7QUFDQW9JLG1CQUFpQixDQUFDSCxnQkFBbEIsQ0FBbUMsT0FBbkMsRUFBNENtQyw4QkFBNUM7QUFDQWhDLG1CQUFpQixDQUFDSCxnQkFBbEIsQ0FBbUMsU0FBbkMsRUFBOENtRCxxQkFBOUM7QUFDQWhELG1CQUFpQixDQUFDSCxnQkFBbEIsQ0FBbUMsT0FBbkMsRUFBNENxRCxtQkFBNUM7QUFDQWhELDBCQUF3QixDQUFDTCxnQkFBekIsQ0FBMEMsUUFBMUMsRUFBb0RrRCxxQ0FBcEQ7QUFDSCxDQS9KRCxJIiwiZmlsZSI6ImFwcC9jb250YWN0cy9jb3B5cGFzdGVzdWJzY3JpYmVmb3JtLmxvZ2ljLm1pbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiL2pzL2NvbXBpbGVkL1wiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNC1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbnZhciBydW50aW1lID0gKGZ1bmN0aW9uIChleHBvcnRzKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIHZhciBPcCA9IE9iamVjdC5wcm90b3R5cGU7XG4gIHZhciBoYXNPd24gPSBPcC5oYXNPd25Qcm9wZXJ0eTtcbiAgdmFyIHVuZGVmaW5lZDsgLy8gTW9yZSBjb21wcmVzc2libGUgdGhhbiB2b2lkIDAuXG4gIHZhciAkU3ltYm9sID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiID8gU3ltYm9sIDoge307XG4gIHZhciBpdGVyYXRvclN5bWJvbCA9ICRTeW1ib2wuaXRlcmF0b3IgfHwgXCJAQGl0ZXJhdG9yXCI7XG4gIHZhciBhc3luY0l0ZXJhdG9yU3ltYm9sID0gJFN5bWJvbC5hc3luY0l0ZXJhdG9yIHx8IFwiQEBhc3luY0l0ZXJhdG9yXCI7XG4gIHZhciB0b1N0cmluZ1RhZ1N5bWJvbCA9ICRTeW1ib2wudG9TdHJpbmdUYWcgfHwgXCJAQHRvU3RyaW5nVGFnXCI7XG5cbiAgZnVuY3Rpb24gd3JhcChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCkge1xuICAgIC8vIElmIG91dGVyRm4gcHJvdmlkZWQgYW5kIG91dGVyRm4ucHJvdG90eXBlIGlzIGEgR2VuZXJhdG9yLCB0aGVuIG91dGVyRm4ucHJvdG90eXBlIGluc3RhbmNlb2YgR2VuZXJhdG9yLlxuICAgIHZhciBwcm90b0dlbmVyYXRvciA9IG91dGVyRm4gJiYgb3V0ZXJGbi5wcm90b3R5cGUgaW5zdGFuY2VvZiBHZW5lcmF0b3IgPyBvdXRlckZuIDogR2VuZXJhdG9yO1xuICAgIHZhciBnZW5lcmF0b3IgPSBPYmplY3QuY3JlYXRlKHByb3RvR2VuZXJhdG9yLnByb3RvdHlwZSk7XG4gICAgdmFyIGNvbnRleHQgPSBuZXcgQ29udGV4dCh0cnlMb2NzTGlzdCB8fCBbXSk7XG5cbiAgICAvLyBUaGUgLl9pbnZva2UgbWV0aG9kIHVuaWZpZXMgdGhlIGltcGxlbWVudGF0aW9ucyBvZiB0aGUgLm5leHQsXG4gICAgLy8gLnRocm93LCBhbmQgLnJldHVybiBtZXRob2RzLlxuICAgIGdlbmVyYXRvci5faW52b2tlID0gbWFrZUludm9rZU1ldGhvZChpbm5lckZuLCBzZWxmLCBjb250ZXh0KTtcblxuICAgIHJldHVybiBnZW5lcmF0b3I7XG4gIH1cbiAgZXhwb3J0cy53cmFwID0gd3JhcDtcblxuICAvLyBUcnkvY2F0Y2ggaGVscGVyIHRvIG1pbmltaXplIGRlb3B0aW1pemF0aW9ucy4gUmV0dXJucyBhIGNvbXBsZXRpb25cbiAgLy8gcmVjb3JkIGxpa2UgY29udGV4dC50cnlFbnRyaWVzW2ldLmNvbXBsZXRpb24uIFRoaXMgaW50ZXJmYWNlIGNvdWxkXG4gIC8vIGhhdmUgYmVlbiAoYW5kIHdhcyBwcmV2aW91c2x5KSBkZXNpZ25lZCB0byB0YWtlIGEgY2xvc3VyZSB0byBiZVxuICAvLyBpbnZva2VkIHdpdGhvdXQgYXJndW1lbnRzLCBidXQgaW4gYWxsIHRoZSBjYXNlcyB3ZSBjYXJlIGFib3V0IHdlXG4gIC8vIGFscmVhZHkgaGF2ZSBhbiBleGlzdGluZyBtZXRob2Qgd2Ugd2FudCB0byBjYWxsLCBzbyB0aGVyZSdzIG5vIG5lZWRcbiAgLy8gdG8gY3JlYXRlIGEgbmV3IGZ1bmN0aW9uIG9iamVjdC4gV2UgY2FuIGV2ZW4gZ2V0IGF3YXkgd2l0aCBhc3N1bWluZ1xuICAvLyB0aGUgbWV0aG9kIHRha2VzIGV4YWN0bHkgb25lIGFyZ3VtZW50LCBzaW5jZSB0aGF0IGhhcHBlbnMgdG8gYmUgdHJ1ZVxuICAvLyBpbiBldmVyeSBjYXNlLCBzbyB3ZSBkb24ndCBoYXZlIHRvIHRvdWNoIHRoZSBhcmd1bWVudHMgb2JqZWN0LiBUaGVcbiAgLy8gb25seSBhZGRpdGlvbmFsIGFsbG9jYXRpb24gcmVxdWlyZWQgaXMgdGhlIGNvbXBsZXRpb24gcmVjb3JkLCB3aGljaFxuICAvLyBoYXMgYSBzdGFibGUgc2hhcGUgYW5kIHNvIGhvcGVmdWxseSBzaG91bGQgYmUgY2hlYXAgdG8gYWxsb2NhdGUuXG4gIGZ1bmN0aW9uIHRyeUNhdGNoKGZuLCBvYmosIGFyZykge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4geyB0eXBlOiBcIm5vcm1hbFwiLCBhcmc6IGZuLmNhbGwob2JqLCBhcmcpIH07XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm4geyB0eXBlOiBcInRocm93XCIsIGFyZzogZXJyIH07XG4gICAgfVxuICB9XG5cbiAgdmFyIEdlblN0YXRlU3VzcGVuZGVkU3RhcnQgPSBcInN1c3BlbmRlZFN0YXJ0XCI7XG4gIHZhciBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkID0gXCJzdXNwZW5kZWRZaWVsZFwiO1xuICB2YXIgR2VuU3RhdGVFeGVjdXRpbmcgPSBcImV4ZWN1dGluZ1wiO1xuICB2YXIgR2VuU3RhdGVDb21wbGV0ZWQgPSBcImNvbXBsZXRlZFwiO1xuXG4gIC8vIFJldHVybmluZyB0aGlzIG9iamVjdCBmcm9tIHRoZSBpbm5lckZuIGhhcyB0aGUgc2FtZSBlZmZlY3QgYXNcbiAgLy8gYnJlYWtpbmcgb3V0IG9mIHRoZSBkaXNwYXRjaCBzd2l0Y2ggc3RhdGVtZW50LlxuICB2YXIgQ29udGludWVTZW50aW5lbCA9IHt9O1xuXG4gIC8vIER1bW15IGNvbnN0cnVjdG9yIGZ1bmN0aW9ucyB0aGF0IHdlIHVzZSBhcyB0aGUgLmNvbnN0cnVjdG9yIGFuZFxuICAvLyAuY29uc3RydWN0b3IucHJvdG90eXBlIHByb3BlcnRpZXMgZm9yIGZ1bmN0aW9ucyB0aGF0IHJldHVybiBHZW5lcmF0b3JcbiAgLy8gb2JqZWN0cy4gRm9yIGZ1bGwgc3BlYyBjb21wbGlhbmNlLCB5b3UgbWF5IHdpc2ggdG8gY29uZmlndXJlIHlvdXJcbiAgLy8gbWluaWZpZXIgbm90IHRvIG1hbmdsZSB0aGUgbmFtZXMgb2YgdGhlc2UgdHdvIGZ1bmN0aW9ucy5cbiAgZnVuY3Rpb24gR2VuZXJhdG9yKCkge31cbiAgZnVuY3Rpb24gR2VuZXJhdG9yRnVuY3Rpb24oKSB7fVxuICBmdW5jdGlvbiBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSgpIHt9XG5cbiAgLy8gVGhpcyBpcyBhIHBvbHlmaWxsIGZvciAlSXRlcmF0b3JQcm90b3R5cGUlIGZvciBlbnZpcm9ubWVudHMgdGhhdFxuICAvLyBkb24ndCBuYXRpdmVseSBzdXBwb3J0IGl0LlxuICB2YXIgSXRlcmF0b3JQcm90b3R5cGUgPSB7fTtcbiAgSXRlcmF0b3JQcm90b3R5cGVbaXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIHZhciBnZXRQcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZjtcbiAgdmFyIE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlID0gZ2V0UHJvdG8gJiYgZ2V0UHJvdG8oZ2V0UHJvdG8odmFsdWVzKFtdKSkpO1xuICBpZiAoTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgJiZcbiAgICAgIE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlICE9PSBPcCAmJlxuICAgICAgaGFzT3duLmNhbGwoTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUsIGl0ZXJhdG9yU3ltYm9sKSkge1xuICAgIC8vIFRoaXMgZW52aXJvbm1lbnQgaGFzIGEgbmF0aXZlICVJdGVyYXRvclByb3RvdHlwZSU7IHVzZSBpdCBpbnN0ZWFkXG4gICAgLy8gb2YgdGhlIHBvbHlmaWxsLlxuICAgIEl0ZXJhdG9yUHJvdG90eXBlID0gTmF0aXZlSXRlcmF0b3JQcm90b3R5cGU7XG4gIH1cblxuICB2YXIgR3AgPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZS5wcm90b3R5cGUgPVxuICAgIEdlbmVyYXRvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEl0ZXJhdG9yUHJvdG90eXBlKTtcbiAgR2VuZXJhdG9yRnVuY3Rpb24ucHJvdG90eXBlID0gR3AuY29uc3RydWN0b3IgPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZTtcbiAgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUuY29uc3RydWN0b3IgPSBHZW5lcmF0b3JGdW5jdGlvbjtcbiAgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGVbdG9TdHJpbmdUYWdTeW1ib2xdID1cbiAgICBHZW5lcmF0b3JGdW5jdGlvbi5kaXNwbGF5TmFtZSA9IFwiR2VuZXJhdG9yRnVuY3Rpb25cIjtcblxuICAvLyBIZWxwZXIgZm9yIGRlZmluaW5nIHRoZSAubmV4dCwgLnRocm93LCBhbmQgLnJldHVybiBtZXRob2RzIG9mIHRoZVxuICAvLyBJdGVyYXRvciBpbnRlcmZhY2UgaW4gdGVybXMgb2YgYSBzaW5nbGUgLl9pbnZva2UgbWV0aG9kLlxuICBmdW5jdGlvbiBkZWZpbmVJdGVyYXRvck1ldGhvZHMocHJvdG90eXBlKSB7XG4gICAgW1wibmV4dFwiLCBcInRocm93XCIsIFwicmV0dXJuXCJdLmZvckVhY2goZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICBwcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uKGFyZykge1xuICAgICAgICByZXR1cm4gdGhpcy5faW52b2tlKG1ldGhvZCwgYXJnKTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICBleHBvcnRzLmlzR2VuZXJhdG9yRnVuY3Rpb24gPSBmdW5jdGlvbihnZW5GdW4pIHtcbiAgICB2YXIgY3RvciA9IHR5cGVvZiBnZW5GdW4gPT09IFwiZnVuY3Rpb25cIiAmJiBnZW5GdW4uY29uc3RydWN0b3I7XG4gICAgcmV0dXJuIGN0b3JcbiAgICAgID8gY3RvciA9PT0gR2VuZXJhdG9yRnVuY3Rpb24gfHxcbiAgICAgICAgLy8gRm9yIHRoZSBuYXRpdmUgR2VuZXJhdG9yRnVuY3Rpb24gY29uc3RydWN0b3IsIHRoZSBiZXN0IHdlIGNhblxuICAgICAgICAvLyBkbyBpcyB0byBjaGVjayBpdHMgLm5hbWUgcHJvcGVydHkuXG4gICAgICAgIChjdG9yLmRpc3BsYXlOYW1lIHx8IGN0b3IubmFtZSkgPT09IFwiR2VuZXJhdG9yRnVuY3Rpb25cIlxuICAgICAgOiBmYWxzZTtcbiAgfTtcblxuICBleHBvcnRzLm1hcmsgPSBmdW5jdGlvbihnZW5GdW4pIHtcbiAgICBpZiAoT2JqZWN0LnNldFByb3RvdHlwZU9mKSB7XG4gICAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YoZ2VuRnVuLCBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGdlbkZ1bi5fX3Byb3RvX18gPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZTtcbiAgICAgIGlmICghKHRvU3RyaW5nVGFnU3ltYm9sIGluIGdlbkZ1bikpIHtcbiAgICAgICAgZ2VuRnVuW3RvU3RyaW5nVGFnU3ltYm9sXSA9IFwiR2VuZXJhdG9yRnVuY3Rpb25cIjtcbiAgICAgIH1cbiAgICB9XG4gICAgZ2VuRnVuLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoR3ApO1xuICAgIHJldHVybiBnZW5GdW47XG4gIH07XG5cbiAgLy8gV2l0aGluIHRoZSBib2R5IG9mIGFueSBhc3luYyBmdW5jdGlvbiwgYGF3YWl0IHhgIGlzIHRyYW5zZm9ybWVkIHRvXG4gIC8vIGB5aWVsZCByZWdlbmVyYXRvclJ1bnRpbWUuYXdyYXAoeClgLCBzbyB0aGF0IHRoZSBydW50aW1lIGNhbiB0ZXN0XG4gIC8vIGBoYXNPd24uY2FsbCh2YWx1ZSwgXCJfX2F3YWl0XCIpYCB0byBkZXRlcm1pbmUgaWYgdGhlIHlpZWxkZWQgdmFsdWUgaXNcbiAgLy8gbWVhbnQgdG8gYmUgYXdhaXRlZC5cbiAgZXhwb3J0cy5hd3JhcCA9IGZ1bmN0aW9uKGFyZykge1xuICAgIHJldHVybiB7IF9fYXdhaXQ6IGFyZyB9O1xuICB9O1xuXG4gIGZ1bmN0aW9uIEFzeW5jSXRlcmF0b3IoZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gaW52b2tlKG1ldGhvZCwgYXJnLCByZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChnZW5lcmF0b3JbbWV0aG9kXSwgZ2VuZXJhdG9yLCBhcmcpO1xuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgcmVqZWN0KHJlY29yZC5hcmcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHJlY29yZC5hcmc7XG4gICAgICAgIHZhciB2YWx1ZSA9IHJlc3VsdC52YWx1ZTtcbiAgICAgICAgaWYgKHZhbHVlICYmXG4gICAgICAgICAgICB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiZcbiAgICAgICAgICAgIGhhc093bi5jYWxsKHZhbHVlLCBcIl9fYXdhaXRcIikpIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHZhbHVlLl9fYXdhaXQpLnRoZW4oZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIGludm9rZShcIm5leHRcIiwgdmFsdWUsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICBpbnZva2UoXCJ0aHJvd1wiLCBlcnIsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHZhbHVlKS50aGVuKGZ1bmN0aW9uKHVud3JhcHBlZCkge1xuICAgICAgICAgIC8vIFdoZW4gYSB5aWVsZGVkIFByb21pc2UgaXMgcmVzb2x2ZWQsIGl0cyBmaW5hbCB2YWx1ZSBiZWNvbWVzXG4gICAgICAgICAgLy8gdGhlIC52YWx1ZSBvZiB0aGUgUHJvbWlzZTx7dmFsdWUsZG9uZX0+IHJlc3VsdCBmb3IgdGhlXG4gICAgICAgICAgLy8gY3VycmVudCBpdGVyYXRpb24uXG4gICAgICAgICAgcmVzdWx0LnZhbHVlID0gdW53cmFwcGVkO1xuICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAvLyBJZiBhIHJlamVjdGVkIFByb21pc2Ugd2FzIHlpZWxkZWQsIHRocm93IHRoZSByZWplY3Rpb24gYmFja1xuICAgICAgICAgIC8vIGludG8gdGhlIGFzeW5jIGdlbmVyYXRvciBmdW5jdGlvbiBzbyBpdCBjYW4gYmUgaGFuZGxlZCB0aGVyZS5cbiAgICAgICAgICByZXR1cm4gaW52b2tlKFwidGhyb3dcIiwgZXJyb3IsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBwcmV2aW91c1Byb21pc2U7XG5cbiAgICBmdW5jdGlvbiBlbnF1ZXVlKG1ldGhvZCwgYXJnKSB7XG4gICAgICBmdW5jdGlvbiBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZygpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgIGludm9rZShtZXRob2QsIGFyZywgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwcmV2aW91c1Byb21pc2UgPVxuICAgICAgICAvLyBJZiBlbnF1ZXVlIGhhcyBiZWVuIGNhbGxlZCBiZWZvcmUsIHRoZW4gd2Ugd2FudCB0byB3YWl0IHVudGlsXG4gICAgICAgIC8vIGFsbCBwcmV2aW91cyBQcm9taXNlcyBoYXZlIGJlZW4gcmVzb2x2ZWQgYmVmb3JlIGNhbGxpbmcgaW52b2tlLFxuICAgICAgICAvLyBzbyB0aGF0IHJlc3VsdHMgYXJlIGFsd2F5cyBkZWxpdmVyZWQgaW4gdGhlIGNvcnJlY3Qgb3JkZXIuIElmXG4gICAgICAgIC8vIGVucXVldWUgaGFzIG5vdCBiZWVuIGNhbGxlZCBiZWZvcmUsIHRoZW4gaXQgaXMgaW1wb3J0YW50IHRvXG4gICAgICAgIC8vIGNhbGwgaW52b2tlIGltbWVkaWF0ZWx5LCB3aXRob3V0IHdhaXRpbmcgb24gYSBjYWxsYmFjayB0byBmaXJlLFxuICAgICAgICAvLyBzbyB0aGF0IHRoZSBhc3luYyBnZW5lcmF0b3IgZnVuY3Rpb24gaGFzIHRoZSBvcHBvcnR1bml0eSB0byBkb1xuICAgICAgICAvLyBhbnkgbmVjZXNzYXJ5IHNldHVwIGluIGEgcHJlZGljdGFibGUgd2F5LiBUaGlzIHByZWRpY3RhYmlsaXR5XG4gICAgICAgIC8vIGlzIHdoeSB0aGUgUHJvbWlzZSBjb25zdHJ1Y3RvciBzeW5jaHJvbm91c2x5IGludm9rZXMgaXRzXG4gICAgICAgIC8vIGV4ZWN1dG9yIGNhbGxiYWNrLCBhbmQgd2h5IGFzeW5jIGZ1bmN0aW9ucyBzeW5jaHJvbm91c2x5XG4gICAgICAgIC8vIGV4ZWN1dGUgY29kZSBiZWZvcmUgdGhlIGZpcnN0IGF3YWl0LiBTaW5jZSB3ZSBpbXBsZW1lbnQgc2ltcGxlXG4gICAgICAgIC8vIGFzeW5jIGZ1bmN0aW9ucyBpbiB0ZXJtcyBvZiBhc3luYyBnZW5lcmF0b3JzLCBpdCBpcyBlc3BlY2lhbGx5XG4gICAgICAgIC8vIGltcG9ydGFudCB0byBnZXQgdGhpcyByaWdodCwgZXZlbiB0aG91Z2ggaXQgcmVxdWlyZXMgY2FyZS5cbiAgICAgICAgcHJldmlvdXNQcm9taXNlID8gcHJldmlvdXNQcm9taXNlLnRoZW4oXG4gICAgICAgICAgY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcsXG4gICAgICAgICAgLy8gQXZvaWQgcHJvcGFnYXRpbmcgZmFpbHVyZXMgdG8gUHJvbWlzZXMgcmV0dXJuZWQgYnkgbGF0ZXJcbiAgICAgICAgICAvLyBpbnZvY2F0aW9ucyBvZiB0aGUgaXRlcmF0b3IuXG4gICAgICAgICAgY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmdcbiAgICAgICAgKSA6IGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnKCk7XG4gICAgfVxuXG4gICAgLy8gRGVmaW5lIHRoZSB1bmlmaWVkIGhlbHBlciBtZXRob2QgdGhhdCBpcyB1c2VkIHRvIGltcGxlbWVudCAubmV4dCxcbiAgICAvLyAudGhyb3csIGFuZCAucmV0dXJuIChzZWUgZGVmaW5lSXRlcmF0b3JNZXRob2RzKS5cbiAgICB0aGlzLl9pbnZva2UgPSBlbnF1ZXVlO1xuICB9XG5cbiAgZGVmaW5lSXRlcmF0b3JNZXRob2RzKEFzeW5jSXRlcmF0b3IucHJvdG90eXBlKTtcbiAgQXN5bmNJdGVyYXRvci5wcm90b3R5cGVbYXN5bmNJdGVyYXRvclN5bWJvbF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIGV4cG9ydHMuQXN5bmNJdGVyYXRvciA9IEFzeW5jSXRlcmF0b3I7XG5cbiAgLy8gTm90ZSB0aGF0IHNpbXBsZSBhc3luYyBmdW5jdGlvbnMgYXJlIGltcGxlbWVudGVkIG9uIHRvcCBvZlxuICAvLyBBc3luY0l0ZXJhdG9yIG9iamVjdHM7IHRoZXkganVzdCByZXR1cm4gYSBQcm9taXNlIGZvciB0aGUgdmFsdWUgb2ZcbiAgLy8gdGhlIGZpbmFsIHJlc3VsdCBwcm9kdWNlZCBieSB0aGUgaXRlcmF0b3IuXG4gIGV4cG9ydHMuYXN5bmMgPSBmdW5jdGlvbihpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCkge1xuICAgIHZhciBpdGVyID0gbmV3IEFzeW5jSXRlcmF0b3IoXG4gICAgICB3cmFwKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KVxuICAgICk7XG5cbiAgICByZXR1cm4gZXhwb3J0cy5pc0dlbmVyYXRvckZ1bmN0aW9uKG91dGVyRm4pXG4gICAgICA/IGl0ZXIgLy8gSWYgb3V0ZXJGbiBpcyBhIGdlbmVyYXRvciwgcmV0dXJuIHRoZSBmdWxsIGl0ZXJhdG9yLlxuICAgICAgOiBpdGVyLm5leHQoKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgIHJldHVybiByZXN1bHQuZG9uZSA/IHJlc3VsdC52YWx1ZSA6IGl0ZXIubmV4dCgpO1xuICAgICAgICB9KTtcbiAgfTtcblxuICBmdW5jdGlvbiBtYWtlSW52b2tlTWV0aG9kKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpIHtcbiAgICB2YXIgc3RhdGUgPSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0O1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGludm9rZShtZXRob2QsIGFyZykge1xuICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZUV4ZWN1dGluZykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBydW5uaW5nXCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlQ29tcGxldGVkKSB7XG4gICAgICAgIGlmIChtZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIHRocm93IGFyZztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEJlIGZvcmdpdmluZywgcGVyIDI1LjMuMy4zLjMgb2YgdGhlIHNwZWM6XG4gICAgICAgIC8vIGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1nZW5lcmF0b3JyZXN1bWVcbiAgICAgICAgcmV0dXJuIGRvbmVSZXN1bHQoKTtcbiAgICAgIH1cblxuICAgICAgY29udGV4dC5tZXRob2QgPSBtZXRob2Q7XG4gICAgICBjb250ZXh0LmFyZyA9IGFyZztcblxuICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgdmFyIGRlbGVnYXRlID0gY29udGV4dC5kZWxlZ2F0ZTtcbiAgICAgICAgaWYgKGRlbGVnYXRlKSB7XG4gICAgICAgICAgdmFyIGRlbGVnYXRlUmVzdWx0ID0gbWF5YmVJbnZva2VEZWxlZ2F0ZShkZWxlZ2F0ZSwgY29udGV4dCk7XG4gICAgICAgICAgaWYgKGRlbGVnYXRlUmVzdWx0KSB7XG4gICAgICAgICAgICBpZiAoZGVsZWdhdGVSZXN1bHQgPT09IENvbnRpbnVlU2VudGluZWwpIGNvbnRpbnVlO1xuICAgICAgICAgICAgcmV0dXJuIGRlbGVnYXRlUmVzdWx0O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJuZXh0XCIpIHtcbiAgICAgICAgICAvLyBTZXR0aW5nIGNvbnRleHQuX3NlbnQgZm9yIGxlZ2FjeSBzdXBwb3J0IG9mIEJhYmVsJ3NcbiAgICAgICAgICAvLyBmdW5jdGlvbi5zZW50IGltcGxlbWVudGF0aW9uLlxuICAgICAgICAgIGNvbnRleHQuc2VudCA9IGNvbnRleHQuX3NlbnQgPSBjb250ZXh0LmFyZztcblxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlU3VzcGVuZGVkU3RhcnQpIHtcbiAgICAgICAgICAgIHN0YXRlID0gR2VuU3RhdGVDb21wbGV0ZWQ7XG4gICAgICAgICAgICB0aHJvdyBjb250ZXh0LmFyZztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb250ZXh0LmRpc3BhdGNoRXhjZXB0aW9uKGNvbnRleHQuYXJnKTtcblxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInJldHVyblwiKSB7XG4gICAgICAgICAgY29udGV4dC5hYnJ1cHQoXCJyZXR1cm5cIiwgY29udGV4dC5hcmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUV4ZWN1dGluZztcblxuICAgICAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2goaW5uZXJGbiwgc2VsZiwgY29udGV4dCk7XG4gICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJub3JtYWxcIikge1xuICAgICAgICAgIC8vIElmIGFuIGV4Y2VwdGlvbiBpcyB0aHJvd24gZnJvbSBpbm5lckZuLCB3ZSBsZWF2ZSBzdGF0ZSA9PT1cbiAgICAgICAgICAvLyBHZW5TdGF0ZUV4ZWN1dGluZyBhbmQgbG9vcCBiYWNrIGZvciBhbm90aGVyIGludm9jYXRpb24uXG4gICAgICAgICAgc3RhdGUgPSBjb250ZXh0LmRvbmVcbiAgICAgICAgICAgID8gR2VuU3RhdGVDb21wbGV0ZWRcbiAgICAgICAgICAgIDogR2VuU3RhdGVTdXNwZW5kZWRZaWVsZDtcblxuICAgICAgICAgIGlmIChyZWNvcmQuYXJnID09PSBDb250aW51ZVNlbnRpbmVsKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdmFsdWU6IHJlY29yZC5hcmcsXG4gICAgICAgICAgICBkb25lOiBjb250ZXh0LmRvbmVcbiAgICAgICAgICB9O1xuXG4gICAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIHN0YXRlID0gR2VuU3RhdGVDb21wbGV0ZWQ7XG4gICAgICAgICAgLy8gRGlzcGF0Y2ggdGhlIGV4Y2VwdGlvbiBieSBsb29waW5nIGJhY2sgYXJvdW5kIHRvIHRoZVxuICAgICAgICAgIC8vIGNvbnRleHQuZGlzcGF0Y2hFeGNlcHRpb24oY29udGV4dC5hcmcpIGNhbGwgYWJvdmUuXG4gICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICAgICAgY29udGV4dC5hcmcgPSByZWNvcmQuYXJnO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIC8vIENhbGwgZGVsZWdhdGUuaXRlcmF0b3JbY29udGV4dC5tZXRob2RdKGNvbnRleHQuYXJnKSBhbmQgaGFuZGxlIHRoZVxuICAvLyByZXN1bHQsIGVpdGhlciBieSByZXR1cm5pbmcgYSB7IHZhbHVlLCBkb25lIH0gcmVzdWx0IGZyb20gdGhlXG4gIC8vIGRlbGVnYXRlIGl0ZXJhdG9yLCBvciBieSBtb2RpZnlpbmcgY29udGV4dC5tZXRob2QgYW5kIGNvbnRleHQuYXJnLFxuICAvLyBzZXR0aW5nIGNvbnRleHQuZGVsZWdhdGUgdG8gbnVsbCwgYW5kIHJldHVybmluZyB0aGUgQ29udGludWVTZW50aW5lbC5cbiAgZnVuY3Rpb24gbWF5YmVJbnZva2VEZWxlZ2F0ZShkZWxlZ2F0ZSwgY29udGV4dCkge1xuICAgIHZhciBtZXRob2QgPSBkZWxlZ2F0ZS5pdGVyYXRvcltjb250ZXh0Lm1ldGhvZF07XG4gICAgaWYgKG1ldGhvZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBBIC50aHJvdyBvciAucmV0dXJuIHdoZW4gdGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGhhcyBubyAudGhyb3dcbiAgICAgIC8vIG1ldGhvZCBhbHdheXMgdGVybWluYXRlcyB0aGUgeWllbGQqIGxvb3AuXG4gICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcblxuICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgLy8gTm90ZTogW1wicmV0dXJuXCJdIG11c3QgYmUgdXNlZCBmb3IgRVMzIHBhcnNpbmcgY29tcGF0aWJpbGl0eS5cbiAgICAgICAgaWYgKGRlbGVnYXRlLml0ZXJhdG9yW1wicmV0dXJuXCJdKSB7XG4gICAgICAgICAgLy8gSWYgdGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGhhcyBhIHJldHVybiBtZXRob2QsIGdpdmUgaXQgYVxuICAgICAgICAgIC8vIGNoYW5jZSB0byBjbGVhbiB1cC5cbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwicmV0dXJuXCI7XG4gICAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgbWF5YmVJbnZva2VEZWxlZ2F0ZShkZWxlZ2F0ZSwgY29udGV4dCk7XG5cbiAgICAgICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgICAgLy8gSWYgbWF5YmVJbnZva2VEZWxlZ2F0ZShjb250ZXh0KSBjaGFuZ2VkIGNvbnRleHQubWV0aG9kIGZyb21cbiAgICAgICAgICAgIC8vIFwicmV0dXJuXCIgdG8gXCJ0aHJvd1wiLCBsZXQgdGhhdCBvdmVycmlkZSB0aGUgVHlwZUVycm9yIGJlbG93LlxuICAgICAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICAgIGNvbnRleHQuYXJnID0gbmV3IFR5cGVFcnJvcihcbiAgICAgICAgICBcIlRoZSBpdGVyYXRvciBkb2VzIG5vdCBwcm92aWRlIGEgJ3Rocm93JyBtZXRob2RcIik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cblxuICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChtZXRob2QsIGRlbGVnYXRlLml0ZXJhdG9yLCBjb250ZXh0LmFyZyk7XG5cbiAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICBjb250ZXh0LmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cblxuICAgIHZhciBpbmZvID0gcmVjb3JkLmFyZztcblxuICAgIGlmICghIGluZm8pIHtcbiAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgY29udGV4dC5hcmcgPSBuZXcgVHlwZUVycm9yKFwiaXRlcmF0b3IgcmVzdWx0IGlzIG5vdCBhbiBvYmplY3RcIik7XG4gICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cblxuICAgIGlmIChpbmZvLmRvbmUpIHtcbiAgICAgIC8vIEFzc2lnbiB0aGUgcmVzdWx0IG9mIHRoZSBmaW5pc2hlZCBkZWxlZ2F0ZSB0byB0aGUgdGVtcG9yYXJ5XG4gICAgICAvLyB2YXJpYWJsZSBzcGVjaWZpZWQgYnkgZGVsZWdhdGUucmVzdWx0TmFtZSAoc2VlIGRlbGVnYXRlWWllbGQpLlxuICAgICAgY29udGV4dFtkZWxlZ2F0ZS5yZXN1bHROYW1lXSA9IGluZm8udmFsdWU7XG5cbiAgICAgIC8vIFJlc3VtZSBleGVjdXRpb24gYXQgdGhlIGRlc2lyZWQgbG9jYXRpb24gKHNlZSBkZWxlZ2F0ZVlpZWxkKS5cbiAgICAgIGNvbnRleHQubmV4dCA9IGRlbGVnYXRlLm5leHRMb2M7XG5cbiAgICAgIC8vIElmIGNvbnRleHQubWV0aG9kIHdhcyBcInRocm93XCIgYnV0IHRoZSBkZWxlZ2F0ZSBoYW5kbGVkIHRoZVxuICAgICAgLy8gZXhjZXB0aW9uLCBsZXQgdGhlIG91dGVyIGdlbmVyYXRvciBwcm9jZWVkIG5vcm1hbGx5LiBJZlxuICAgICAgLy8gY29udGV4dC5tZXRob2Qgd2FzIFwibmV4dFwiLCBmb3JnZXQgY29udGV4dC5hcmcgc2luY2UgaXQgaGFzIGJlZW5cbiAgICAgIC8vIFwiY29uc3VtZWRcIiBieSB0aGUgZGVsZWdhdGUgaXRlcmF0b3IuIElmIGNvbnRleHQubWV0aG9kIHdhc1xuICAgICAgLy8gXCJyZXR1cm5cIiwgYWxsb3cgdGhlIG9yaWdpbmFsIC5yZXR1cm4gY2FsbCB0byBjb250aW51ZSBpbiB0aGVcbiAgICAgIC8vIG91dGVyIGdlbmVyYXRvci5cbiAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCAhPT0gXCJyZXR1cm5cIikge1xuICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBSZS15aWVsZCB0aGUgcmVzdWx0IHJldHVybmVkIGJ5IHRoZSBkZWxlZ2F0ZSBtZXRob2QuXG4gICAgICByZXR1cm4gaW5mbztcbiAgICB9XG5cbiAgICAvLyBUaGUgZGVsZWdhdGUgaXRlcmF0b3IgaXMgZmluaXNoZWQsIHNvIGZvcmdldCBpdCBhbmQgY29udGludWUgd2l0aFxuICAgIC8vIHRoZSBvdXRlciBnZW5lcmF0b3IuXG4gICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gIH1cblxuICAvLyBEZWZpbmUgR2VuZXJhdG9yLnByb3RvdHlwZS57bmV4dCx0aHJvdyxyZXR1cm59IGluIHRlcm1zIG9mIHRoZVxuICAvLyB1bmlmaWVkIC5faW52b2tlIGhlbHBlciBtZXRob2QuXG4gIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhHcCk7XG5cbiAgR3BbdG9TdHJpbmdUYWdTeW1ib2xdID0gXCJHZW5lcmF0b3JcIjtcblxuICAvLyBBIEdlbmVyYXRvciBzaG91bGQgYWx3YXlzIHJldHVybiBpdHNlbGYgYXMgdGhlIGl0ZXJhdG9yIG9iamVjdCB3aGVuIHRoZVxuICAvLyBAQGl0ZXJhdG9yIGZ1bmN0aW9uIGlzIGNhbGxlZCBvbiBpdC4gU29tZSBicm93c2VycycgaW1wbGVtZW50YXRpb25zIG9mIHRoZVxuICAvLyBpdGVyYXRvciBwcm90b3R5cGUgY2hhaW4gaW5jb3JyZWN0bHkgaW1wbGVtZW50IHRoaXMsIGNhdXNpbmcgdGhlIEdlbmVyYXRvclxuICAvLyBvYmplY3QgdG8gbm90IGJlIHJldHVybmVkIGZyb20gdGhpcyBjYWxsLiBUaGlzIGVuc3VyZXMgdGhhdCBkb2Vzbid0IGhhcHBlbi5cbiAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWdlbmVyYXRvci9pc3N1ZXMvMjc0IGZvciBtb3JlIGRldGFpbHMuXG4gIEdwW2l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIEdwLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFwiW29iamVjdCBHZW5lcmF0b3JdXCI7XG4gIH07XG5cbiAgZnVuY3Rpb24gcHVzaFRyeUVudHJ5KGxvY3MpIHtcbiAgICB2YXIgZW50cnkgPSB7IHRyeUxvYzogbG9jc1swXSB9O1xuXG4gICAgaWYgKDEgaW4gbG9jcykge1xuICAgICAgZW50cnkuY2F0Y2hMb2MgPSBsb2NzWzFdO1xuICAgIH1cblxuICAgIGlmICgyIGluIGxvY3MpIHtcbiAgICAgIGVudHJ5LmZpbmFsbHlMb2MgPSBsb2NzWzJdO1xuICAgICAgZW50cnkuYWZ0ZXJMb2MgPSBsb2NzWzNdO1xuICAgIH1cblxuICAgIHRoaXMudHJ5RW50cmllcy5wdXNoKGVudHJ5KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc2V0VHJ5RW50cnkoZW50cnkpIHtcbiAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbiB8fCB7fTtcbiAgICByZWNvcmQudHlwZSA9IFwibm9ybWFsXCI7XG4gICAgZGVsZXRlIHJlY29yZC5hcmc7XG4gICAgZW50cnkuY29tcGxldGlvbiA9IHJlY29yZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIENvbnRleHQodHJ5TG9jc0xpc3QpIHtcbiAgICAvLyBUaGUgcm9vdCBlbnRyeSBvYmplY3QgKGVmZmVjdGl2ZWx5IGEgdHJ5IHN0YXRlbWVudCB3aXRob3V0IGEgY2F0Y2hcbiAgICAvLyBvciBhIGZpbmFsbHkgYmxvY2spIGdpdmVzIHVzIGEgcGxhY2UgdG8gc3RvcmUgdmFsdWVzIHRocm93biBmcm9tXG4gICAgLy8gbG9jYXRpb25zIHdoZXJlIHRoZXJlIGlzIG5vIGVuY2xvc2luZyB0cnkgc3RhdGVtZW50LlxuICAgIHRoaXMudHJ5RW50cmllcyA9IFt7IHRyeUxvYzogXCJyb290XCIgfV07XG4gICAgdHJ5TG9jc0xpc3QuZm9yRWFjaChwdXNoVHJ5RW50cnksIHRoaXMpO1xuICAgIHRoaXMucmVzZXQodHJ1ZSk7XG4gIH1cblxuICBleHBvcnRzLmtleXMgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgICB2YXIga2V5cyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcbiAgICAgIGtleXMucHVzaChrZXkpO1xuICAgIH1cbiAgICBrZXlzLnJldmVyc2UoKTtcblxuICAgIC8vIFJhdGhlciB0aGFuIHJldHVybmluZyBhbiBvYmplY3Qgd2l0aCBhIG5leHQgbWV0aG9kLCB3ZSBrZWVwXG4gICAgLy8gdGhpbmdzIHNpbXBsZSBhbmQgcmV0dXJuIHRoZSBuZXh0IGZ1bmN0aW9uIGl0c2VsZi5cbiAgICByZXR1cm4gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgIHdoaWxlIChrZXlzLmxlbmd0aCkge1xuICAgICAgICB2YXIga2V5ID0ga2V5cy5wb3AoKTtcbiAgICAgICAgaWYgKGtleSBpbiBvYmplY3QpIHtcbiAgICAgICAgICBuZXh0LnZhbHVlID0ga2V5O1xuICAgICAgICAgIG5leHQuZG9uZSA9IGZhbHNlO1xuICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFRvIGF2b2lkIGNyZWF0aW5nIGFuIGFkZGl0aW9uYWwgb2JqZWN0LCB3ZSBqdXN0IGhhbmcgdGhlIC52YWx1ZVxuICAgICAgLy8gYW5kIC5kb25lIHByb3BlcnRpZXMgb2ZmIHRoZSBuZXh0IGZ1bmN0aW9uIG9iamVjdCBpdHNlbGYuIFRoaXNcbiAgICAgIC8vIGFsc28gZW5zdXJlcyB0aGF0IHRoZSBtaW5pZmllciB3aWxsIG5vdCBhbm9ueW1pemUgdGhlIGZ1bmN0aW9uLlxuICAgICAgbmV4dC5kb25lID0gdHJ1ZTtcbiAgICAgIHJldHVybiBuZXh0O1xuICAgIH07XG4gIH07XG5cbiAgZnVuY3Rpb24gdmFsdWVzKGl0ZXJhYmxlKSB7XG4gICAgaWYgKGl0ZXJhYmxlKSB7XG4gICAgICB2YXIgaXRlcmF0b3JNZXRob2QgPSBpdGVyYWJsZVtpdGVyYXRvclN5bWJvbF07XG4gICAgICBpZiAoaXRlcmF0b3JNZXRob2QpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhdG9yTWV0aG9kLmNhbGwoaXRlcmFibGUpO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIGl0ZXJhYmxlLm5leHQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICByZXR1cm4gaXRlcmFibGU7XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNOYU4oaXRlcmFibGUubGVuZ3RoKSkge1xuICAgICAgICB2YXIgaSA9IC0xLCBuZXh0ID0gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgICAgICB3aGlsZSAoKytpIDwgaXRlcmFibGUubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoaGFzT3duLmNhbGwoaXRlcmFibGUsIGkpKSB7XG4gICAgICAgICAgICAgIG5leHQudmFsdWUgPSBpdGVyYWJsZVtpXTtcbiAgICAgICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7XG4gICAgICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIG5leHQudmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgbmV4dC5kb25lID0gdHJ1ZTtcblxuICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBuZXh0Lm5leHQgPSBuZXh0O1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJldHVybiBhbiBpdGVyYXRvciB3aXRoIG5vIHZhbHVlcy5cbiAgICByZXR1cm4geyBuZXh0OiBkb25lUmVzdWx0IH07XG4gIH1cbiAgZXhwb3J0cy52YWx1ZXMgPSB2YWx1ZXM7XG5cbiAgZnVuY3Rpb24gZG9uZVJlc3VsdCgpIHtcbiAgICByZXR1cm4geyB2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlIH07XG4gIH1cblxuICBDb250ZXh0LnByb3RvdHlwZSA9IHtcbiAgICBjb25zdHJ1Y3RvcjogQ29udGV4dCxcblxuICAgIHJlc2V0OiBmdW5jdGlvbihza2lwVGVtcFJlc2V0KSB7XG4gICAgICB0aGlzLnByZXYgPSAwO1xuICAgICAgdGhpcy5uZXh0ID0gMDtcbiAgICAgIC8vIFJlc2V0dGluZyBjb250ZXh0Ll9zZW50IGZvciBsZWdhY3kgc3VwcG9ydCBvZiBCYWJlbCdzXG4gICAgICAvLyBmdW5jdGlvbi5zZW50IGltcGxlbWVudGF0aW9uLlxuICAgICAgdGhpcy5zZW50ID0gdGhpcy5fc2VudCA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuZG9uZSA9IGZhbHNlO1xuICAgICAgdGhpcy5kZWxlZ2F0ZSA9IG51bGw7XG5cbiAgICAgIHRoaXMubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICB0aGlzLmFyZyA9IHVuZGVmaW5lZDtcblxuICAgICAgdGhpcy50cnlFbnRyaWVzLmZvckVhY2gocmVzZXRUcnlFbnRyeSk7XG5cbiAgICAgIGlmICghc2tpcFRlbXBSZXNldCkge1xuICAgICAgICBmb3IgKHZhciBuYW1lIGluIHRoaXMpIHtcbiAgICAgICAgICAvLyBOb3Qgc3VyZSBhYm91dCB0aGUgb3B0aW1hbCBvcmRlciBvZiB0aGVzZSBjb25kaXRpb25zOlxuICAgICAgICAgIGlmIChuYW1lLmNoYXJBdCgwKSA9PT0gXCJ0XCIgJiZcbiAgICAgICAgICAgICAgaGFzT3duLmNhbGwodGhpcywgbmFtZSkgJiZcbiAgICAgICAgICAgICAgIWlzTmFOKCtuYW1lLnNsaWNlKDEpKSkge1xuICAgICAgICAgICAgdGhpc1tuYW1lXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgc3RvcDogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLmRvbmUgPSB0cnVlO1xuXG4gICAgICB2YXIgcm9vdEVudHJ5ID0gdGhpcy50cnlFbnRyaWVzWzBdO1xuICAgICAgdmFyIHJvb3RSZWNvcmQgPSByb290RW50cnkuY29tcGxldGlvbjtcbiAgICAgIGlmIChyb290UmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyByb290UmVjb3JkLmFyZztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMucnZhbDtcbiAgICB9LFxuXG4gICAgZGlzcGF0Y2hFeGNlcHRpb246IGZ1bmN0aW9uKGV4Y2VwdGlvbikge1xuICAgICAgaWYgKHRoaXMuZG9uZSkge1xuICAgICAgICB0aHJvdyBleGNlcHRpb247XG4gICAgICB9XG5cbiAgICAgIHZhciBjb250ZXh0ID0gdGhpcztcbiAgICAgIGZ1bmN0aW9uIGhhbmRsZShsb2MsIGNhdWdodCkge1xuICAgICAgICByZWNvcmQudHlwZSA9IFwidGhyb3dcIjtcbiAgICAgICAgcmVjb3JkLmFyZyA9IGV4Y2VwdGlvbjtcbiAgICAgICAgY29udGV4dC5uZXh0ID0gbG9jO1xuXG4gICAgICAgIGlmIChjYXVnaHQpIHtcbiAgICAgICAgICAvLyBJZiB0aGUgZGlzcGF0Y2hlZCBleGNlcHRpb24gd2FzIGNhdWdodCBieSBhIGNhdGNoIGJsb2NrLFxuICAgICAgICAgIC8vIHRoZW4gbGV0IHRoYXQgY2F0Y2ggYmxvY2sgaGFuZGxlIHRoZSBleGNlcHRpb24gbm9ybWFsbHkuXG4gICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAhISBjYXVnaHQ7XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjtcblxuICAgICAgICBpZiAoZW50cnkudHJ5TG9jID09PSBcInJvb3RcIikge1xuICAgICAgICAgIC8vIEV4Y2VwdGlvbiB0aHJvd24gb3V0c2lkZSBvZiBhbnkgdHJ5IGJsb2NrIHRoYXQgY291bGQgaGFuZGxlXG4gICAgICAgICAgLy8gaXQsIHNvIHNldCB0aGUgY29tcGxldGlvbiB2YWx1ZSBvZiB0aGUgZW50aXJlIGZ1bmN0aW9uIHRvXG4gICAgICAgICAgLy8gdGhyb3cgdGhlIGV4Y2VwdGlvbi5cbiAgICAgICAgICByZXR1cm4gaGFuZGxlKFwiZW5kXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA8PSB0aGlzLnByZXYpIHtcbiAgICAgICAgICB2YXIgaGFzQ2F0Y2ggPSBoYXNPd24uY2FsbChlbnRyeSwgXCJjYXRjaExvY1wiKTtcbiAgICAgICAgICB2YXIgaGFzRmluYWxseSA9IGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIik7XG5cbiAgICAgICAgICBpZiAoaGFzQ2F0Y2ggJiYgaGFzRmluYWxseSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuZmluYWxseUxvYyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2UgaWYgKGhhc0NhdGNoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuY2F0Y2hMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5jYXRjaExvYywgdHJ1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2UgaWYgKGhhc0ZpbmFsbHkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuZmluYWxseUxvYyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidHJ5IHN0YXRlbWVudCB3aXRob3V0IGNhdGNoIG9yIGZpbmFsbHlcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIGFicnVwdDogZnVuY3Rpb24odHlwZSwgYXJnKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA8PSB0aGlzLnByZXYgJiZcbiAgICAgICAgICAgIGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIikgJiZcbiAgICAgICAgICAgIHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICB2YXIgZmluYWxseUVudHJ5ID0gZW50cnk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGZpbmFsbHlFbnRyeSAmJlxuICAgICAgICAgICh0eXBlID09PSBcImJyZWFrXCIgfHxcbiAgICAgICAgICAgdHlwZSA9PT0gXCJjb250aW51ZVwiKSAmJlxuICAgICAgICAgIGZpbmFsbHlFbnRyeS50cnlMb2MgPD0gYXJnICYmXG4gICAgICAgICAgYXJnIDw9IGZpbmFsbHlFbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgIC8vIElnbm9yZSB0aGUgZmluYWxseSBlbnRyeSBpZiBjb250cm9sIGlzIG5vdCBqdW1waW5nIHRvIGFcbiAgICAgICAgLy8gbG9jYXRpb24gb3V0c2lkZSB0aGUgdHJ5L2NhdGNoIGJsb2NrLlxuICAgICAgICBmaW5hbGx5RW50cnkgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICB2YXIgcmVjb3JkID0gZmluYWxseUVudHJ5ID8gZmluYWxseUVudHJ5LmNvbXBsZXRpb24gOiB7fTtcbiAgICAgIHJlY29yZC50eXBlID0gdHlwZTtcbiAgICAgIHJlY29yZC5hcmcgPSBhcmc7XG5cbiAgICAgIGlmIChmaW5hbGx5RW50cnkpIHtcbiAgICAgICAgdGhpcy5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgdGhpcy5uZXh0ID0gZmluYWxseUVudHJ5LmZpbmFsbHlMb2M7XG4gICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5jb21wbGV0ZShyZWNvcmQpO1xuICAgIH0sXG5cbiAgICBjb21wbGV0ZTogZnVuY3Rpb24ocmVjb3JkLCBhZnRlckxvYykge1xuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgdGhyb3cgcmVjb3JkLmFyZztcbiAgICAgIH1cblxuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcImJyZWFrXCIgfHxcbiAgICAgICAgICByZWNvcmQudHlwZSA9PT0gXCJjb250aW51ZVwiKSB7XG4gICAgICAgIHRoaXMubmV4dCA9IHJlY29yZC5hcmc7XG4gICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcInJldHVyblwiKSB7XG4gICAgICAgIHRoaXMucnZhbCA9IHRoaXMuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgICAgdGhpcy5tZXRob2QgPSBcInJldHVyblwiO1xuICAgICAgICB0aGlzLm5leHQgPSBcImVuZFwiO1xuICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJub3JtYWxcIiAmJiBhZnRlckxvYykge1xuICAgICAgICB0aGlzLm5leHQgPSBhZnRlckxvYztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfSxcblxuICAgIGZpbmlzaDogZnVuY3Rpb24oZmluYWxseUxvYykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS5maW5hbGx5TG9jID09PSBmaW5hbGx5TG9jKSB7XG4gICAgICAgICAgdGhpcy5jb21wbGV0ZShlbnRyeS5jb21wbGV0aW9uLCBlbnRyeS5hZnRlckxvYyk7XG4gICAgICAgICAgcmVzZXRUcnlFbnRyeShlbnRyeSk7XG4gICAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgXCJjYXRjaFwiOiBmdW5jdGlvbih0cnlMb2MpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkudHJ5TG9jID09PSB0cnlMb2MpIHtcbiAgICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjtcbiAgICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgICAgdmFyIHRocm93biA9IHJlY29yZC5hcmc7XG4gICAgICAgICAgICByZXNldFRyeUVudHJ5KGVudHJ5KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRocm93bjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUaGUgY29udGV4dC5jYXRjaCBtZXRob2QgbXVzdCBvbmx5IGJlIGNhbGxlZCB3aXRoIGEgbG9jYXRpb25cbiAgICAgIC8vIGFyZ3VtZW50IHRoYXQgY29ycmVzcG9uZHMgdG8gYSBrbm93biBjYXRjaCBibG9jay5cbiAgICAgIHRocm93IG5ldyBFcnJvcihcImlsbGVnYWwgY2F0Y2ggYXR0ZW1wdFwiKTtcbiAgICB9LFxuXG4gICAgZGVsZWdhdGVZaWVsZDogZnVuY3Rpb24oaXRlcmFibGUsIHJlc3VsdE5hbWUsIG5leHRMb2MpIHtcbiAgICAgIHRoaXMuZGVsZWdhdGUgPSB7XG4gICAgICAgIGl0ZXJhdG9yOiB2YWx1ZXMoaXRlcmFibGUpLFxuICAgICAgICByZXN1bHROYW1lOiByZXN1bHROYW1lLFxuICAgICAgICBuZXh0TG9jOiBuZXh0TG9jXG4gICAgICB9O1xuXG4gICAgICBpZiAodGhpcy5tZXRob2QgPT09IFwibmV4dFwiKSB7XG4gICAgICAgIC8vIERlbGliZXJhdGVseSBmb3JnZXQgdGhlIGxhc3Qgc2VudCB2YWx1ZSBzbyB0aGF0IHdlIGRvbid0XG4gICAgICAgIC8vIGFjY2lkZW50YWxseSBwYXNzIGl0IG9uIHRvIHRoZSBkZWxlZ2F0ZS5cbiAgICAgICAgdGhpcy5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cbiAgfTtcblxuICAvLyBSZWdhcmRsZXNzIG9mIHdoZXRoZXIgdGhpcyBzY3JpcHQgaXMgZXhlY3V0aW5nIGFzIGEgQ29tbW9uSlMgbW9kdWxlXG4gIC8vIG9yIG5vdCwgcmV0dXJuIHRoZSBydW50aW1lIG9iamVjdCBzbyB0aGF0IHdlIGNhbiBkZWNsYXJlIHRoZSB2YXJpYWJsZVxuICAvLyByZWdlbmVyYXRvclJ1bnRpbWUgaW4gdGhlIG91dGVyIHNjb3BlLCB3aGljaCBhbGxvd3MgdGhpcyBtb2R1bGUgdG8gYmVcbiAgLy8gaW5qZWN0ZWQgZWFzaWx5IGJ5IGBiaW4vcmVnZW5lcmF0b3IgLS1pbmNsdWRlLXJ1bnRpbWUgc2NyaXB0LmpzYC5cbiAgcmV0dXJuIGV4cG9ydHM7XG5cbn0oXG4gIC8vIElmIHRoaXMgc2NyaXB0IGlzIGV4ZWN1dGluZyBhcyBhIENvbW1vbkpTIG1vZHVsZSwgdXNlIG1vZHVsZS5leHBvcnRzXG4gIC8vIGFzIHRoZSByZWdlbmVyYXRvclJ1bnRpbWUgbmFtZXNwYWNlLiBPdGhlcndpc2UgY3JlYXRlIGEgbmV3IGVtcHR5XG4gIC8vIG9iamVjdC4gRWl0aGVyIHdheSwgdGhlIHJlc3VsdGluZyBvYmplY3Qgd2lsbCBiZSB1c2VkIHRvIGluaXRpYWxpemVcbiAgLy8gdGhlIHJlZ2VuZXJhdG9yUnVudGltZSB2YXJpYWJsZSBhdCB0aGUgdG9wIG9mIHRoaXMgZmlsZS5cbiAgdHlwZW9mIG1vZHVsZSA9PT0gXCJvYmplY3RcIiA/IG1vZHVsZS5leHBvcnRzIDoge31cbikpO1xuXG50cnkge1xuICByZWdlbmVyYXRvclJ1bnRpbWUgPSBydW50aW1lO1xufSBjYXRjaCAoYWNjaWRlbnRhbFN0cmljdE1vZGUpIHtcbiAgLy8gVGhpcyBtb2R1bGUgc2hvdWxkIG5vdCBiZSBydW5uaW5nIGluIHN0cmljdCBtb2RlLCBzbyB0aGUgYWJvdmVcbiAgLy8gYXNzaWdubWVudCBzaG91bGQgYWx3YXlzIHdvcmsgdW5sZXNzIHNvbWV0aGluZyBpcyBtaXNjb25maWd1cmVkLiBKdXN0XG4gIC8vIGluIGNhc2UgcnVudGltZS5qcyBhY2NpZGVudGFsbHkgcnVucyBpbiBzdHJpY3QgbW9kZSwgd2UgY2FuIGVzY2FwZVxuICAvLyBzdHJpY3QgbW9kZSB1c2luZyBhIGdsb2JhbCBGdW5jdGlvbiBjYWxsLiBUaGlzIGNvdWxkIGNvbmNlaXZhYmx5IGZhaWxcbiAgLy8gaWYgYSBDb250ZW50IFNlY3VyaXR5IFBvbGljeSBmb3JiaWRzIHVzaW5nIEZ1bmN0aW9uLCBidXQgaW4gdGhhdCBjYXNlXG4gIC8vIHRoZSBwcm9wZXIgc29sdXRpb24gaXMgdG8gZml4IHRoZSBhY2NpZGVudGFsIHN0cmljdCBtb2RlIHByb2JsZW0uIElmXG4gIC8vIHlvdSd2ZSBtaXNjb25maWd1cmVkIHlvdXIgYnVuZGxlciB0byBmb3JjZSBzdHJpY3QgbW9kZSBhbmQgYXBwbGllZCBhXG4gIC8vIENTUCB0byBmb3JiaWQgRnVuY3Rpb24sIGFuZCB5b3UncmUgbm90IHdpbGxpbmcgdG8gZml4IGVpdGhlciBvZiB0aG9zZVxuICAvLyBwcm9ibGVtcywgcGxlYXNlIGRldGFpbCB5b3VyIHVuaXF1ZSBwcmVkaWNhbWVudCBpbiBhIEdpdEh1YiBpc3N1ZS5cbiAgRnVuY3Rpb24oXCJyXCIsIFwicmVnZW5lcmF0b3JSdW50aW1lID0gclwiKShydW50aW1lKTtcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obW9kdWxlKSB7XG5cdGlmICghbW9kdWxlLndlYnBhY2tQb2x5ZmlsbCkge1xuXHRcdG1vZHVsZS5kZXByZWNhdGUgPSBmdW5jdGlvbigpIHt9O1xuXHRcdG1vZHVsZS5wYXRocyA9IFtdO1xuXHRcdC8vIG1vZHVsZS5wYXJlbnQgPSB1bmRlZmluZWQgYnkgZGVmYXVsdFxuXHRcdGlmICghbW9kdWxlLmNoaWxkcmVuKSBtb2R1bGUuY2hpbGRyZW4gPSBbXTtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobW9kdWxlLCBcImxvYWRlZFwiLCB7XG5cdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIG1vZHVsZS5sO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShtb2R1bGUsIFwiaWRcIiwge1xuXHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiBtb2R1bGUuaTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRtb2R1bGUud2VicGFja1BvbHlmaWxsID0gMTtcblx0fVxuXHRyZXR1cm4gbW9kdWxlO1xufTtcbiIsIi8qIGVzbGludC1kaXNhYmxlICovXHJcbihmdW5jdGlvbiAoRWxlbWVudFByb3RvKSB7XHJcbiAgICBpZiAodHlwZW9mIEVsZW1lbnRQcm90by5tYXRjaGVzICE9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgRWxlbWVudFByb3RvLm1hdGNoZXMgPVxyXG4gICAgICAgICAgICBFbGVtZW50UHJvdG8ubXNNYXRjaGVzU2VsZWN0b3IgfHxcclxuICAgICAgICAgICAgRWxlbWVudFByb3RvLm1vek1hdGNoZXNTZWxlY3RvciB8fFxyXG4gICAgICAgICAgICBFbGVtZW50UHJvdG8ud2Via2l0TWF0Y2hlc1NlbGVjdG9yIHx8XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIG1hdGNoZXMoc2VsZWN0b3IpIHtcclxuICAgICAgICAgICAgICAgIHZhciBlbGVtZW50ID0gdGhpcztcclxuICAgICAgICAgICAgICAgIHZhciBlbGVtZW50cyA9IChlbGVtZW50LmRvY3VtZW50IHx8IGVsZW1lbnQub3duZXJEb2N1bWVudCkucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSAwO1xyXG5cclxuICAgICAgICAgICAgICAgIHdoaWxlIChlbGVtZW50c1tpbmRleF0gJiYgZWxlbWVudHNbaW5kZXhdICE9PSBlbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgKytpbmRleDtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gQm9vbGVhbihlbGVtZW50c1tpbmRleF0pO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0eXBlb2YgRWxlbWVudFByb3RvLmNsb3Nlc3QgIT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICBFbGVtZW50UHJvdG8uY2xvc2VzdCA9IGZ1bmN0aW9uIGNsb3Nlc3Qoc2VsZWN0b3IpIHtcclxuICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSB0aGlzO1xyXG5cclxuICAgICAgICAgICAgd2hpbGUgKGVsZW1lbnQgJiYgZWxlbWVudC5ub2RlVHlwZSA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQubWF0Y2hlcyhzZWxlY3RvcikpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudDtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnROb2RlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59KSh3aW5kb3cuRWxlbWVudCA/IHdpbmRvdy5FbGVtZW50LnByb3RvdHlwZSA6IHdpbmRvdy5IVE1MRWxlbWVudC5wcm90b3R5cGUpO1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciByb290RWxlbWVudCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCB8fCBkb2N1bWVudC5ib2R5O1xyXG5cclxuICAgIHZhciB4SHR0cFJlcXVlc3RGdW5jID0gZnVuY3Rpb24gKHJlcXVlc3RUeXBlLCB1cmwsIGNtX2Zvcm0pIHtcclxuICAgICAgICB2YXIgY21fZW1haWxfaW5wdXQgPSBjbV9mb3JtLnF1ZXJ5U2VsZWN0b3IoJy5qcy1jbS1lbWFpbC1pbnB1dCcpO1xyXG4gICAgICAgIHZhciBkYXRhID0gJ2VtYWlsPScgKyBlbmNvZGVVUklDb21wb25lbnQoY21fZW1haWxfaW5wdXQudmFsdWUpICsgJyZkYXRhPScgKyBlbmNvZGVVUklDb21wb25lbnQoY21fZm9ybS5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWQnKSk7XHJcblxyXG4gICAgICAgIHZhciB4aHR0cCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG5cclxuICAgICAgICB4aHR0cC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnJlYWR5U3RhdGUgPT09IDQgJiYgdGhpcy5zdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgY21fZm9ybS5hY3Rpb24gPSB0aGlzLnJlc3BvbnNlVGV4dDtcclxuICAgICAgICAgICAgICAgIGNtX2Zvcm0uc3VibWl0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB4aHR0cC5vcGVuKHJlcXVlc3RUeXBlLCB1cmwsIHRydWUpO1xyXG4gICAgICAgIHhodHRwLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtdHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKTtcclxuICAgICAgICB4aHR0cC5zZW5kKGRhdGEpO1xyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgZXZlbnRDYWxsYmFjayA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgdmFyIHRhcmdldCA9IGUudGFyZ2V0O1xyXG4gICAgICAgIHZhciBjbV9mb3JtID0gdGFyZ2V0LmNsb3Nlc3QoJy5qcy1jbS1mb3JtJyk7XHJcblxyXG4gICAgICAgIGlmICghY21fZm9ybSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0ID8gZS5wcmV2ZW50RGVmYXVsdCgpIDogKGUucmV0dXJuVmFsdWUgPSBmYWxzZSk7XHJcbiAgICAgICAgeEh0dHBSZXF1ZXN0RnVuYygnUE9TVCcsICd7c2NoZW1lQW5kRG9tYWlufS90L2dldHNlY3VyZXN1YnNjcmliZWxpbmsnLCBjbV9mb3JtKTtcclxuICAgIH07XHJcblxyXG4gICAgZnVuY3Rpb24gcmVnaXN0ZXJIYW5kbGVyKHRhcmdldCwgdHlwZSwgY2FsbGJhY2spIHtcclxuICAgICAgICBpZiAodGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIpIHtcclxuICAgICAgICAgICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgY2FsbGJhY2spO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRhcmdldC5hdHRhY2hFdmVudCgnb24nICsgdHlwZSwgY2FsbGJhY2spO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXJvb3RFbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1jbS1ob29rJykpIHtcclxuICAgICAgICByZWdpc3RlckhhbmRsZXIocm9vdEVsZW1lbnQsICdzdWJtaXQnLCBldmVudENhbGxiYWNrKTtcclxuICAgICAgICByb290RWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2RhdGEtY20taG9vaycsICcxJyk7XHJcbiAgICB9XHJcbn0pKCk7XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIG1vYmlsZU51bWJlckZpZWxkID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoJ2NtLW1vYmlsZS1udW1iZXInKVswXTtcclxuICAgIHZhciBtb2JpbGVOdW1iZXJDb3VudHJ5RmllbGQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5TmFtZSgnY20tbW9iaWxlLW51bWJlci1jb3VudHJ5JylbMF07XHJcbiAgICB2YXIgc21zTWFya2V0aW5nQ29uc2VudENoZWNrID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoJ2NtLXNtcy1tYXJrZXRpbmctY29uc2VudCcpWzBdO1xyXG4gICAgdmFyIHNtc01hcmtldGluZ0NvbnNlbnRSZXF1aXJlZExhYmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NtLXNtcy1tYXJrZXRpbmctY29uc2VudC1yZXF1aXJlZC1sYWJlbCcpO1xyXG4gICAgdmFyIHByZXZpb3VzVmFsdWUgPSAnJztcclxuICAgIHZhciBpc0RlbGV0ZUtleURvd24gPSBmYWxzZTtcclxuICAgIGlmICghbW9iaWxlTnVtYmVyRmllbGQgfHwgIW1vYmlsZU51bWJlckNvdW50cnlGaWVsZCB8fCAhc21zTWFya2V0aW5nQ29uc2VudENoZWNrKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBtb2JpbGVJbnB1dENvdW50cnlOYW1lID0ge1xyXG4gICAgICAgIFVuaXRlZFN0YXRlc09mQW1lcmljYTogJ1VuaXRlZCBTdGF0ZXMgb2YgQW1lcmljYScsXHJcbiAgICAgICAgQ2FuYWRhOiAnQ2FuYWRhJyxcclxuICAgICAgICBBdXN0cmFsaWE6ICdBdXN0cmFsaWEnLFxyXG4gICAgICAgIFVuaXRlZEtpbmdkb206ICdVbml0ZWQgS2luZ2RvbScsXHJcbiAgICB9O1xyXG5cclxuICAgIHZhciBnZXRNb2JpbGVJbnB1dFByb3BzQnlDb3VudHJ5ID0gZnVuY3Rpb24gKGNvdW50cnkpIHtcclxuICAgICAgICBzd2l0Y2ggKGNvdW50cnkpIHtcclxuICAgICAgICAgICAgY2FzZSBtb2JpbGVJbnB1dENvdW50cnlOYW1lLkF1c3RyYWxpYTpcclxuICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9ybWF0dGVyOiBmdW5jdGlvbiBmb3JtYXR0ZXIoaW5wdXQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5ld1ZhbHVlID0gaW5wdXQucmVwbGFjZSgvXFxEL2csICcnKS5tYXRjaCgvKFxcZHswLDR9KShcXGR7MCwzfSkoXFxkezAsM30pLykgfHwgW107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXdWYWx1ZVsxXSArIChuZXdWYWx1ZVsyXSA/ICcgJyArIG5ld1ZhbHVlWzJdIDogJycpICsgKG5ld1ZhbHVlWzNdID8gJyAnICsgbmV3VmFsdWVbM10gOiAnJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcjogJ0UuZy4gMDQ5MSA1NzAgMDA2JyxcclxuICAgICAgICAgICAgICAgICAgICBwYXR0ZXJuOiAnWzAtOV17NH0gWzAtOV17M30gWzAtOV17M30nLFxyXG4gICAgICAgICAgICAgICAgICAgIG1heExlbmd0aE9mTW9iaWxlTnVtYmVyV2l0aG91dFNlcGFyYXRvcnM6IDEwLFxyXG4gICAgICAgICAgICAgICAgICAgIGluZGljZXNPZlNlcGFyYXRvckluRGlnaXRzT25seU1vYmlsZU51bWJlcjogWzQsIDddLFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgY2FzZSBtb2JpbGVJbnB1dENvdW50cnlOYW1lLlVuaXRlZEtpbmdkb206XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvcm1hdHRlcjogZnVuY3Rpb24gZm9ybWF0dGVyKGlucHV0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXdWYWx1ZSA9IGlucHV0LnJlcGxhY2UoL1xcRC9nLCAnJykubWF0Y2goLyhcXGR7MCwzfSkoXFxkezAsNH0pKFxcZHswLDR9KS8pIHx8IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3VmFsdWVbMV0gKyAobmV3VmFsdWVbMl0gPyAnICcgKyBuZXdWYWx1ZVsyXSA6ICcnKSArIChuZXdWYWx1ZVszXSA/ICcgJyArIG5ld1ZhbHVlWzNdIDogJycpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI6ICdFLmcuIDA3NyAwMDkwIDAwMDAnLFxyXG4gICAgICAgICAgICAgICAgICAgIHBhdHRlcm46ICdbMC05XXszfSBbMC05XXs0fSBbMC05XXs0fScsXHJcbiAgICAgICAgICAgICAgICAgICAgbWF4TGVuZ3RoT2ZNb2JpbGVOdW1iZXJXaXRob3V0U2VwYXJhdG9yczogMTEsXHJcbiAgICAgICAgICAgICAgICAgICAgaW5kaWNlc09mU2VwYXJhdG9ySW5EaWdpdHNPbmx5TW9iaWxlTnVtYmVyOiBbMywgN10sXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBjYXNlIG1vYmlsZUlucHV0Q291bnRyeU5hbWUuQ2FuYWRhOlxyXG4gICAgICAgICAgICBjYXNlIG1vYmlsZUlucHV0Q291bnRyeU5hbWUuVW5pdGVkU3RhdGVzT2ZBbWVyaWNhOlxyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3JtYXR0ZXI6IGZ1bmN0aW9uIGZvcm1hdHRlcihpbnB1dCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmV3VmFsdWUgPSBpbnB1dC5yZXBsYWNlKC9cXEQvZywgJycpLm1hdGNoKC8oXFxkezAsM30pKFxcZHswLDN9KShcXGR7MCw0fSkvKSB8fCBbXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ld1ZhbHVlWzFdICsgKG5ld1ZhbHVlWzJdID8gJy0nICsgbmV3VmFsdWVbMl0gOiAnJykgKyAobmV3VmFsdWVbM10gPyAnLScgKyBuZXdWYWx1ZVszXSA6ICcnKTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyOiAnRS5nLiAxMjMtNDU2LTc4OTAnLFxyXG4gICAgICAgICAgICAgICAgICAgIHBhdHRlcm46ICdbMC05XXszfS1bMC05XXszfS1bMC05XXs0fScsXHJcbiAgICAgICAgICAgICAgICAgICAgbWF4TGVuZ3RoT2ZNb2JpbGVOdW1iZXJXaXRob3V0U2VwYXJhdG9yczogMTAsXHJcbiAgICAgICAgICAgICAgICAgICAgaW5kaWNlc09mU2VwYXJhdG9ySW5EaWdpdHNPbmx5TW9iaWxlTnVtYmVyOiBbMywgNl0sXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgdmFyIHVwZGF0ZU1vYmlsZUlucHV0QXR0cmlidXRlcyA9IGZ1bmN0aW9uIChjb3VudHJ5KSB7XHJcbiAgICAgICAgdmFyIG1vYmlsZUlucHV0UHJvcHMgPSBnZXRNb2JpbGVJbnB1dFByb3BzQnlDb3VudHJ5KGNvdW50cnkpO1xyXG4gICAgICAgIHZhciBwbGFjZWhvbGRlciA9IG1vYmlsZUlucHV0UHJvcHMucGxhY2Vob2xkZXI7XHJcbiAgICAgICAgdmFyIHBhdHRlcm4gPSBtb2JpbGVJbnB1dFByb3BzLnBhdHRlcm47XHJcblxyXG4gICAgICAgIG1vYmlsZU51bWJlckZpZWxkLnZhbHVlID0gJyc7XHJcbiAgICAgICAgbW9iaWxlTnVtYmVyRmllbGQucGxhY2Vob2xkZXIgPSBwbGFjZWhvbGRlcjtcclxuICAgICAgICBtb2JpbGVOdW1iZXJGaWVsZC5wYXR0ZXJuID0gcGF0dGVybjtcclxuICAgIH07XHJcblxyXG4gICAgdmFyIHVwZGF0ZVNtc01hcmtldGluZ0NvbnNlbnRDaGVja1JlcXVpcmVkID0gZnVuY3Rpb24gKHN0YXRlKSB7XHJcbiAgICAgICAgaWYgKHN0YXRlKSB7XHJcbiAgICAgICAgICAgIHNtc01hcmtldGluZ0NvbnNlbnRDaGVjay5zZXRBdHRyaWJ1dGUoJ3JlcXVpcmVkJywgJycpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHNtc01hcmtldGluZ0NvbnNlbnRDaGVjay5yZW1vdmVBdHRyaWJ1dGUoJ3JlcXVpcmVkJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoc21zTWFya2V0aW5nQ29uc2VudFJlcXVpcmVkTGFiZWwpIHtcclxuICAgICAgICAgICAgaWYgKHN0YXRlKSB7XHJcbiAgICAgICAgICAgICAgICBzbXNNYXJrZXRpbmdDb25zZW50UmVxdWlyZWRMYWJlbC5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgc21zTWFya2V0aW5nQ29uc2VudFJlcXVpcmVkTGFiZWwuc2V0QXR0cmlidXRlKCdoaWRkZW4nLCAnJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHZhciBmaW5kQWxsTm9uRGlnaXRJbmRpY2VzID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgdmFyIG5vbkRpZ2l0UmVnZXggPSAvXFxEL2c7XHJcbiAgICAgICAgdmFyIG5vbkRpZ2l0SW5kaWNlcyA9IFtdO1xyXG4gICAgICAgIHZhciBtYXRjaDtcclxuICAgICAgICB3aGlsZSAoKG1hdGNoID0gbm9uRGlnaXRSZWdleC5leGVjKHZhbHVlKSkgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgbm9uRGlnaXRJbmRpY2VzLnB1c2gobWF0Y2guaW5kZXgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG5vbkRpZ2l0SW5kaWNlcztcclxuICAgIH07XHJcblxyXG4gICAgdmFyIG1vYmlsZU51bWJlckZpZWxkQ2hhbmdlSGFuZGxlciA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgIC8vIEhhbmRsZSBpZTExIG1pc2ZpcmluZyBpbnB1dCBldmVudHMgd2hlbiB0aGVyZSBpcyBubyBjaGFuZ2VcclxuICAgICAgICBpZiAocHJldmlvdXNWYWx1ZSA9PT0gZXZlbnQuY3VycmVudFRhcmdldC52YWx1ZSB8fCAoIXByZXZpb3VzVmFsdWUgJiYgZXZlbnQuY3VycmVudFRhcmdldC52YWx1ZSA9PT0gJycpKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBjb3VudHJ5ID0gbW9iaWxlTnVtYmVyQ291bnRyeUZpZWxkLnZhbHVlO1xyXG4gICAgICAgIHZhciBtb2JpbGVJbnB1dFByb3BzID0gZ2V0TW9iaWxlSW5wdXRQcm9wc0J5Q291bnRyeShjb3VudHJ5KTtcclxuICAgICAgICB2YXIgZm9ybWF0dGVyID0gbW9iaWxlSW5wdXRQcm9wcy5mb3JtYXR0ZXI7XHJcbiAgICAgICAgdmFyIG1heExlbmd0aE9mTW9iaWxlTnVtYmVyV2l0aG91dFNlcGFyYXRvcnMgPSBtb2JpbGVJbnB1dFByb3BzLm1heExlbmd0aE9mTW9iaWxlTnVtYmVyV2l0aG91dFNlcGFyYXRvcnM7XHJcbiAgICAgICAgdmFyIGluZGljZXNPZlNlcGFyYXRvckluRGlnaXRzT25seU1vYmlsZU51bWJlciA9IG1vYmlsZUlucHV0UHJvcHMuaW5kaWNlc09mU2VwYXJhdG9ySW5EaWdpdHNPbmx5TW9iaWxlTnVtYmVyO1xyXG5cclxuICAgICAgICB2YXIgY3Vyc29yTG9jYXRpb24gPSBldmVudC5jdXJyZW50VGFyZ2V0LnNlbGVjdGlvbkVuZCB8fCAwO1xyXG4gICAgICAgIHZhciBub25EaWdpdEluZGljZXMgPSBmaW5kQWxsTm9uRGlnaXRJbmRpY2VzKGV2ZW50LmN1cnJlbnRUYXJnZXQudmFsdWUpO1xyXG4gICAgICAgIHZhciBsZW5ndGhPZkRpZ2l0c09ubHlWYWx1ZSA9IGV2ZW50LmN1cnJlbnRUYXJnZXQudmFsdWUubGVuZ3RoIC0gbm9uRGlnaXRJbmRpY2VzLmxlbmd0aDtcclxuICAgICAgICBpZiAobGVuZ3RoT2ZEaWdpdHNPbmx5VmFsdWUgPiBtYXhMZW5ndGhPZk1vYmlsZU51bWJlcldpdGhvdXRTZXBhcmF0b3JzKSB7XHJcbiAgICAgICAgICAgIC8vIGRvIG5vdCBhbGxvdyB1cGRhdGUgb25jZSBhbnkgZWRpdHMgZmlsbCB0aGUgc3RyaW5nIGFuZCBrZWVwIHRoZSBjdXJzb3Igd2hlcmUgaXQgaXMuXHJcbiAgICAgICAgICAgIHZhciBpbmNyZWFzZUluQ2hhcmFjdGVycyA9IGV2ZW50LmN1cnJlbnRUYXJnZXQudmFsdWUubGVuZ3RoIC0gcHJldmlvdXNWYWx1ZS5sZW5ndGg7XHJcbiAgICAgICAgICAgIGV2ZW50LmN1cnJlbnRUYXJnZXQudmFsdWUgPSBwcmV2aW91c1ZhbHVlO1xyXG4gICAgICAgICAgICBldmVudC5jdXJyZW50VGFyZ2V0LnNldFNlbGVjdGlvblJhbmdlKGN1cnNvckxvY2F0aW9uIC0gaW5jcmVhc2VJbkNoYXJhY3RlcnMsIGN1cnNvckxvY2F0aW9uIC0gaW5jcmVhc2VJbkNoYXJhY3RlcnMpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciBjdXJzb3JMb2NhdGlvbkluRGlnaXRPbmx5VmFsdWUgPVxyXG4gICAgICAgICAgICAgICAgY3Vyc29yTG9jYXRpb24gLVxyXG4gICAgICAgICAgICAgICAgbm9uRGlnaXRJbmRpY2VzLmZpbHRlcihmdW5jdGlvbiAobm9uRGlnaXRJbmRleCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBub25EaWdpdEluZGV4IDwgY3Vyc29yTG9jYXRpb247XHJcbiAgICAgICAgICAgICAgICB9KS5sZW5ndGg7XHJcbiAgICAgICAgICAgIHZhciBmb3JtYXR0ZXJBZGRlZFNlcGFyYXRvcnNCZWZvcmVDdXJzb3JMb2NhdGlvbiA9IGluZGljZXNPZlNlcGFyYXRvckluRGlnaXRzT25seU1vYmlsZU51bWJlci5maWx0ZXIoZnVuY3Rpb24gKHNlcGFyYXRvckluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VwYXJhdG9ySW5kZXggPCBjdXJzb3JMb2NhdGlvbkluRGlnaXRPbmx5VmFsdWU7XHJcbiAgICAgICAgICAgIH0pLmxlbmd0aDtcclxuICAgICAgICAgICAgaWYgKGlzRGVsZXRlS2V5RG93bikge1xyXG4gICAgICAgICAgICAgICAgLy8gcGxhY2UgY3Vyc29yIGFmdGVyIHNlcGFyYXRvcnNcclxuICAgICAgICAgICAgICAgIGZvcm1hdHRlckFkZGVkU2VwYXJhdG9yc0JlZm9yZUN1cnNvckxvY2F0aW9uID0gaW5kaWNlc09mU2VwYXJhdG9ySW5EaWdpdHNPbmx5TW9iaWxlTnVtYmVyLmZpbHRlcihmdW5jdGlvbiAoc2VwYXJhdG9ySW5kZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VwYXJhdG9ySW5kZXggPD0gY3Vyc29yTG9jYXRpb25JbkRpZ2l0T25seVZhbHVlO1xyXG4gICAgICAgICAgICAgICAgfSkubGVuZ3RoO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBuZXdDdXJzb3JMb2NhdGlvbiA9IGN1cnNvckxvY2F0aW9uSW5EaWdpdE9ubHlWYWx1ZSArIGZvcm1hdHRlckFkZGVkU2VwYXJhdG9yc0JlZm9yZUN1cnNvckxvY2F0aW9uO1xyXG4gICAgICAgICAgICB2YXIgZm9ybWF0dGVkVmFsdWUgPSAoZXZlbnQuY3VycmVudFRhcmdldC52YWx1ZSA9IGZvcm1hdHRlcihldmVudC5jdXJyZW50VGFyZ2V0LnZhbHVlKSk7XHJcblxyXG4gICAgICAgICAgICBldmVudC5jdXJyZW50VGFyZ2V0LnNldFNlbGVjdGlvblJhbmdlKG5ld0N1cnNvckxvY2F0aW9uLCBuZXdDdXJzb3JMb2NhdGlvbik7XHJcbiAgICAgICAgICAgIHByZXZpb3VzVmFsdWUgPSBldmVudC5jdXJyZW50VGFyZ2V0LnZhbHVlO1xyXG4gICAgICAgICAgICBldmVudC5jdXJyZW50VGFyZ2V0LnZhbHVlID0gZm9ybWF0dGVkVmFsdWU7XHJcbiAgICAgICAgICAgIHVwZGF0ZVNtc01hcmtldGluZ0NvbnNlbnRDaGVja1JlcXVpcmVkKEJvb2xlYW4oZm9ybWF0dGVkVmFsdWUpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByZXZpb3VzVmFsdWUgPSBldmVudC5jdXJyZW50VGFyZ2V0LnZhbHVlO1xyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgbW9iaWxlTnVtYmVyQ291bnRyeUZpZWxkQ2hhbmdlSGFuZGxlciA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgIHVwZGF0ZU1vYmlsZUlucHV0QXR0cmlidXRlcyhldmVudC5jdXJyZW50VGFyZ2V0LnZhbHVlKTtcclxuICAgIH07XHJcblxyXG4gICAgdmFyIG9uS2V5RG93bkV2ZW50SGFuZGxlciA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgIGlzRGVsZXRlS2V5RG93biA9IGV2ZW50LmtleSA9PT0gJ0RlbGV0ZScgfHwgZXZlbnQua2V5Q29kZSA9PT0gNDY7XHJcbiAgICB9O1xyXG5cclxuICAgIHZhciBvbktleVVwRXZlbnRIYW5kbGVyID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgaXNEZWxldGVLZXlEb3duID0gZmFsc2U7XHJcbiAgICB9O1xyXG5cclxuICAgIHVwZGF0ZU1vYmlsZUlucHV0QXR0cmlidXRlcyhtb2JpbGVOdW1iZXJDb3VudHJ5RmllbGQudmFsdWUpO1xyXG4gICAgbW9iaWxlTnVtYmVyRmllbGQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBtb2JpbGVOdW1iZXJGaWVsZENoYW5nZUhhbmRsZXIpO1xyXG4gICAgbW9iaWxlTnVtYmVyRmllbGQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9uS2V5RG93bkV2ZW50SGFuZGxlcik7XHJcbiAgICBtb2JpbGVOdW1iZXJGaWVsZC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIG9uS2V5VXBFdmVudEhhbmRsZXIpO1xyXG4gICAgbW9iaWxlTnVtYmVyQ291bnRyeUZpZWxkLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIG1vYmlsZU51bWJlckNvdW50cnlGaWVsZENoYW5nZUhhbmRsZXIpO1xyXG59KSgpO1xyXG4iXSwic291cmNlUm9vdCI6IiJ9