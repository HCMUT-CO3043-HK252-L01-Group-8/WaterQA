const tf = require('@tensorflow/tfjs');

const modelUrl = 'https://raw.githubusercontent.com/HCMUT-CO3043-HK252-L01-Group-8/WaterQA/refs/heads/Feature/AI/src/backend/model/ai-prediction-model.json';
const statsUrl = 'https://raw.githubusercontent.com/HCMUT-CO3043-HK252-L01-Group-8/WaterQA/refs/heads/Feature/AI/src/backend/model/ai-prediction-data-mean-std.json';

const featureCols = ['ph', 'Hardness', 'Solids', 'Chloramines', 'Sulfate', 'Conductivity', 'Organic_carbon', 'Trihalomethanes', 'Turbidity'];

class Model {
  constructor(model, stats) {
    this.model = model;
    this.stats = stats;
  }

  static async create() {
    return new Model(await tf.loadLayersModel(modelUrl), await fetch(statsUrl).then(res => res.json()));
  }

  predict(data) {
    const scaledData = featureCols.map(col => {

      if (!data[col]) {
        return 0;
      }

      return (data[col] - this.stats[col].mean) / this.stats[col].std;
    });

    const inputTensor = tf.tensor2d([scaledData]);
    const prediction = this.model.predict(inputTensor);
    const probability = prediction.dataSync()[0]

    let comment = "Dangerous"

    if (probability >= 0.7) {
      comment = "Good"
    } else if (probability >= 0.5) {
      comment = "Average"
    } else if (probability >= 4) {
      comment = "Possibly Unsafe"
    }

    return {
      probability,
      comment
    }
  }
}

module.exports = Model.create();
