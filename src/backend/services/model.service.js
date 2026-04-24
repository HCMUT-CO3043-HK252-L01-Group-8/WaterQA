const tf = require('@tensorflow/tfjs');
const { modelPromise, statsPromise } = require('../model/modelLoader');

const featureCols = ['ph', 'Hardness', 'Solids', 'Chloramines', 'Sulfate', 'Conductivity', 'Organic_carbon', 'Trihalomethanes', 'Turbidity'];

class Model {
  constructor(model, stats) {
    this.model = model;
    this.stats = stats;
  }

  static async create() {
    return new Model(await modelPromise, await statsPromise);
  }

  predict(data) {
    const scaledData = featureCols.map(col => {

      if (!data[col]) {
        return stats[col].mean;
      }

      return (data[col] - this.stats[col].mean) / this.stats[col].std;
    });

    const inputTensor = tf.tensor2d([scaledData]);
    const prediction = this.model.predict(inputTensor);
    const probability = prediction.dataSync()[0];

    console.log(`Predicted probability of potability: ${(probability * 100).toFixed(2)}%`);
    console.log(`Classification: ${probability > 0.5 ? 'Potable (Safe)' : 'Not Potable (Unsafe)'}`);
  }
}

module.exports = Model;
