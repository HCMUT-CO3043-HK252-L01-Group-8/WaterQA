const tf = require('@tensorflow/tfjs');

const modelUrl = 'https://raw.githubusercontent.com/HCMUT-CO3043-HK252-L01-Group-8/WaterQA/refs/heads/Feature/AI/src/backend/model/ai-prediction-model.json';
const statsUrl = 'https://raw.githubusercontent.com/HCMUT-CO3043-HK252-L01-Group-8/WaterQA/refs/heads/Feature/AI/src/backend/model/ai-prediction-data-mean-std.json';

module.exports = {
  modelPromise: tf.loadLayersModel(modelUrl),
  statsPromise: fetch(statsUrl).then(res => res.json())
}
