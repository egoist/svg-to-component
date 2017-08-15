const fs = require('fs')
const path = require('path')
const pascalCase = require('pascal-case')
const pify = require('pify')

const fsp = pify(fs)

function injectProps(str, props) {
  return str.replace(/<svg([^>]+)>/, `<svg$1 {...${props}}>`)
}

function getReactComponent(str, name) {
  return `export default function ${name}(props) {
  return ${injectProps(str, 'props')}
}`
}

function getVueComponent(str, name) {
  return `export default {
  name: '${name}',
  functional: true,
  render(h, ctx) {
    return ${injectProps(str, 'ctx.props')}
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

  toComponent(type) {
    switch (type) {
      case 'vue':
        return getVueComponent(this.str, this.componentName)
      case 'react':
        return getReactComponent(this.str, this.componentName)
      default:
        throw new Error('Unknown component type')
    }
  }

  toReactComponent() {
    return this.toComponent('react')
  }

  toVueComponent() {
    return this.toComponent('vue')
  }
}
