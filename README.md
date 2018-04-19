## aframe-potree-loader-component

[![Version](http://img.shields.io/npm/v/aframe-potree-loader-component.svg?style=flat-square)](https://npmjs.org/package/aframe-potree-loader-component)
[![License](http://img.shields.io/npm/l/aframe-potree-loader-component.svg?style=flat-square)](https://npmjs.org/package/aframe-potree-loader-component)

Loads PointClouds using Potree

For [A-Frame](https://aframe.io).

### API

| Property | Description | Default Value |
| -------- | ----------- | ------------- |
|          |             |               |

### Installation

#### Browser

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.6.0/aframe.min.js"></script>
  <script src="https://unpkg.com/aframe-potree-loader-component/dist/aframe-potree-loader-component.min.js"></script>
</head>

<body>
  <a-scene>
    <a-entity potree-loader="foo: bar"></a-entity>
  </a-scene>
</body>
```

#### npm

Install via npm:

```bash
npm install aframe-potree-loader-component
```

Then require and use.

```js
require('aframe');
require('aframe-potree-loader-component');
```
