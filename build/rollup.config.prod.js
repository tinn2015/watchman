process.env.NODE_ENV = 'production';

const { terser } = require('rollup-plugin-terser');
import filesize from 'rollup-plugin-filesize'
const configList = require('./rollup.config');
const {
  cleandir
} = require('rollup-plugin-cleandir')

const resolveFile = function(filePath) {
  return path.join(__dirname, '..', filePath)
}

configList.map((config, index) => {

  config.output.sourcemap = false;
  config.plugins = [
    ...config.plugins,
    ...[
      cleandir('dist'),
      terser(),
      filesize()
    ]
  ]

  return config;
})
module.exports = configList;