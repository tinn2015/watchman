const path = require('path');
const buble = require('@rollup/plugin-buble'); // babel汇总
const typescript = require('@rollup/plugin-typescript');

const resolveFile = function(filePath) {
  return path.join(__dirname, '..', filePath)
}
module.exports = [
  {
    input: resolveFile('src/index.ts'),
    output: {
      file: process.env.NODE_ENV === 'development' ? resolveFile('example/bundle.js') : resolveFile('dist/bundle.js'),
      format: 'umd',
      name: 'WatchMan',
    }, 
    plugins: [
      typescript(),
      buble(),
    ],
  },
]