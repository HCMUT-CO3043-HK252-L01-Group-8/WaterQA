const tf = require("@tensorflow/tfjs-node");

const { readFile } = require("node:fs/promises");

const featureCols = [
  "ph",
  "Hardness",
  "Solids",
  "Chloramines",
  "Sulfate",
  "Conductivity",
  "Organic_carbon",
  "Trihalomethanes",
  "Turbidity",
];

const colsToImpute = ["ph", "Sulfate", "Trihalomethanes"];

async function loadAndPreprocessData() {
  updateStatus("Fetching and parsing raw CSV data...");

  const csvText = await readFile("./water_potability.csv", "utf-8");

  const lines = csvText.trim().split(/\r?\n/);
  const headers = lines[0].split(",").map((h) => h.trim());

  const rawData = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",");
    const row = {};
    headers.forEach((h, idx) => {
      let val = values[idx].trim();
      row[h] = val === "" ? null : parseFloat(val);
    });
    rawData.push(row);
  }

  updateStatus("Imputing missing values...");
  const means = {};
  colsToImpute.forEach((col) => {
    const validValues = rawData
      .map((r) => r[col])
      .filter((v) => v !== null && !isNaN(v));
    const sum = validValues.reduce((a, b) => a + b, 0);
    means[col] = sum / validValues.length;
  });

  rawData.forEach((row) => {
    colsToImpute.forEach((col) => {
      if (row[col] === null || isNaN(row[col])) {
        row[col] = means[col];
      }
    });
  });

  updateStatus("Standardizing features...");
  const stats = {};
  featureCols.forEach((col) => {
    const values = rawData.map((r) => r[col]);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance =
      values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
    const std = Math.sqrt(variance);
    stats[col] = { mean, std };
  });

  rawData.forEach((row) => {
    featureCols.forEach((col) => {
      row[col] = (row[col] - stats[col].mean) / stats[col].std;
    });
  });

  const xs = rawData.map((row) => featureCols.map((col) => row[col]));
  const ys = rawData.map((row) => [row.Potability]);

  console.log(
    "Data Preprocessing Complete. Feature Stats used for scaling:",
    stats,
  );

  return {
    xsTensor: tf.tensor2d(xs),
    ysTensor: tf.tensor2d(ys),
    stats: stats,
  };
}

const model = tf.sequential();

async function run() {
  try {
    const { xsTensor, ysTensor, stats } = await loadAndPreprocessData();

    updateStatus("Building Neural Network...");

    model.add(
      tf.layers.dense({
        inputShape: [featureCols.length],
        units: 16,
        activation: "relu",
      }),
    );
    model.add(tf.layers.dense({ units: 8, activation: "relu" }));
    model.add(tf.layers.dense({ units: 1, activation: "sigmoid" }));

    model.compile({
      optimizer: tf.train.adam(0.01),
      loss: "binaryCrossentropy",
      metrics: ["accuracy"],
    });

    // tfvis.show.modelSummary({ name: "Model Architecture" }, model);

    const maxLoss = 10.0; // Adjust max expected loss
    const barLength = 40;

    updateStatus("Training model (Check side panel)...");
    await model.fit(xsTensor, ysTensor, {
      epochs: 75,
      batchSize: 32,
      shuffle: true,
      validationSplit: 0.1,
      // callbacks: {
      //   onEpochEnd: (epoch, logs) => {
      //     console.log(
      //       `Epoch ${epoch + 1} | Loss ${logs.loss.toFixed(4)} | Val loss ${logs.val_loss.toFixed(4)} | Acc ${logs.acc.toFixed(4)} | Val acc ${logs.val_acc.toFixed(4)}`,
      //     );
      //   },
      // },
    });

    updateStatus("Training complete! Check console for a sample prediction.");

    xsTensor.dispose();
    ysTensor.dispose();

    const rawSampleInput = {
      ph: 7.0,
      Hardness: 150.0,
      Solids: 20000.0,
      Chloramines: 7.5,
      Sulfate: 330.0,
      Conductivity: 400.0,
      Organic_carbon: 15.0,
      Trihalomethanes: 60.0,
      Turbidity: 4.0,
    };

    const scaledSampleArray = featureCols.map((col) => {
      return (rawSampleInput[col] - stats[col].mean) / stats[col].std;
    });

    const inputTensor = tf.tensor2d([scaledSampleArray]);
    const prediction = model.predict(inputTensor);
    const probability = prediction.dataSync()[0];

    console.log("--- Test Prediction ---");
    console.log("Raw Input:", rawSampleInput);
    console.log(
      `Predicted probability of potability: ${(probability * 100).toFixed(2)}%`,
    );

    model.save("file://data");

    inputTensor.dispose();
  } catch (error) {
    updateStatus(`Error: ${error.message}`);
    console.error(error);
  }

  // const download = document.createElement("button");
  // download.textContent = "Click to download model";

  // download.addEventListener("click", async () => {
  //   await model.save("downloads://model");
  //   updateStatus("Model downloaded successfully!");
  // });

  // document.body.appendChild(download);
}

function updateStatus(message) {
  //document.getElementById("status").innerText = `Status: ${message}`;
  console.log(`Status + ${message}`);
}

run();
