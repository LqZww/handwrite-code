let input = document.querySelector("input")

// 1. 初始版
// let timer = null
// input.addEventListener('keyup', () => {
//   if (timer) {
//     clearTimeout(timer)
//   }
//   timer = setTimeout(() => {
//     console.log(input.value);
//     timer = null
//   }, 1000)
// })

// 2. 封装
function debounce(fn, wait) {
  let timer = null
  return function () {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(this, arguments)
      timer = null
    }, wait)
  }
}
input.addEventListener('keyup',
  debounce(() => {
    console.log(input.value);
  }, 1000)
)
