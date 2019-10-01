/* global AFRAME THREE */

const potreeLoader = require('@pnext/three-loader')

const PointCloudOctree = potreeLoader.PointCloudOctree;
const Potree = potreeLoader.Potree;
const PointColorType = potreeLoader.PointColorType;
const PointShape = potreeLoader.PointShape;
const PointSizeType = potreeLoader.PointSizeType;
const TreeType = potreeLoader.TreeType;

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

AFRAME.registerSystem('potree-loader', {
  schema: {
    pointBudget: {default: 1}
  },
  init: function() {
    const el = this.el;
    const data = this.data;
    this.potree = new Potree();
    this.potree.pointBudget = data.pointBudget * 1000000;
    this.pointClouds = [];

    // we need a sepearte renderer otherwise we get strange artifacts
    this.renderer = new THREE.WebGLRenderer({canvas: el.canvas});
    const size = new THREE.Vector2();
    el.renderer.getSize(size);
    this.renderer.setSize(size.x, size.y)
  },
  getPotree: function() {
    return this.potree;
  },
  addPointCloud: function(pco) {
    this.pointClouds.push(pco);
  },
  removePointCloud: function(pco) {
    this.pointClouds.forEach(pco => {
      pco.dispose();
    });
  },
  tick: function(time, delta) {
    this._render()
  },
  _render: function() {
    const camera = this.el.camera;
    const result = this.potree.updatePointClouds(this.pointClouds, camera, this.renderer);
    
  }
})

AFRAME.registerComponent('potree-loader', {
  schema: {
    src: {

    },
    pointSize: {
      type: 'number',
      default: 1
    },
    minimumNodePixelSize: {
      default: 150,
      min: 0,
      max: 1000,
      type: 'number'
    },
    pointSizeType: {
      default: 'adaptive',
      oneOf: Object.values(PointSizeType).filter(v => !Number.isInteger(v)).map(v => v.toLowerCase())
    },
    pointShape: {
      default: 'square',
      oneOf: Object.values(PointShape).filter(v => !Number.isInteger(v)).map(v => v.toLowerCase())
    },
    pointColorType: {
      default: 'rgb',
      oneOf: Object.values(PointColorType).filter(v => !Number.isInteger(v)).map(v => v.toLowerCase())
    },
    weighted: {
      default: false,
      type: 'boolean'
    },
  },
  multiple: false,
  init: function () {

    const data = this.data;
    const el = this.el;

    const potree = this.system.getPotree();
    potree
      .loadPointCloud(
        'cloud.js',
        url => `${data.src}/${url}`,
      )
      .then(pco => {
        this.pco = pco;
        this.system.addPointCloud(pco);
        this._updatePointCloud(pco);
        this.system._render()
        

        const box = pco.boundingBox;
        const boundingSphere = new THREE.Sphere();
        box.getBoundingSphere(boundingSphere);
        const center = boundingSphere.center;
        const radius = boundingSphere.radius;

        const span = 1;
        const s = (radius === 0 ? 1 : 1.0 / radius) * span;
        //pco.scale.set(s, s, s);

        const obj = new THREE.Object3D();
        obj.add(pco)
        el.setObject3D('mesh', obj)

        el.emit('model-loaded', pco);
      })
      .catch(err => {
        console.warn(err)
        el.emit('model-error', {src: `${data.src}`});
      } );

  },

  
  update: function (oldData) {
    const data = this.data;
    if (AFRAME.utils.deepEqual(data, oldData)) return;

    if (this.pco) {
      this._updatePointCloud(this.pco);
    }
  },

  _updatePointCloud: function (pco) {
    const data = this.data;
    pco.material.size = data.pointSize;

    pco.material.pointColorType = PointColorType[data.pointColorType.toUpperCase()];
    pco.material.pointShapeType = PointShape[data.pointShape.toUpperCase()];
    pco.material.pointSizeType = PointSizeType[data.pointSizeType.toUpperCase()];

    pco.minimumNodePixelSize = data.minimumNodePixelSize;
  },
  
  remove: function () {
    this.system.removePointCloud(this.pco);
    //this.el.object3D.remove(pco);
  },
  
  tick: function (time, delta) { 
  },
});
