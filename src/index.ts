// import watchError from './lib/error'

// export default {
//   watchError
// }

window.addEventListener('error', (err) => {
  console.log('addEventListener', err)
})
console.log('tttt')
window.onerror = (err) => {
  console.log('onerror', err)
}