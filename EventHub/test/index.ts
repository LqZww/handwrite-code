import EventHub from '../src/index'

type TestCase = (msg: string) => void

let test1: TestCase = msg => {
  const eventHub = new EventHub()
  console.assert(eventHub instanceof Object === true, 'eventHub是一个对象')
  console.log(msg);
}

let test2: TestCase = msg => {
  const eventHub = new EventHub()
  let called = false
  eventHub.on('xxx', (data) => {
    called = true
    console.assert(data === 'hhhhhh')
  })
  eventHub.emit('xxx', 'hhhhhh')
  console.assert(called)
  console.log(msg);
}

let test3: TestCase = msg => {
  const eventHub = new EventHub()
  let called = false
  let fn1 = () => {
    called = true
  }
  eventHub.on('yyy', fn1)
  eventHub.off('yyy', fn1)
  eventHub.emit('yyy')
  console.assert(called === false);
  console.log(msg);
}

test1('eventHub是一个对象')
test2('on后，emit会触发on的函数')
test3('off可用')