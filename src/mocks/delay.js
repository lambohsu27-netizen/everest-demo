export const delay = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms ?? 600 + Math.floor(Math.random() * 400))
  })
