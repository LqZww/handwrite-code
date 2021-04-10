class myPromise {
  static PENDING = 'pending'
  static FULFILLED = 'fulfilled'
  static REJECTED = 'rejected'

  constructor(callback) {
    this.status = myPromise.PENDING
    this.value = null
    this.callbacks = []
    try {
      callback(this.resolve.bind(this), this.reject.bind(this))
    } catch (error) {
      this.reject(error)
    }
  }

  resolve(res) {
    if (this.status === myPromise.PENDING) {
      this.status = myPromise.FULFILLED
      this.value = res
      setTimeout(() => {
        this.callbacks.map(cb => {
          cb.onFulfilled(res)
        })
      });
    }
  }

  reject(err) {
    if (this.status === myPromise.PENDING) {
      this.status = myPromise.REJECTED
      this.value = err
      setTimeout(() => {
        this.callbacks.map(cb => {
          cb.onRejected(err)
        })
      });
    }
  }

  then(onFulfilled, onRejected) {
    if (typeof onFulfilled != 'function') {
      onFulfilled = () => this.value
    }
    if (typeof onRejected != 'function') {
      onRejected = () => this.value
    }

    let promise = new myPromise((resolve, reject) => {
      if (this.status == myPromise.PENDING) {
        this.callbacks.push({
          onFulfilled: res => {
            this.parse(promise, onFulfilled(res), resolve, reject)
          },
          onRejected: err => {
            this.parse(promise, onRejected(err), resolve, reject)
          }
        })
      }
      if (this.status == myPromise.FULFILLED) {
        setTimeout(() => {
          this.parse(promise, onFulfilled(this.value), resolve, reject)
        })

      }
      if (this.status == myPromise.REJECTED) {
        setTimeout(() => {
          this.parse(promise, onRejected(this.value), resolve, reject)
        })
      }
    })
    return promise
  }

  parse(promise, result, resolve, reject) {
    if (promise == result) {
      throw new TypeError("Chaining cycle detected")
    }
    try {
      if (result instanceof myPromise) {
        result.then(resolve, reject)
      } else {
        resolve(result)
      }
    } catch (error) {
      reject(error)
    }
  }

  static resolve(res) {
    return new myPromise((resolve, reject) => {
      if (res instanceof myPromise) {
        res.then(resolve, reject)
      }
      resolve(res)
    })
  }

  static reject(err) {
    return new myPromise((resolve, reject) => {
      reject(err)
    })
  }

  static all(promises) {
    let values = []
    return new myPromise((resolve, reject) => {
      promises.forEach((promise) => {
        promise.then(res => {
          values.push(res)
          if (values.length == promises.length) {
            resolve(values)
          }
        }, err => {
          reject(err)
        })
      })
    })
  }

  static race(promises) {
    return new myPromise((resolve, reject) => {
      promises.map(promise => {
        promise.then(res => {
          resolve(res)
        }, err => {
          reject(err)
        })
      })
    })
  }
}