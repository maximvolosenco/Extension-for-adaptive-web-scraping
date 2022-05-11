const path = require('path')
const fs = require('fs')

// Generate pages object
const pages = {}

function getEntryFile (entryPath) {
  let files = fs.readdirSync(entryPath)
  return files
}

const chromeName = getEntryFile(path.resolve(`src/components`))

function getFileExtension (filename) {
  return /[.]/.exec(filename) ? /[^.]+$/.exec(filename)[0] : undefined
}
chromeName.forEach((name) => {
  const fileExtension = getFileExtension(name)
  const fileName = name.replace('.' + fileExtension, '')
  pages[fileName] = {
    entry: `src/components/${name}`,
    template: 'public/index.html',
    filename: `${fileName}.html`
  }
})

module.exports = {
  pages,
  filenameHashing: false,
  chainWebpack: (config) => {
    config.plugin('copy').use(require('copy-webpack-plugin'), [
      [
          {
            from: path.resolve(`src/manifest.json`),
            to: `${path.resolve('dist')}/manifest.json`
          }
        ]
      
    ])
  },
  configureWebpack: {
    output: {
      filename: `js/[name].js`,
      chunkFilename: `[name].js`
    },
    devtool:  'inline-source-map'
  }
}
