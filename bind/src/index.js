var slice = Array.prototype.slice
function bind(asThis) {
  var args = slice.call(arguments, 1)
  var fn = this
  if (typeof fn !== 'function') {
    throw new Error("bind要调用在函数上")
  }
  function resultFn() {
    var args2 = slice.call(arguments, 0)
    return fn.apply(
      resultFn.prototype.isPrototypeOf(this) ? this : asThis,
      args.concat(args2)
    )
  }
  resultFn.prototype = fn.prototype
  return resultFn
}

// ES6 写法
function _bind(asThis, ...args) {
  const fn = this
  function resultFn(...args2) {
    return fn.call(
      this instanceof resultFn ? this : asThis,
      ...args,
      ...args2
    )
  }
  resultFn.prototype = fn.prototype
  return resultFn
}

module.exports = _bind

if (!Function.prototype.bind) {
  Function.prototype.bind = _bind
}