
const model = require('../model/modelLoader');

class Model {
  constructor() {
    this.model = model;
    console.log(this.model);
  }
}

module.exports = Model;
