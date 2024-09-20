/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/binary";
exports.ids = ["vendor-chunks/binary"];
exports.modules = {

/***/ "(ssr)/./node_modules/binary/index.js":
/*!**************************************!*\
  !*** ./node_modules/binary/index.js ***!
  \**************************************/
/***/ ((module, exports, __webpack_require__) => {

eval("var Chainsaw = __webpack_require__(/*! chainsaw */ \"(ssr)/./node_modules/chainsaw/index.js\");\nvar EventEmitter = (__webpack_require__(/*! events */ \"events\").EventEmitter);\nvar Buffers = __webpack_require__(/*! buffers */ \"(ssr)/./node_modules/buffers/index.js\");\nvar Vars = __webpack_require__(/*! ./lib/vars.js */ \"(ssr)/./node_modules/binary/lib/vars.js\");\nvar Stream = (__webpack_require__(/*! stream */ \"stream\").Stream);\n\nexports = module.exports = function (bufOrEm, eventName) {\n    if (Buffer.isBuffer(bufOrEm)) {\n        return exports.parse(bufOrEm);\n    }\n    \n    var s = exports.stream();\n    if (bufOrEm && bufOrEm.pipe) {\n        bufOrEm.pipe(s);\n    }\n    else if (bufOrEm) {\n        bufOrEm.on(eventName || 'data', function (buf) {\n            s.write(buf);\n        });\n        \n        bufOrEm.on('end', function () {\n            s.end();\n        });\n    }\n    return s;\n};\n\nexports.stream = function (input) {\n    if (input) return exports.apply(null, arguments);\n    \n    var pending = null;\n    function getBytes (bytes, cb, skip) {\n        pending = {\n            bytes : bytes,\n            skip : skip,\n            cb : function (buf) {\n                pending = null;\n                cb(buf);\n            },\n        };\n        dispatch();\n    }\n    \n    var offset = null;\n    function dispatch () {\n        if (!pending) {\n            if (caughtEnd) done = true;\n            return;\n        }\n        if (typeof pending === 'function') {\n            pending();\n        }\n        else {\n            var bytes = offset + pending.bytes;\n            \n            if (buffers.length >= bytes) {\n                var buf;\n                if (offset == null) {\n                    buf = buffers.splice(0, bytes);\n                    if (!pending.skip) {\n                        buf = buf.slice();\n                    }\n                }\n                else {\n                    if (!pending.skip) {\n                        buf = buffers.slice(offset, bytes);\n                    }\n                    offset = bytes;\n                }\n                \n                if (pending.skip) {\n                    pending.cb();\n                }\n                else {\n                    pending.cb(buf);\n                }\n            }\n        }\n    }\n    \n    function builder (saw) {\n        function next () { if (!done) saw.next() }\n        \n        var self = words(function (bytes, cb) {\n            return function (name) {\n                getBytes(bytes, function (buf) {\n                    vars.set(name, cb(buf));\n                    next();\n                });\n            };\n        });\n        \n        self.tap = function (cb) {\n            saw.nest(cb, vars.store);\n        };\n        \n        self.into = function (key, cb) {\n            if (!vars.get(key)) vars.set(key, {});\n            var parent = vars;\n            vars = Vars(parent.get(key));\n            \n            saw.nest(function () {\n                cb.apply(this, arguments);\n                this.tap(function () {\n                    vars = parent;\n                });\n            }, vars.store);\n        };\n        \n        self.flush = function () {\n            vars.store = {};\n            next();\n        };\n        \n        self.loop = function (cb) {\n            var end = false;\n            \n            saw.nest(false, function loop () {\n                this.vars = vars.store;\n                cb.call(this, function () {\n                    end = true;\n                    next();\n                }, vars.store);\n                this.tap(function () {\n                    if (end) saw.next()\n                    else loop.call(this)\n                }.bind(this));\n            }, vars.store);\n        };\n        \n        self.buffer = function (name, bytes) {\n            if (typeof bytes === 'string') {\n                bytes = vars.get(bytes);\n            }\n            \n            getBytes(bytes, function (buf) {\n                vars.set(name, buf);\n                next();\n            });\n        };\n        \n        self.skip = function (bytes) {\n            if (typeof bytes === 'string') {\n                bytes = vars.get(bytes);\n            }\n            \n            getBytes(bytes, function () {\n                next();\n            });\n        };\n        \n        self.scan = function find (name, search) {\n            if (typeof search === 'string') {\n                search = new Buffer(search);\n            }\n            else if (!Buffer.isBuffer(search)) {\n                throw new Error('search must be a Buffer or a string');\n            }\n            \n            var taken = 0;\n            pending = function () {\n                var pos = buffers.indexOf(search, offset + taken);\n                var i = pos-offset-taken;\n                if (pos !== -1) {\n                    pending = null;\n                    if (offset != null) {\n                        vars.set(\n                            name,\n                            buffers.slice(offset, offset + taken + i)\n                        );\n                        offset += taken + i + search.length;\n                    }\n                    else {\n                        vars.set(\n                            name,\n                            buffers.slice(0, taken + i)\n                        );\n                        buffers.splice(0, taken + i + search.length);\n                    }\n                    next();\n                    dispatch();\n                } else {\n                    i = Math.max(buffers.length - search.length - offset - taken, 0);\n\t\t\t\t}\n                taken += i;\n            };\n            dispatch();\n        };\n        \n        self.peek = function (cb) {\n            offset = 0;\n            saw.nest(function () {\n                cb.call(this, vars.store);\n                this.tap(function () {\n                    offset = null;\n                });\n            });\n        };\n        \n        return self;\n    };\n    \n    var stream = Chainsaw.light(builder);\n    stream.writable = true;\n    \n    var buffers = Buffers();\n    \n    stream.write = function (buf) {\n        buffers.push(buf);\n        dispatch();\n    };\n    \n    var vars = Vars();\n    \n    var done = false, caughtEnd = false;\n    stream.end = function () {\n        caughtEnd = true;\n    };\n    \n    stream.pipe = Stream.prototype.pipe;\n    Object.getOwnPropertyNames(EventEmitter.prototype).forEach(function (name) {\n        stream[name] = EventEmitter.prototype[name];\n    });\n    \n    return stream;\n};\n\nexports.parse = function parse (buffer) {\n    var self = words(function (bytes, cb) {\n        return function (name) {\n            if (offset + bytes <= buffer.length) {\n                var buf = buffer.slice(offset, offset + bytes);\n                offset += bytes;\n                vars.set(name, cb(buf));\n            }\n            else {\n                vars.set(name, null);\n            }\n            return self;\n        };\n    });\n    \n    var offset = 0;\n    var vars = Vars();\n    self.vars = vars.store;\n    \n    self.tap = function (cb) {\n        cb.call(self, vars.store);\n        return self;\n    };\n    \n    self.into = function (key, cb) {\n        if (!vars.get(key)) {\n            vars.set(key, {});\n        }\n        var parent = vars;\n        vars = Vars(parent.get(key));\n        cb.call(self, vars.store);\n        vars = parent;\n        return self;\n    };\n    \n    self.loop = function (cb) {\n        var end = false;\n        var ender = function () { end = true };\n        while (end === false) {\n            cb.call(self, ender, vars.store);\n        }\n        return self;\n    };\n    \n    self.buffer = function (name, size) {\n        if (typeof size === 'string') {\n            size = vars.get(size);\n        }\n        var buf = buffer.slice(offset, Math.min(buffer.length, offset + size));\n        offset += size;\n        vars.set(name, buf);\n        \n        return self;\n    };\n    \n    self.skip = function (bytes) {\n        if (typeof bytes === 'string') {\n            bytes = vars.get(bytes);\n        }\n        offset += bytes;\n        \n        return self;\n    };\n    \n    self.scan = function (name, search) {\n        if (typeof search === 'string') {\n            search = new Buffer(search);\n        }\n        else if (!Buffer.isBuffer(search)) {\n            throw new Error('search must be a Buffer or a string');\n        }\n        vars.set(name, null);\n        \n        // simple but slow string search\n        for (var i = 0; i + offset <= buffer.length - search.length + 1; i++) {\n            for (\n                var j = 0;\n                j < search.length && buffer[offset+i+j] === search[j];\n                j++\n            );\n            if (j === search.length) break;\n        }\n        \n        vars.set(name, buffer.slice(offset, offset + i));\n        offset += i + search.length;\n        return self;\n    };\n    \n    self.peek = function (cb) {\n        var was = offset;\n        cb.call(self, vars.store);\n        offset = was;\n        return self;\n    };\n    \n    self.flush = function () {\n        vars.store = {};\n        return self;\n    };\n    \n    self.eof = function () {\n        return offset >= buffer.length;\n    };\n    \n    return self;\n};\n\n// convert byte strings to unsigned little endian numbers\nfunction decodeLEu (bytes) {\n    var acc = 0;\n    for (var i = 0; i < bytes.length; i++) {\n        acc += Math.pow(256,i) * bytes[i];\n    }\n    return acc;\n}\n\n// convert byte strings to unsigned big endian numbers\nfunction decodeBEu (bytes) {\n    var acc = 0;\n    for (var i = 0; i < bytes.length; i++) {\n        acc += Math.pow(256, bytes.length - i - 1) * bytes[i];\n    }\n    return acc;\n}\n\n// convert byte strings to signed big endian numbers\nfunction decodeBEs (bytes) {\n    var val = decodeBEu(bytes);\n    if ((bytes[0] & 0x80) == 0x80) {\n        val -= Math.pow(256, bytes.length);\n    }\n    return val;\n}\n\n// convert byte strings to signed little endian numbers\nfunction decodeLEs (bytes) {\n    var val = decodeLEu(bytes);\n    if ((bytes[bytes.length - 1] & 0x80) == 0x80) {\n        val -= Math.pow(256, bytes.length);\n    }\n    return val;\n}\n\nfunction words (decode) {\n    var self = {};\n    \n    [ 1, 2, 4, 8 ].forEach(function (bytes) {\n        var bits = bytes * 8;\n        \n        self['word' + bits + 'le']\n        = self['word' + bits + 'lu']\n        = decode(bytes, decodeLEu);\n        \n        self['word' + bits + 'ls']\n        = decode(bytes, decodeLEs);\n        \n        self['word' + bits + 'be']\n        = self['word' + bits + 'bu']\n        = decode(bytes, decodeBEu);\n        \n        self['word' + bits + 'bs']\n        = decode(bytes, decodeBEs);\n    });\n    \n    // word8be(n) == word8le(n) for all n\n    self.word8 = self.word8u = self.word8be;\n    self.word8s = self.word8bs;\n    \n    return self;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvYmluYXJ5L2luZGV4LmpzIiwibWFwcGluZ3MiOiJBQUFBLGVBQWUsbUJBQU8sQ0FBQyx3REFBVTtBQUNqQyxtQkFBbUIsMERBQThCO0FBQ2pELGNBQWMsbUJBQU8sQ0FBQyxzREFBUztBQUMvQixXQUFXLG1CQUFPLENBQUMsOERBQWU7QUFDbEMsYUFBYSxvREFBd0I7O0FBRXJDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkI7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdEQUFnRDtBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQixhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQixhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QjtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsaURBQWlEO0FBQ3pFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixrQkFBa0I7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLGtCQUFrQjtBQUN0QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9teS1uZXh0LWVsZWN0cm9uLWFwcC8uL25vZGVfbW9kdWxlcy9iaW5hcnkvaW5kZXguanM/NzUzYSJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgQ2hhaW5zYXcgPSByZXF1aXJlKCdjaGFpbnNhdycpO1xudmFyIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlcjtcbnZhciBCdWZmZXJzID0gcmVxdWlyZSgnYnVmZmVycycpO1xudmFyIFZhcnMgPSByZXF1aXJlKCcuL2xpYi92YXJzLmpzJyk7XG52YXIgU3RyZWFtID0gcmVxdWlyZSgnc3RyZWFtJykuU3RyZWFtO1xuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYnVmT3JFbSwgZXZlbnROYW1lKSB7XG4gICAgaWYgKEJ1ZmZlci5pc0J1ZmZlcihidWZPckVtKSkge1xuICAgICAgICByZXR1cm4gZXhwb3J0cy5wYXJzZShidWZPckVtKTtcbiAgICB9XG4gICAgXG4gICAgdmFyIHMgPSBleHBvcnRzLnN0cmVhbSgpO1xuICAgIGlmIChidWZPckVtICYmIGJ1Zk9yRW0ucGlwZSkge1xuICAgICAgICBidWZPckVtLnBpcGUocyk7XG4gICAgfVxuICAgIGVsc2UgaWYgKGJ1Zk9yRW0pIHtcbiAgICAgICAgYnVmT3JFbS5vbihldmVudE5hbWUgfHwgJ2RhdGEnLCBmdW5jdGlvbiAoYnVmKSB7XG4gICAgICAgICAgICBzLndyaXRlKGJ1Zik7XG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgYnVmT3JFbS5vbignZW5kJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcy5lbmQoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBzO1xufTtcblxuZXhwb3J0cy5zdHJlYW0gPSBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICBpZiAoaW5wdXQpIHJldHVybiBleHBvcnRzLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gICAgXG4gICAgdmFyIHBlbmRpbmcgPSBudWxsO1xuICAgIGZ1bmN0aW9uIGdldEJ5dGVzIChieXRlcywgY2IsIHNraXApIHtcbiAgICAgICAgcGVuZGluZyA9IHtcbiAgICAgICAgICAgIGJ5dGVzIDogYnl0ZXMsXG4gICAgICAgICAgICBza2lwIDogc2tpcCxcbiAgICAgICAgICAgIGNiIDogZnVuY3Rpb24gKGJ1Zikge1xuICAgICAgICAgICAgICAgIHBlbmRpbmcgPSBudWxsO1xuICAgICAgICAgICAgICAgIGNiKGJ1Zik7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgICAgICBkaXNwYXRjaCgpO1xuICAgIH1cbiAgICBcbiAgICB2YXIgb2Zmc2V0ID0gbnVsbDtcbiAgICBmdW5jdGlvbiBkaXNwYXRjaCAoKSB7XG4gICAgICAgIGlmICghcGVuZGluZykge1xuICAgICAgICAgICAgaWYgKGNhdWdodEVuZCkgZG9uZSA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBwZW5kaW5nID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBwZW5kaW5nKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXIgYnl0ZXMgPSBvZmZzZXQgKyBwZW5kaW5nLmJ5dGVzO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoYnVmZmVycy5sZW5ndGggPj0gYnl0ZXMpIHtcbiAgICAgICAgICAgICAgICB2YXIgYnVmO1xuICAgICAgICAgICAgICAgIGlmIChvZmZzZXQgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBidWYgPSBidWZmZXJzLnNwbGljZSgwLCBieXRlcyk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghcGVuZGluZy5za2lwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBidWYgPSBidWYuc2xpY2UoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFwZW5kaW5nLnNraXApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZiA9IGJ1ZmZlcnMuc2xpY2Uob2Zmc2V0LCBieXRlcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgb2Zmc2V0ID0gYnl0ZXM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIChwZW5kaW5nLnNraXApIHtcbiAgICAgICAgICAgICAgICAgICAgcGVuZGluZy5jYigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcGVuZGluZy5jYihidWYpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBidWlsZGVyIChzYXcpIHtcbiAgICAgICAgZnVuY3Rpb24gbmV4dCAoKSB7IGlmICghZG9uZSkgc2F3Lm5leHQoKSB9XG4gICAgICAgIFxuICAgICAgICB2YXIgc2VsZiA9IHdvcmRzKGZ1bmN0aW9uIChieXRlcywgY2IpIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICAgICAgICAgIGdldEJ5dGVzKGJ5dGVzLCBmdW5jdGlvbiAoYnVmKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhcnMuc2V0KG5hbWUsIGNiKGJ1ZikpO1xuICAgICAgICAgICAgICAgICAgICBuZXh0KCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIHNlbGYudGFwID0gZnVuY3Rpb24gKGNiKSB7XG4gICAgICAgICAgICBzYXcubmVzdChjYiwgdmFycy5zdG9yZSk7XG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICBzZWxmLmludG8gPSBmdW5jdGlvbiAoa2V5LCBjYikge1xuICAgICAgICAgICAgaWYgKCF2YXJzLmdldChrZXkpKSB2YXJzLnNldChrZXksIHt9KTtcbiAgICAgICAgICAgIHZhciBwYXJlbnQgPSB2YXJzO1xuICAgICAgICAgICAgdmFycyA9IFZhcnMocGFyZW50LmdldChrZXkpKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgc2F3Lm5lc3QoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNiLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgdGhpcy50YXAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXJzID0gcGFyZW50O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSwgdmFycy5zdG9yZSk7XG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICBzZWxmLmZsdXNoID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFycy5zdG9yZSA9IHt9O1xuICAgICAgICAgICAgbmV4dCgpO1xuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgc2VsZi5sb29wID0gZnVuY3Rpb24gKGNiKSB7XG4gICAgICAgICAgICB2YXIgZW5kID0gZmFsc2U7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHNhdy5uZXN0KGZhbHNlLCBmdW5jdGlvbiBsb29wICgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnZhcnMgPSB2YXJzLnN0b3JlO1xuICAgICAgICAgICAgICAgIGNiLmNhbGwodGhpcywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBlbmQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBuZXh0KCk7XG4gICAgICAgICAgICAgICAgfSwgdmFycy5zdG9yZSk7XG4gICAgICAgICAgICAgICAgdGhpcy50YXAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZW5kKSBzYXcubmV4dCgpXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgbG9vcC5jYWxsKHRoaXMpXG4gICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIH0sIHZhcnMuc3RvcmUpO1xuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgc2VsZi5idWZmZXIgPSBmdW5jdGlvbiAobmFtZSwgYnl0ZXMpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgYnl0ZXMgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgYnl0ZXMgPSB2YXJzLmdldChieXRlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGdldEJ5dGVzKGJ5dGVzLCBmdW5jdGlvbiAoYnVmKSB7XG4gICAgICAgICAgICAgICAgdmFycy5zZXQobmFtZSwgYnVmKTtcbiAgICAgICAgICAgICAgICBuZXh0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgIHNlbGYuc2tpcCA9IGZ1bmN0aW9uIChieXRlcykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBieXRlcyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBieXRlcyA9IHZhcnMuZ2V0KGJ5dGVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZ2V0Qnl0ZXMoYnl0ZXMsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBuZXh0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgIHNlbGYuc2NhbiA9IGZ1bmN0aW9uIGZpbmQgKG5hbWUsIHNlYXJjaCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBzZWFyY2ggPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgc2VhcmNoID0gbmV3IEJ1ZmZlcihzZWFyY2gpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihzZWFyY2gpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdzZWFyY2ggbXVzdCBiZSBhIEJ1ZmZlciBvciBhIHN0cmluZycpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgdGFrZW4gPSAwO1xuICAgICAgICAgICAgcGVuZGluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgcG9zID0gYnVmZmVycy5pbmRleE9mKHNlYXJjaCwgb2Zmc2V0ICsgdGFrZW4pO1xuICAgICAgICAgICAgICAgIHZhciBpID0gcG9zLW9mZnNldC10YWtlbjtcbiAgICAgICAgICAgICAgICBpZiAocG9zICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBwZW5kaW5nID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9mZnNldCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXJzLnNldChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlcnMuc2xpY2Uob2Zmc2V0LCBvZmZzZXQgKyB0YWtlbiArIGkpXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgb2Zmc2V0ICs9IHRha2VuICsgaSArIHNlYXJjaC5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXJzLnNldChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlcnMuc2xpY2UoMCwgdGFrZW4gKyBpKVxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlcnMuc3BsaWNlKDAsIHRha2VuICsgaSArIHNlYXJjaC5sZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIG5leHQoKTtcbiAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2goKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpID0gTWF0aC5tYXgoYnVmZmVycy5sZW5ndGggLSBzZWFyY2gubGVuZ3RoIC0gb2Zmc2V0IC0gdGFrZW4sIDApO1xuXHRcdFx0XHR9XG4gICAgICAgICAgICAgICAgdGFrZW4gKz0gaTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBkaXNwYXRjaCgpO1xuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgc2VsZi5wZWVrID0gZnVuY3Rpb24gKGNiKSB7XG4gICAgICAgICAgICBvZmZzZXQgPSAwO1xuICAgICAgICAgICAgc2F3Lm5lc3QoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNiLmNhbGwodGhpcywgdmFycy5zdG9yZSk7XG4gICAgICAgICAgICAgICAgdGhpcy50YXAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBvZmZzZXQgPSBudWxsO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gc2VsZjtcbiAgICB9O1xuICAgIFxuICAgIHZhciBzdHJlYW0gPSBDaGFpbnNhdy5saWdodChidWlsZGVyKTtcbiAgICBzdHJlYW0ud3JpdGFibGUgPSB0cnVlO1xuICAgIFxuICAgIHZhciBidWZmZXJzID0gQnVmZmVycygpO1xuICAgIFxuICAgIHN0cmVhbS53cml0ZSA9IGZ1bmN0aW9uIChidWYpIHtcbiAgICAgICAgYnVmZmVycy5wdXNoKGJ1Zik7XG4gICAgICAgIGRpc3BhdGNoKCk7XG4gICAgfTtcbiAgICBcbiAgICB2YXIgdmFycyA9IFZhcnMoKTtcbiAgICBcbiAgICB2YXIgZG9uZSA9IGZhbHNlLCBjYXVnaHRFbmQgPSBmYWxzZTtcbiAgICBzdHJlYW0uZW5kID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBjYXVnaHRFbmQgPSB0cnVlO1xuICAgIH07XG4gICAgXG4gICAgc3RyZWFtLnBpcGUgPSBTdHJlYW0ucHJvdG90eXBlLnBpcGU7XG4gICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoRXZlbnRFbWl0dGVyLnByb3RvdHlwZSkuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICBzdHJlYW1bbmFtZV0gPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlW25hbWVdO1xuICAgIH0pO1xuICAgIFxuICAgIHJldHVybiBzdHJlYW07XG59O1xuXG5leHBvcnRzLnBhcnNlID0gZnVuY3Rpb24gcGFyc2UgKGJ1ZmZlcikge1xuICAgIHZhciBzZWxmID0gd29yZHMoZnVuY3Rpb24gKGJ5dGVzLCBjYikge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgICAgIGlmIChvZmZzZXQgKyBieXRlcyA8PSBidWZmZXIubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdmFyIGJ1ZiA9IGJ1ZmZlci5zbGljZShvZmZzZXQsIG9mZnNldCArIGJ5dGVzKTtcbiAgICAgICAgICAgICAgICBvZmZzZXQgKz0gYnl0ZXM7XG4gICAgICAgICAgICAgICAgdmFycy5zZXQobmFtZSwgY2IoYnVmKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXJzLnNldChuYW1lLCBudWxsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzZWxmO1xuICAgICAgICB9O1xuICAgIH0pO1xuICAgIFxuICAgIHZhciBvZmZzZXQgPSAwO1xuICAgIHZhciB2YXJzID0gVmFycygpO1xuICAgIHNlbGYudmFycyA9IHZhcnMuc3RvcmU7XG4gICAgXG4gICAgc2VsZi50YXAgPSBmdW5jdGlvbiAoY2IpIHtcbiAgICAgICAgY2IuY2FsbChzZWxmLCB2YXJzLnN0b3JlKTtcbiAgICAgICAgcmV0dXJuIHNlbGY7XG4gICAgfTtcbiAgICBcbiAgICBzZWxmLmludG8gPSBmdW5jdGlvbiAoa2V5LCBjYikge1xuICAgICAgICBpZiAoIXZhcnMuZ2V0KGtleSkpIHtcbiAgICAgICAgICAgIHZhcnMuc2V0KGtleSwge30pO1xuICAgICAgICB9XG4gICAgICAgIHZhciBwYXJlbnQgPSB2YXJzO1xuICAgICAgICB2YXJzID0gVmFycyhwYXJlbnQuZ2V0KGtleSkpO1xuICAgICAgICBjYi5jYWxsKHNlbGYsIHZhcnMuc3RvcmUpO1xuICAgICAgICB2YXJzID0gcGFyZW50O1xuICAgICAgICByZXR1cm4gc2VsZjtcbiAgICB9O1xuICAgIFxuICAgIHNlbGYubG9vcCA9IGZ1bmN0aW9uIChjYikge1xuICAgICAgICB2YXIgZW5kID0gZmFsc2U7XG4gICAgICAgIHZhciBlbmRlciA9IGZ1bmN0aW9uICgpIHsgZW5kID0gdHJ1ZSB9O1xuICAgICAgICB3aGlsZSAoZW5kID09PSBmYWxzZSkge1xuICAgICAgICAgICAgY2IuY2FsbChzZWxmLCBlbmRlciwgdmFycy5zdG9yZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNlbGY7XG4gICAgfTtcbiAgICBcbiAgICBzZWxmLmJ1ZmZlciA9IGZ1bmN0aW9uIChuYW1lLCBzaXplKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2l6ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHNpemUgPSB2YXJzLmdldChzaXplKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgYnVmID0gYnVmZmVyLnNsaWNlKG9mZnNldCwgTWF0aC5taW4oYnVmZmVyLmxlbmd0aCwgb2Zmc2V0ICsgc2l6ZSkpO1xuICAgICAgICBvZmZzZXQgKz0gc2l6ZTtcbiAgICAgICAgdmFycy5zZXQobmFtZSwgYnVmKTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBzZWxmO1xuICAgIH07XG4gICAgXG4gICAgc2VsZi5za2lwID0gZnVuY3Rpb24gKGJ5dGVzKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYnl0ZXMgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBieXRlcyA9IHZhcnMuZ2V0KGJ5dGVzKTtcbiAgICAgICAgfVxuICAgICAgICBvZmZzZXQgKz0gYnl0ZXM7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gc2VsZjtcbiAgICB9O1xuICAgIFxuICAgIHNlbGYuc2NhbiA9IGZ1bmN0aW9uIChuYW1lLCBzZWFyY2gpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZWFyY2ggPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBzZWFyY2ggPSBuZXcgQnVmZmVyKHNlYXJjaCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihzZWFyY2gpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3NlYXJjaCBtdXN0IGJlIGEgQnVmZmVyIG9yIGEgc3RyaW5nJyk7XG4gICAgICAgIH1cbiAgICAgICAgdmFycy5zZXQobmFtZSwgbnVsbCk7XG4gICAgICAgIFxuICAgICAgICAvLyBzaW1wbGUgYnV0IHNsb3cgc3RyaW5nIHNlYXJjaFxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSArIG9mZnNldCA8PSBidWZmZXIubGVuZ3RoIC0gc2VhcmNoLmxlbmd0aCArIDE7IGkrKykge1xuICAgICAgICAgICAgZm9yIChcbiAgICAgICAgICAgICAgICB2YXIgaiA9IDA7XG4gICAgICAgICAgICAgICAgaiA8IHNlYXJjaC5sZW5ndGggJiYgYnVmZmVyW29mZnNldCtpK2pdID09PSBzZWFyY2hbal07XG4gICAgICAgICAgICAgICAgaisrXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKGogPT09IHNlYXJjaC5sZW5ndGgpIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB2YXJzLnNldChuYW1lLCBidWZmZXIuc2xpY2Uob2Zmc2V0LCBvZmZzZXQgKyBpKSk7XG4gICAgICAgIG9mZnNldCArPSBpICsgc2VhcmNoLmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIHNlbGY7XG4gICAgfTtcbiAgICBcbiAgICBzZWxmLnBlZWsgPSBmdW5jdGlvbiAoY2IpIHtcbiAgICAgICAgdmFyIHdhcyA9IG9mZnNldDtcbiAgICAgICAgY2IuY2FsbChzZWxmLCB2YXJzLnN0b3JlKTtcbiAgICAgICAgb2Zmc2V0ID0gd2FzO1xuICAgICAgICByZXR1cm4gc2VsZjtcbiAgICB9O1xuICAgIFxuICAgIHNlbGYuZmx1c2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhcnMuc3RvcmUgPSB7fTtcbiAgICAgICAgcmV0dXJuIHNlbGY7XG4gICAgfTtcbiAgICBcbiAgICBzZWxmLmVvZiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG9mZnNldCA+PSBidWZmZXIubGVuZ3RoO1xuICAgIH07XG4gICAgXG4gICAgcmV0dXJuIHNlbGY7XG59O1xuXG4vLyBjb252ZXJ0IGJ5dGUgc3RyaW5ncyB0byB1bnNpZ25lZCBsaXR0bGUgZW5kaWFuIG51bWJlcnNcbmZ1bmN0aW9uIGRlY29kZUxFdSAoYnl0ZXMpIHtcbiAgICB2YXIgYWNjID0gMDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJ5dGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGFjYyArPSBNYXRoLnBvdygyNTYsaSkgKiBieXRlc1tpXTtcbiAgICB9XG4gICAgcmV0dXJuIGFjYztcbn1cblxuLy8gY29udmVydCBieXRlIHN0cmluZ3MgdG8gdW5zaWduZWQgYmlnIGVuZGlhbiBudW1iZXJzXG5mdW5jdGlvbiBkZWNvZGVCRXUgKGJ5dGVzKSB7XG4gICAgdmFyIGFjYyA9IDA7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBhY2MgKz0gTWF0aC5wb3coMjU2LCBieXRlcy5sZW5ndGggLSBpIC0gMSkgKiBieXRlc1tpXTtcbiAgICB9XG4gICAgcmV0dXJuIGFjYztcbn1cblxuLy8gY29udmVydCBieXRlIHN0cmluZ3MgdG8gc2lnbmVkIGJpZyBlbmRpYW4gbnVtYmVyc1xuZnVuY3Rpb24gZGVjb2RlQkVzIChieXRlcykge1xuICAgIHZhciB2YWwgPSBkZWNvZGVCRXUoYnl0ZXMpO1xuICAgIGlmICgoYnl0ZXNbMF0gJiAweDgwKSA9PSAweDgwKSB7XG4gICAgICAgIHZhbCAtPSBNYXRoLnBvdygyNTYsIGJ5dGVzLmxlbmd0aCk7XG4gICAgfVxuICAgIHJldHVybiB2YWw7XG59XG5cbi8vIGNvbnZlcnQgYnl0ZSBzdHJpbmdzIHRvIHNpZ25lZCBsaXR0bGUgZW5kaWFuIG51bWJlcnNcbmZ1bmN0aW9uIGRlY29kZUxFcyAoYnl0ZXMpIHtcbiAgICB2YXIgdmFsID0gZGVjb2RlTEV1KGJ5dGVzKTtcbiAgICBpZiAoKGJ5dGVzW2J5dGVzLmxlbmd0aCAtIDFdICYgMHg4MCkgPT0gMHg4MCkge1xuICAgICAgICB2YWwgLT0gTWF0aC5wb3coMjU2LCBieXRlcy5sZW5ndGgpO1xuICAgIH1cbiAgICByZXR1cm4gdmFsO1xufVxuXG5mdW5jdGlvbiB3b3JkcyAoZGVjb2RlKSB7XG4gICAgdmFyIHNlbGYgPSB7fTtcbiAgICBcbiAgICBbIDEsIDIsIDQsIDggXS5mb3JFYWNoKGZ1bmN0aW9uIChieXRlcykge1xuICAgICAgICB2YXIgYml0cyA9IGJ5dGVzICogODtcbiAgICAgICAgXG4gICAgICAgIHNlbGZbJ3dvcmQnICsgYml0cyArICdsZSddXG4gICAgICAgID0gc2VsZlsnd29yZCcgKyBiaXRzICsgJ2x1J11cbiAgICAgICAgPSBkZWNvZGUoYnl0ZXMsIGRlY29kZUxFdSk7XG4gICAgICAgIFxuICAgICAgICBzZWxmWyd3b3JkJyArIGJpdHMgKyAnbHMnXVxuICAgICAgICA9IGRlY29kZShieXRlcywgZGVjb2RlTEVzKTtcbiAgICAgICAgXG4gICAgICAgIHNlbGZbJ3dvcmQnICsgYml0cyArICdiZSddXG4gICAgICAgID0gc2VsZlsnd29yZCcgKyBiaXRzICsgJ2J1J11cbiAgICAgICAgPSBkZWNvZGUoYnl0ZXMsIGRlY29kZUJFdSk7XG4gICAgICAgIFxuICAgICAgICBzZWxmWyd3b3JkJyArIGJpdHMgKyAnYnMnXVxuICAgICAgICA9IGRlY29kZShieXRlcywgZGVjb2RlQkVzKTtcbiAgICB9KTtcbiAgICBcbiAgICAvLyB3b3JkOGJlKG4pID09IHdvcmQ4bGUobikgZm9yIGFsbCBuXG4gICAgc2VsZi53b3JkOCA9IHNlbGYud29yZDh1ID0gc2VsZi53b3JkOGJlO1xuICAgIHNlbGYud29yZDhzID0gc2VsZi53b3JkOGJzO1xuICAgIFxuICAgIHJldHVybiBzZWxmO1xufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/binary/index.js\n");

/***/ }),

/***/ "(ssr)/./node_modules/binary/lib/vars.js":
/*!*****************************************!*\
  !*** ./node_modules/binary/lib/vars.js ***!
  \*****************************************/
/***/ ((module) => {

eval("module.exports = function (store) {\n    function getset (name, value) {\n        var node = vars.store;\n        var keys = name.split('.');\n        keys.slice(0,-1).forEach(function (k) {\n            if (node[k] === undefined) node[k] = {};\n            node = node[k]\n        });\n        var key = keys[keys.length - 1];\n        if (arguments.length == 1) {\n            return node[key];\n        }\n        else {\n            return node[key] = value;\n        }\n    }\n    \n    var vars = {\n        get : function (name) {\n            return getset(name);\n        },\n        set : function (name, value) {\n            return getset(name, value);\n        },\n        store : store || {},\n    };\n    return vars;\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvYmluYXJ5L2xpYi92YXJzLmpzIiwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNULDJCQUEyQjtBQUMzQjtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9teS1uZXh0LWVsZWN0cm9uLWFwcC8uL25vZGVfbW9kdWxlcy9iaW5hcnkvbGliL3ZhcnMuanM/YzA3MCJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChzdG9yZSkge1xuICAgIGZ1bmN0aW9uIGdldHNldCAobmFtZSwgdmFsdWUpIHtcbiAgICAgICAgdmFyIG5vZGUgPSB2YXJzLnN0b3JlO1xuICAgICAgICB2YXIga2V5cyA9IG5hbWUuc3BsaXQoJy4nKTtcbiAgICAgICAga2V5cy5zbGljZSgwLC0xKS5mb3JFYWNoKGZ1bmN0aW9uIChrKSB7XG4gICAgICAgICAgICBpZiAobm9kZVtrXSA9PT0gdW5kZWZpbmVkKSBub2RlW2tdID0ge307XG4gICAgICAgICAgICBub2RlID0gbm9kZVtrXVxuICAgICAgICB9KTtcbiAgICAgICAgdmFyIGtleSA9IGtleXNba2V5cy5sZW5ndGggLSAxXTtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMSkge1xuICAgICAgICAgICAgcmV0dXJuIG5vZGVba2V5XTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBub2RlW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICB2YXIgdmFycyA9IHtcbiAgICAgICAgZ2V0IDogZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgICAgIHJldHVybiBnZXRzZXQobmFtZSk7XG4gICAgICAgIH0sXG4gICAgICAgIHNldCA6IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIGdldHNldChuYW1lLCB2YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIHN0b3JlIDogc3RvcmUgfHwge30sXG4gICAgfTtcbiAgICByZXR1cm4gdmFycztcbn07XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/binary/lib/vars.js\n");

/***/ })

};
;