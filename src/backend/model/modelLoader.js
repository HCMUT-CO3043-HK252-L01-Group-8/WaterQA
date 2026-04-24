const tf = require('@tensorflow/tfjs');

const { pathToFileURL } = require('url');

const fileUrl = '';

module.exports = tf.loadGraphModel(fileUrl);
