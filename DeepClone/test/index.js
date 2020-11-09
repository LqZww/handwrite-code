const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)

const assert = chai.assert
const DeepCloner = require("../src/index")

describe('DeepCloner', () => {
  it("这是一个类", () => {
    assert.isFunction(DeepCloner)
  })

  it("能够赋值基本数据类型", () => {
    const n1 = 123
    const n2 = new DeepCloner().clone(n1)
    assert(n1 === n2)

    const s1 = '123'
    const s2 = new DeepCloner().clone(s1)
    assert(s1 === s2)

    const b1 = true
    const b2 = new DeepCloner().clone(b1)
    assert(b1 === b2)

    const u1 = undefined
    const u2 = new DeepCloner().clone(u1)
    assert(u1 === u2)

    const nu1 = null
    const nu2 = new DeepCloner().clone(nu1)
    assert(nu1 === nu2)

    const sym1 = Symbol()
    const sym2 = new DeepCloner().clone(sym1)
    assert(sym1 === sym2)
  })

  describe('对象', () => {
    it('复制普通对象', () => {
      const a1 = {
        name: 'hhh',
        child: {
          name: 'zww'
        }
      }
      const a2 = new DeepCloner().clone(a1)
      assert(a1 !== a2)
      assert(a1.name === a2.name)
      assert(a1.child !== a2.child)
      assert(a1.child.name === a2.child.name)
    })

    it('复制数组对象', () => {
      const a1 = [
        [1, 2],
        [11, 22],
        [33, 44]
      ]
      const a2 = new DeepCloner().clone(a1)
      assert(a1[0] !== a2[0])
      assert(a1[1] !== a2[1])

    })

    it('复制函数', () => {
      const a1 = function (x, y) {
        return x + y
      }
      a1.xxx = {
        yyy: {
          zzz: 1
        }
      }
      const a2 = new DeepCloner().clone(a1)
      assert(a1 !== a2)
      assert(a1.xxx.yyy.zzz === a2.xxx.yyy.zzz)
      assert(a1.xxx.yyy !== a2.xxx.yyy)
      assert(a1.xxx !== a2.xxx)
      assert(a1(1, 2) === a2(1, 2))
    })

    it('环可以复制', () => {
      const a1 = { name: 'zww' }
      a1.self = a1
      const a2 = new DeepCloner().clone(a1)
      assert(a1 !== a2)
      assert(a1.name === a2.name)
      assert(a1.self !== a2.self)
    })

    xit('不会爆栈', () => {
      const a1 = { child: null }
      let b = a1
      for (let i = 0; i < 10000; i++) {
        b.child = {
          child: null
        }
        b = b.child
      }
      const a2 = new DeepCloner().clone(a1)
      assert(a1 !== a2)
      assert(a1.child !== a2.child)
    })

    it('复制正则表达式', () => {
      const a1 = new RegExp('hi\\d+', 'gi')
      a1.xxx = {
        yyy: {
          zzz: 1
        }
      }
      const a2 = new DeepCloner().clone(a1)
      assert(a1.source === a2.source)
      assert(a1.flags === a2.flags)
      assert(a1 !== a2)

      assert(a1.xxx.yyy.zzz === a2.xxx.yyy.zzz)
      assert(a1.xxx.yyy !== a2.xxx.yyy)
      assert(a1.xxx !== a2.xxx)
    })

    it('复制日期', () => {
      const a1 = new Date()
      a1.xxx = {
        yyy: {
          zzz: 1
        }
      }
      const a2 = new DeepCloner().clone(a1)
      assert(a1 !== a2)
      assert(a1.getTime() === a2.getTime())

      assert(a1.xxx.yyy.zzz === a2.xxx.yyy.zzz)
      assert(a1.xxx.yyy !== a2.xxx.yyy)
      assert(a1.xxx !== a2.xxx)
    })

    it('自动跳过原型属性', () => {
      const a1 = Object.create({ name: 'zww' })
      a1.xxx = { yyy: { zzz: 1 } }
      const a2 = new DeepCloner().clone(a1)
      assert(a1 !== a2)
      assert.isFalse('name' in a2)

      assert(a1.xxx.yyy.zzz === a2.xxx.yyy.zzz)
      assert(a1.xxx.yyy !== a2.xxx.yyy)
      assert(a1.xxx !== a2.xxx)
    })

    it('复杂对象', () => {
      const a1 = {
        n1: NaN,
        n2: Infinity,
        s: '',
        bool: false,
        null: null,
        u: undefined,
        sym: Symbol(),
        o: {
          n1: NaN,
          n2: Infinity,
          s: '',
          bool: false,
          null: null,
          u: undefined,
          sym: Symbol(),
        },
        array: [
          {
            n1: NaN,
            n2: Infinity,
            s: '',
            bool: false,
            null: null,
            u: undefined,
            sym: Symbol(),
          }
        ],
        fn: function () {
          return "fn"
        },
        date: new Date(),
        reg: /test/gi
      }
      const a2 = new DeepCloner().clone(a1)
      assert(a1 !== a2)
      assert.isNaN(a2.n1)
      assert(a1.n2 === a2.n2)
      assert(a1.s === a2.s)
      assert(a1.bool === a2.bool)
      assert(a1.null === a2.null)
      assert(a1.u === a2.u)
      assert(a1.sym === a2.sym)

      assert(a1.o !== a2.o)
      assert.isNaN(a2.o.n1)
      assert(a1.o.n2 === a2.o.n2)
      assert(a1.o.s === a2.o.s)
      assert(a1.o.bool === a2.o.bool)
      assert(a1.o.null === a2.o.null)
      assert(a1.o.u === a2.o.u)
      assert(a1.o.sym === a2.o.sym)

      assert(a1.array !== a2.array)
      assert(a1.array[0] !== a2.array[0])
      assert.isNaN(a2.array[0].n1)
      assert(a1.array[0].n2 === a2.array[0].n2)
      assert(a1.array[0].s === a2.array[0].s)
      assert(a1.array[0].bool === a2.array[0].bool)
      assert(a1.array[0].null === a2.array[0].null)
      assert(a1.array[0].u === a2.array[0].u)
      assert(a1.array[0].sym === a2.array[0].sym)
    })

  })

})