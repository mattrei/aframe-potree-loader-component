## aframe-potree-loader-component

[![Version](http://img.shields.io/npm/v/aframe-potree-loader-component.svg?style=flat-square)](https://npmjs.org/package/aframe-potree-loader-component)
[![License](http://img.shields.io/npm/l/aframe-potree-loader-component.svg?style=flat-square)](https://npmjs.org/package/aframe-potree-loader-component)

Loads point clouds using [Potree](http://potree.org/)

For [A-Frame](https://aframe.io).

### API

#### Properties

| Property | Description | Default Value |
| -------- | ----------- | ------------- |
| src       | Url to the PointCloud files. Expects a _cloud.json_            | '' |
| pointSize | Semantic size of a single point. The lower the more space is between the points, higher values result in low resolution objects. Has no performance impact. | 1 |
| minimumNodePixelSize | Pixel size of a point within a node. The lower the more points will be shown per octree node. Has performance impact. | 150 |
| pointSizeType | How to point adapts to the camera frustum. Either _fixed_, _adaptive_ or  | _adaptive_ |
| pointShape | The shape of a single point. Either _square_, _circle_ or  | _sqaure_ |
| pointColorType | Type of color of a single point in respect of the pointcloud. See for all possible values. | 'rgb' |

The initial position and rotation is specific for each point cloud and has to be set accordingly. 

#### Scene Properties

| Property | Description | Default Value |
| -------- | ----------- | ------------- |
| pointBudget       | Point Budget in millions of all pointclouds in your scene            | 1 |

#### Events

| Property          | Description                                                     |
| --------          | -----------                                                     |
| model-loaded       | The point cloud had been loaded into the scene                 |
| model-error        | The point cloud could not be loaded loading                    |

## Notes on fidelity
_Potree_ automatically adapts the point budget according to the underlying hardware, that said mobile devices are not so well suited for detailed point cloud representations.

### Installation

#### Browser

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.8.0/aframe.min.js"></script>
  <script src="https://unpkg.com/aframe-potree-loader-component/dist/aframe-potree-loader-component.min.js"></script>
</head>

<body>
  <a-scene potree-loader="pointBudget: 1;">
      <a-entity potree-loader="
        src: https://cdn.rawgit.com/potree/potree/develop/pointclouds/lion_takanawa;

        pointSize: 1;
        pointColorType: rgb;
        minimumNodePixelSize: 100;
        "
        position="-1 -1 -5"
        rotation="-85 0 0"
      ></a-entity>
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

### Implementation notes
This is basically just a wrapper around PIX4D's [three-potree-loader package](https://github.com/Pix4D/three-potree-loader). They did all the hard work (and saved myself lots of time) of extracting the core loading and rendering functionality of the [Potree point cloud viewer](https://github.com/potree/potree). That's the spirit of open-source. We all build up on each other and adapt to certain needs, in that case point clouds within _WebVR_.
