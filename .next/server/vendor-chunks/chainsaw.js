/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/chainsaw";
exports.ids = ["vendor-chunks/chainsaw"];
exports.modules = {

/***/ "(ssr)/./node_modules/chainsaw/index.js":
/*!****************************************!*\
  !*** ./node_modules/chainsaw/index.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var Traverse = __webpack_require__(/*! traverse */ \"(ssr)/./node_modules/traverse/index.js\");\nvar EventEmitter = (__webpack_require__(/*! events */ \"events\").EventEmitter);\n\nmodule.exports = Chainsaw;\nfunction Chainsaw (builder) {\n    var saw = Chainsaw.saw(builder, {});\n    var r = builder.call(saw.handlers, saw);\n    if (r !== undefined) saw.handlers = r;\n    saw.record();\n    return saw.chain();\n};\n\nChainsaw.light = function ChainsawLight (builder) {\n    var saw = Chainsaw.saw(builder, {});\n    var r = builder.call(saw.handlers, saw);\n    if (r !== undefined) saw.handlers = r;\n    return saw.chain();\n};\n\nChainsaw.saw = function (builder, handlers) {\n    var saw = new EventEmitter;\n    saw.handlers = handlers;\n    saw.actions = [];\n\n    saw.chain = function () {\n        var ch = Traverse(saw.handlers).map(function (node) {\n            if (this.isRoot) return node;\n            var ps = this.path;\n\n            if (typeof node === 'function') {\n                this.update(function () {\n                    saw.actions.push({\n                        path : ps,\n                        args : [].slice.call(arguments)\n                    });\n                    return ch;\n                });\n            }\n        });\n\n        process.nextTick(function () {\n            saw.emit('begin');\n            saw.next();\n        });\n\n        return ch;\n    };\n\n    saw.pop = function () {\n        return saw.actions.shift();\n    };\n\n    saw.next = function () {\n        var action = saw.pop();\n\n        if (!action) {\n            saw.emit('end');\n        }\n        else if (!action.trap) {\n            var node = saw.handlers;\n            action.path.forEach(function (key) { node = node[key] });\n            node.apply(saw.handlers, action.args);\n        }\n    };\n\n    saw.nest = function (cb) {\n        var args = [].slice.call(arguments, 1);\n        var autonext = true;\n\n        if (typeof cb === 'boolean') {\n            var autonext = cb;\n            cb = args.shift();\n        }\n\n        var s = Chainsaw.saw(builder, {});\n        var r = builder.call(s.handlers, s);\n\n        if (r !== undefined) s.handlers = r;\n\n        // If we are recording...\n        if (\"undefined\" !== typeof saw.step) {\n            // ... our children should, too\n            s.record();\n        }\n\n        cb.apply(s.chain(), args);\n        if (autonext !== false) s.on('end', saw.next);\n    };\n\n    saw.record = function () {\n        upgradeChainsaw(saw);\n    };\n\n    ['trap', 'down', 'jump'].forEach(function (method) {\n        saw[method] = function () {\n            throw new Error(\"To use the trap, down and jump features, please \"+\n                            \"call record() first to start recording actions.\");\n        };\n    });\n\n    return saw;\n};\n\nfunction upgradeChainsaw(saw) {\n    saw.step = 0;\n\n    // override pop\n    saw.pop = function () {\n        return saw.actions[saw.step++];\n    };\n\n    saw.trap = function (name, cb) {\n        var ps = Array.isArray(name) ? name : [name];\n        saw.actions.push({\n            path : ps,\n            step : saw.step,\n            cb : cb,\n            trap : true\n        });\n    };\n\n    saw.down = function (name) {\n        var ps = (Array.isArray(name) ? name : [name]).join('/');\n        var i = saw.actions.slice(saw.step).map(function (x) {\n            if (x.trap && x.step <= saw.step) return false;\n            return x.path.join('/') == ps;\n        }).indexOf(true);\n\n        if (i >= 0) saw.step += i;\n        else saw.step = saw.actions.length;\n\n        var act = saw.actions[saw.step - 1];\n        if (act && act.trap) {\n            // It's a trap!\n            saw.step = act.step;\n            act.cb();\n        }\n        else saw.next();\n    };\n\n    saw.jump = function (step) {\n        saw.step = step;\n        saw.next();\n    };\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvY2hhaW5zYXcvaW5kZXguanMiLCJtYXBwaW5ncyI6IkFBQUEsZUFBZSxtQkFBTyxDQUFDLHdEQUFVO0FBQ2pDLG1CQUFtQiwwREFBOEI7O0FBRWpEO0FBQ0E7QUFDQSxzQ0FBc0M7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHNDQUFzQztBQUN0QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUFpRCxrQkFBa0I7QUFDbkU7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx3Q0FBd0M7QUFDeEM7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL215LW5leHQtZWxlY3Ryb24tYXBwLy4vbm9kZV9tb2R1bGVzL2NoYWluc2F3L2luZGV4LmpzP2NhOTIiXSwic291cmNlc0NvbnRlbnQiOlsidmFyIFRyYXZlcnNlID0gcmVxdWlyZSgndHJhdmVyc2UnKTtcbnZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXI7XG5cbm1vZHVsZS5leHBvcnRzID0gQ2hhaW5zYXc7XG5mdW5jdGlvbiBDaGFpbnNhdyAoYnVpbGRlcikge1xuICAgIHZhciBzYXcgPSBDaGFpbnNhdy5zYXcoYnVpbGRlciwge30pO1xuICAgIHZhciByID0gYnVpbGRlci5jYWxsKHNhdy5oYW5kbGVycywgc2F3KTtcbiAgICBpZiAociAhPT0gdW5kZWZpbmVkKSBzYXcuaGFuZGxlcnMgPSByO1xuICAgIHNhdy5yZWNvcmQoKTtcbiAgICByZXR1cm4gc2F3LmNoYWluKCk7XG59O1xuXG5DaGFpbnNhdy5saWdodCA9IGZ1bmN0aW9uIENoYWluc2F3TGlnaHQgKGJ1aWxkZXIpIHtcbiAgICB2YXIgc2F3ID0gQ2hhaW5zYXcuc2F3KGJ1aWxkZXIsIHt9KTtcbiAgICB2YXIgciA9IGJ1aWxkZXIuY2FsbChzYXcuaGFuZGxlcnMsIHNhdyk7XG4gICAgaWYgKHIgIT09IHVuZGVmaW5lZCkgc2F3LmhhbmRsZXJzID0gcjtcbiAgICByZXR1cm4gc2F3LmNoYWluKCk7XG59O1xuXG5DaGFpbnNhdy5zYXcgPSBmdW5jdGlvbiAoYnVpbGRlciwgaGFuZGxlcnMpIHtcbiAgICB2YXIgc2F3ID0gbmV3IEV2ZW50RW1pdHRlcjtcbiAgICBzYXcuaGFuZGxlcnMgPSBoYW5kbGVycztcbiAgICBzYXcuYWN0aW9ucyA9IFtdO1xuXG4gICAgc2F3LmNoYWluID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgY2ggPSBUcmF2ZXJzZShzYXcuaGFuZGxlcnMpLm1hcChmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNSb290KSByZXR1cm4gbm9kZTtcbiAgICAgICAgICAgIHZhciBwcyA9IHRoaXMucGF0aDtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBub2RlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBzYXcuYWN0aW9ucy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGggOiBwcyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3MgOiBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cylcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjaDtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcHJvY2Vzcy5uZXh0VGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBzYXcuZW1pdCgnYmVnaW4nKTtcbiAgICAgICAgICAgIHNhdy5uZXh0KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBjaDtcbiAgICB9O1xuXG4gICAgc2F3LnBvcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHNhdy5hY3Rpb25zLnNoaWZ0KCk7XG4gICAgfTtcblxuICAgIHNhdy5uZXh0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYWN0aW9uID0gc2F3LnBvcCgpO1xuXG4gICAgICAgIGlmICghYWN0aW9uKSB7XG4gICAgICAgICAgICBzYXcuZW1pdCgnZW5kJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoIWFjdGlvbi50cmFwKSB7XG4gICAgICAgICAgICB2YXIgbm9kZSA9IHNhdy5oYW5kbGVycztcbiAgICAgICAgICAgIGFjdGlvbi5wYXRoLmZvckVhY2goZnVuY3Rpb24gKGtleSkgeyBub2RlID0gbm9kZVtrZXldIH0pO1xuICAgICAgICAgICAgbm9kZS5hcHBseShzYXcuaGFuZGxlcnMsIGFjdGlvbi5hcmdzKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBzYXcubmVzdCA9IGZ1bmN0aW9uIChjYikge1xuICAgICAgICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgdmFyIGF1dG9uZXh0ID0gdHJ1ZTtcblxuICAgICAgICBpZiAodHlwZW9mIGNiID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgIHZhciBhdXRvbmV4dCA9IGNiO1xuICAgICAgICAgICAgY2IgPSBhcmdzLnNoaWZ0KCk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcyA9IENoYWluc2F3LnNhdyhidWlsZGVyLCB7fSk7XG4gICAgICAgIHZhciByID0gYnVpbGRlci5jYWxsKHMuaGFuZGxlcnMsIHMpO1xuXG4gICAgICAgIGlmIChyICE9PSB1bmRlZmluZWQpIHMuaGFuZGxlcnMgPSByO1xuXG4gICAgICAgIC8vIElmIHdlIGFyZSByZWNvcmRpbmcuLi5cbiAgICAgICAgaWYgKFwidW5kZWZpbmVkXCIgIT09IHR5cGVvZiBzYXcuc3RlcCkge1xuICAgICAgICAgICAgLy8gLi4uIG91ciBjaGlsZHJlbiBzaG91bGQsIHRvb1xuICAgICAgICAgICAgcy5yZWNvcmQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNiLmFwcGx5KHMuY2hhaW4oKSwgYXJncyk7XG4gICAgICAgIGlmIChhdXRvbmV4dCAhPT0gZmFsc2UpIHMub24oJ2VuZCcsIHNhdy5uZXh0KTtcbiAgICB9O1xuXG4gICAgc2F3LnJlY29yZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdXBncmFkZUNoYWluc2F3KHNhdyk7XG4gICAgfTtcblxuICAgIFsndHJhcCcsICdkb3duJywgJ2p1bXAnXS5mb3JFYWNoKGZ1bmN0aW9uIChtZXRob2QpIHtcbiAgICAgICAgc2F3W21ldGhvZF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUbyB1c2UgdGhlIHRyYXAsIGRvd24gYW5kIGp1bXAgZmVhdHVyZXMsIHBsZWFzZSBcIitcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNhbGwgcmVjb3JkKCkgZmlyc3QgdG8gc3RhcnQgcmVjb3JkaW5nIGFjdGlvbnMuXCIpO1xuICAgICAgICB9O1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHNhdztcbn07XG5cbmZ1bmN0aW9uIHVwZ3JhZGVDaGFpbnNhdyhzYXcpIHtcbiAgICBzYXcuc3RlcCA9IDA7XG5cbiAgICAvLyBvdmVycmlkZSBwb3BcbiAgICBzYXcucG9wID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gc2F3LmFjdGlvbnNbc2F3LnN0ZXArK107XG4gICAgfTtcblxuICAgIHNhdy50cmFwID0gZnVuY3Rpb24gKG5hbWUsIGNiKSB7XG4gICAgICAgIHZhciBwcyA9IEFycmF5LmlzQXJyYXkobmFtZSkgPyBuYW1lIDogW25hbWVdO1xuICAgICAgICBzYXcuYWN0aW9ucy5wdXNoKHtcbiAgICAgICAgICAgIHBhdGggOiBwcyxcbiAgICAgICAgICAgIHN0ZXAgOiBzYXcuc3RlcCxcbiAgICAgICAgICAgIGNiIDogY2IsXG4gICAgICAgICAgICB0cmFwIDogdHJ1ZVxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgc2F3LmRvd24gPSBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICB2YXIgcHMgPSAoQXJyYXkuaXNBcnJheShuYW1lKSA/IG5hbWUgOiBbbmFtZV0pLmpvaW4oJy8nKTtcbiAgICAgICAgdmFyIGkgPSBzYXcuYWN0aW9ucy5zbGljZShzYXcuc3RlcCkubWFwKGZ1bmN0aW9uICh4KSB7XG4gICAgICAgICAgICBpZiAoeC50cmFwICYmIHguc3RlcCA8PSBzYXcuc3RlcCkgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuIHgucGF0aC5qb2luKCcvJykgPT0gcHM7XG4gICAgICAgIH0pLmluZGV4T2YodHJ1ZSk7XG5cbiAgICAgICAgaWYgKGkgPj0gMCkgc2F3LnN0ZXAgKz0gaTtcbiAgICAgICAgZWxzZSBzYXcuc3RlcCA9IHNhdy5hY3Rpb25zLmxlbmd0aDtcblxuICAgICAgICB2YXIgYWN0ID0gc2F3LmFjdGlvbnNbc2F3LnN0ZXAgLSAxXTtcbiAgICAgICAgaWYgKGFjdCAmJiBhY3QudHJhcCkge1xuICAgICAgICAgICAgLy8gSXQncyBhIHRyYXAhXG4gICAgICAgICAgICBzYXcuc3RlcCA9IGFjdC5zdGVwO1xuICAgICAgICAgICAgYWN0LmNiKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBzYXcubmV4dCgpO1xuICAgIH07XG5cbiAgICBzYXcuanVtcCA9IGZ1bmN0aW9uIChzdGVwKSB7XG4gICAgICAgIHNhdy5zdGVwID0gc3RlcDtcbiAgICAgICAgc2F3Lm5leHQoKTtcbiAgICB9O1xufTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/chainsaw/index.js\n");

/***/ })

};
;