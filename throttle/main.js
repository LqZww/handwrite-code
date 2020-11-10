let div = document.querySelector("div")

// 1. 初始版
// let timer = null
// div.addEventListener('drag', (e) => {
//   if (timer) {
//     return
//   }
//   timer = setTimeout(() => {
//     console.log(e.offsetX, e.offsetY);
//     timer = null
//   }, 100)
// })

// 2. 封装
function throttle(fn, wait) {
  let timer = null
  return function () {
    if (timer) {
      return
    }
    timer = setTimeout(() => {
      fn.apply(this, arguments)
      timer = null
    }, wait)
  }
}
div.addEventListener('drag',
  throttle((e) => {
    console.log(e.offsetX, e.offsetY);
  }, 1000)
)