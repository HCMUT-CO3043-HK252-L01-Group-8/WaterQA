const model = require('../model/model');

async function predict(data) {
  return await model.then(m => { return m.predict(data) });
}

module.exports = {
  predict
}
