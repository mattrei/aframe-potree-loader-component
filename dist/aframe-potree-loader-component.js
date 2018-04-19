(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

/* global AFRAME */

//import { PointCloudOctree, Potree } from '@pix4d/three-potree-loader';
const potreeLoader = require('@pix4d/three-potree-loader');

console.log(potreeLoader);

const PointCloudOctree = potreeLoader.PointCloudOctree;
const Potree = potreeLoader.Potree;
const PointColorType = potreeLoader.PointColorType;
const PointShape = potreeLoader.PointShape;
const PointSizeType = potreeLoader.PointSizeType;
const TreeType = potreeLoader.TreeType;

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

AFRAME.registerSystem('potree', {
  schema: {

  },
  init: function() {

  },
  tick: function(time, delta) {

  }
});

//const POINT_CLOUD_BASE_URL = `https://cdn.rawgit.com/potree/potree/develop/pointclouds/lion_takanawa/`;
AFRAME.registerComponent('potree-loader', {
  schema: {
    src: {

    },
    pointSize: {
      type: 'number',
      default: 1
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
    minimumNodePixelSize: {
      default: 150,
      min: 0,
      max: 1000,
      type: 'number'
    },
    weighted: {
      default: false,
      type: 'boolean'
    },
    // gradient?
    pointBudget: {
      type: 'number',
      default: 3
    }
  },
  multiple: false,
  init: function () {

    const data = this.data;
    const el = this.el;

    // Manages the necessary state for loading/updating one or more point clouds.
    const potree = new Potree();
    // Show at most 2 million points.
    potree.pointBudget = data.pointBudget * 1000000;
    
    // List of point clouds which we loaded and need to update.
    const pointClouds = [];

    potree
      .loadPointCloud(
        // The file name of the point cloud which is to be loaded.
      'cloud.js',
      // Given the relative URL of a file, should return a full URL.
      url => `${data.src}/${url}`,
      )
      .then(pco => {
        pointClouds.push(pco);
        
        //el.setObject3D('mesh', pco)
        el.object3D.add(pco);
        
        this.pco = pco;
        
        this._updatePointCloud(data);

        el.emit('modelloaded', pco);

      })
      .catch(err => console.error(err));

    this.potree = potree;
    this.pointClouds = pointClouds;
  },

  
  update: function (oldData) {
    const data = this.data;
    if (AFRAME.utils.deepEqual(data, oldData)) return;


          // The point cloud comes with a material which can be customized directly.
        // Here we just set the size of the points.
    if (this.pco) {
      this._updatePointCloud(data);
    }
  },

  _updatePointCloud: function (data) {
    this.pco.material.size = data.pointSize;

    this.pco.material.pointColorType = PointColorType[data.pointColorType.toUpperCase()];
    this.pco.material.pointShapeType = PointShape[data.pointShape.toUpperCase()];
    this.pco.material.pointSizeType = PointSizeType[data.pointSizeType.toUpperCase()];

    console.log(this.pco.material.pointSizeType);
    

    this.pco.minimumNodePixelSize = data.minimumNodePixelSize;
  },
  
  remove: function () {},

  
  tick: function (time, delta) { 

    const renderer = this.el.sceneEl.renderer;
    const camera = this.el.sceneEl.camera;

    this.potree.updatePointClouds(this.pointClouds, camera, renderer);
  }
});

})));
