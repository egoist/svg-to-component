const fs = require('fs')
const path = require('path')
const pascalCase = require('pascal-case')
const pify = require('pify')

const fsp = pify(fs)

function ensureSvgAttrs(str) {
  return str.replace(/([a-z]+):([a-z]+)=/g, (m, p1, p2) => {
    return `${p1}${p2[0].toUpperCase()}${p2.slice(1)}=`
  })
}

function injectProps(str, props) {
  return str.replace(/<svg([^>]+)>/, `<svg$1 {...${props}}>`)
}

function getReactComponent(str, name) {
  return `export default function ${name}(props) {
  return ${ensureSvgAttrs(injectProps(str, 'props'))}
}`
}

function getVueComponent(str, name) {
  return `export default {
  name: '${name}',
  functional: true,
  render: function (h, ctx) {
    return ${ensureSvgAttrs(injectProps(str, 'ctx.data'))}
  }
}`
}

function getComponentNameFromPath(p) {
  const name = path.basename(p).replace(/\.[\s\S]+$/, '')
  return pascalCase(name)
}

function isPath(str) {
  return /^[./]|(^[a-zA-Z]:)/.test(str)
}

module.exports = class Svg2Component {
  fromString(str, name) {
    if (!name) {
      throw new Error('component name is required')
    }
    this.str = str
    this.componentName = isPath(name)
      ? getComponentNameFromPath(name)
      : pascalCase(name)
    return this
  }

  fromFile(filename, name) {
    return fsp.readFile(filename, 'utf8').then(str => {
      this.componentName = name || getComponentNameFromPath(filename)
      this.str = str
    })
  }

  fromFileSync(filename, name) {
    const str = fs.readFileSync(filename, 'utf8')
    this.str = str
    this.componentName = name || getComponentNameFromPath(filename)
    return this
  }

  toComponent(type, { transformJSX = true } = {}) {
    let res
    switch (type) {
      case 'vue':
        res = getVueComponent(this.str, this.componentName)
        break
      case 'react':
        res = getReactComponent(this.str, this.componentName)
        break
      default:
        throw new Error('Unknown component type')
    }

    if (!transformJSX) {
      return res
    }

    const babel = require('babel-core')

    if (type === 'vue') {
      return babel.transform(res, {
        babelrc: false,
        presets: [require.resolve('babel-preset-vue')]
      }).code
    }

    if (type === 'react') {
      return babel.transform(res, {
        babelrc: false,
        plugins: [
          [
            require.resolve('babel-plugin-transform-react-jsx'),
            {
              useBuiltIns: true
            }
          ]
        ]
      }).code
    }
  }

  toReactComponent(opts) {
    return this.toComponent('react', opts)
  }

  toVueComponent(opts) {
    return this.toComponent('vue', opts)
  }
}
