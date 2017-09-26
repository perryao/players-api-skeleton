const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const db = {};
const sequelize = new Sequelize(process.env.CONNECTION_STRING, {
  logging: process.env.NODE_ENV === 'development'
});

// read model files
fs.readdirSync(__dirname)
  .filter(file => file.indexOf('.') !== 0 && file !== 'index.js').forEach(file => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

// set associations
Object.keys(db).forEach((modelName) => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;