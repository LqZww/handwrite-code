const bind = require('../src/index')

test1('bind可用')
test2('this绑定成功')
test3('this,p1,p2绑定成功')
test4('this,p1绑定成功后传p2调用成功')
test5('new时绑定p1,p2')
test6('new时绑定p1,p2,并且fn有prototype')
test7('不用new,但用类似的对象')

function test1(message) {
  console.log(message);
  Function.prototype.mybind = bind
  console.assert(Function.prototype.mybind !== undefined)
}

function test2(message) {
  console.log(message);
  Function.prototype.mybind = bind
  const fn1 = function () {
    return this
  }
  const newFn1 = fn1.mybind({ name: 'zww' })
  console.assert(newFn1().name === 'zww')
}

function test3(message) {
  console.log(message);
  Function.prototype.mybind = bind
  const fn2 = function (p1, p2) {
    return [this, p1, p2]
  }
  const newFn2 = fn2.mybind({ name: 'zww' }, 1, 2)
  console.assert(newFn2()[0].name === 'zww')
  console.assert(newFn2()[1] === 1)
  console.assert(newFn2()[2] === 2)
}

function test4(message) {
  console.log(message);
  Function.prototype.mybind = bind
  const fn2 = function (p1, p2) {
    return [this, p1, p2]
  }
  const anotherFn2 = fn2.mybind({ name: 'zww' })
  console.assert(anotherFn2(1, 2)[0].name === 'zww')
  console.assert(anotherFn2(1, 2)[1] === 1)
  console.assert(anotherFn2(1, 2)[2] === 2)
}

function test5(message) {
  console.log(message);
  Function.prototype.mybind = bind
  const fn = function (p1, p2) {
    this.p1 = p1
    this.p2 = p2
  }
  const fn2 = fn.mybind(undefined, 'x', 'y')
  const object = new fn2()
  console.assert(object.p1 === 'x', 'x')
  console.assert(object.p2 === 'y', 'y')
}

function test6(message) {
  console.log(message);
  Function.prototype.mybind = bind
  const fn = function (p1, p2) {
    this.p1 = p1
    this.p2 = p2
  }
  fn.prototype.sayHi = function () { }
  const fn2 = fn.mybind(undefined, 'x', 'y')
  const object = new fn2()
  console.assert(object.p1 === 'x', 'x')
  console.assert(object.p2 === 'y', 'y')
  // console.assert(object.__proto__ === fn.prototype)
  console.assert(fn.prototype.isPrototypeOf(object))
  console.assert(typeof object.sayHi === 'function')
}

function test7(message) {
  console.log(message);
  Function.prototype.mybind = bind
  const fn = function (p1, p2) {
    this.p1 = p1
    this.p2 = p2
  }
  fn.prototype.sayHi = function () { }
  const object1 = new fn('a', 'b')
  const fn2 = fn.mybind(object1, 'x', 'y')
  const object = fn2()
  console.assert(object === undefined, 'xxx')
  console.assert(object1.p1 === 'x', 'x')
  console.assert(object1.p2 === 'y', 'y')

}