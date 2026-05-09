const { predict } = require('../services/model.service');

async function predictPotability(req, res) {
  try {
    const data = req.body
    const pred = await predict(data)

    res.status(200).json({ success: true, result: pred, timestamp: new Date().toISOString() });

  } catch (err) {
    console.log("An error has occured: ", err);

    res.status(500).json({ success: false, error: err.message, timestamp: new Date().toISOString() });
  }
}

module.exports = {
  predictPotability
}
