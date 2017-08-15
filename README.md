
# svg-to-component

[![NPM version](https://img.shields.io/npm/v/svg-to-component.svg?style=flat)](https://npmjs.com/package/svg-to-component) [![NPM downloads](https://img.shields.io/npm/dm/svg-to-component.svg?style=flat)](https://npmjs.com/package/svg-to-component) [![CircleCI](https://circleci.com/gh/egoist/svg-to-component/tree/master.svg?style=shield)](https://circleci.com/gh/egoist/svg-to-component/tree/master)  [![donate](https://img.shields.io/badge/$-donate-ff69b4.svg?maxAge=2592000&style=flat)](https://github.com/egoist/donate)

## Install

```bash
yarn add svg-to-component
```

## Usage

```js
const Svg2Component = require('svg-to-component')

// Generate React component from SVG string
new Svg2Component()
  //...........svg string, component name
  .fromString('<svg ...', 'MyIcon')
  .toReactComponent()
  // export default function MyIcon(props) {
  //   return <svg ...>
  // }

// You can also directly generate component from an SVG file
new Svg2Component()
  .fromFileSync('./my-icon.svg', 'optional-component-name')
  .toVueComponent()
```

## API

```js
const svg2component = new Svg2Component()
```

### svg2component.fromString(str, name)

#### str

SVG string.

#### name

Could be either of:

- Component name, either in `kebab-case` or `PascalCase`.
- File path, we extract component name from it.

### svg2component.fromFile(filename, [name])

Return a Promise.

#### filename

Path to SVG file.

#### name

Component name.

### svg2component.fromFileSync(filename, [name])

Like `.fromFile` but sync and return `this`

### svg2component.toReactComponent([opts])

Return a string which represents a React component.

#### opts

##### transformJSX

Type: `boolean`<br>
Default: `true`

### svg2component.toVueComponent([opts])

Return a string which represents a Vue component.

#### opts

##### transformJSX

Type: `boolean`<br>
Default: `true`

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D


## Author

**svg-to-component** © [EGOIST](https://github.com/egoist), Released under the [MIT](./LICENSE) License.<br>
Authored and maintained by EGOIST with help from contributors ([list](https://github.com/egoist/svg-to-component/contributors)).

> [github.com/egoist](https://github.com/egoist) · GitHub [@EGOIST](https://github.com/egoist) · Twitter [@_egoistlily](https://twitter.com/_egoistlily)
