import path from 'path'
import test from 'ava'
import Svg2Component from '../'

const svg = `<svg id="i-minus" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
  <path d="M2 16 L30 16" />
</svg>`

test('from string', t => {
  const svg2component = new Svg2Component()
  svg2component.fromString(svg, 'my-icon')
  t.snapshot(svg2component.toReactComponent(), 'React component')
  t.snapshot(svg2component.toVueComponent(), 'Vue component')
})

test('from string requires component name', t => {
  const svg2component = new Svg2Component()

  t.throws(() => svg2component.fromString(svg), 'component name is required')
})

test('from file', async t => {
  const svg2component = new Svg2Component()
  await svg2component.fromFile(path.join(__dirname, 'fixtures/foo-bar.svg'))
  t.snapshot(svg2component.toReactComponent(), 'React component')
})

test('from string with custom filepath as name', t => {
  const svg2component = new Svg2Component()
  svg2component.fromString(svg, '/foo/bar.svg')
  t.snapshot(svg2component.toReactComponent(), 'React component name: Bar')
})

test('toReactComponent: keep jsx', t => {
  const svg2component = new Svg2Component()
  svg2component.fromString(svg, 'foo')
  t.snapshot(svg2component.toReactComponent({ transformJSX: false }), 'keep jsx')
})

test('toVueComponent: keep jsx', t => {
  const svg2component = new Svg2Component()
  svg2component.fromString(svg, 'foo')
  t.snapshot(svg2component.toVueComponent({ transformJSX: false }), 'keep jsx')
})
